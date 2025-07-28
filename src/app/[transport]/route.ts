import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
const handler = createMcpHandler(
  (server) => {
    //search-tool
    server.tool(
      "searchProducts",
      "Search for a product by name from the product database",
      {
        name: z.string(), // User input for the product name
      },
      {
        title: "Search Product",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
      async ({ name }) => {
        try {
          const products = await import("../../data/product.json", {
            with: { type: "json" },
          }).then((m) => m.default);

          const result = products.filter((product: any) =>
            product.name.toLowerCase().includes(name.toLowerCase())
          );

          if (result.length === 0) {
            return {
              content: [
                { type: "text", text: `No products found for "${name}"` },
              ],
            };
          }

          return {
            content: [
              {
                type: "text",
                text:
                  `Found ${result.length} product(s):\n\n` +
                  result
                    .map((p: any) => `- ${p.name} (Price: $${p.price})`)
                    .join("\n"),
              },
            ],
          };
        } catch (err) {
          return {
            content: [{ type: "text", text: "Error searching for product" }],
          };
        }
      }
    );
    // Get product details tool
    server.tool(
      "getProductDetails",
      "Get detailed info about a product from the product database",
      {
        name: z.string().describe("Exact name of the product"),
      },
      {
        title: "Get Product Details",
        readOnlyHint: true,
        idempotentHint: true,
        openWorldHint: true,
        destructiveHint: false,
      },
      async ({ name }) => {
        const products = await import("../../data/product.json", {
          with: { type: "json" },
        }).then((m) => m.default);

        const product = products.find(
          (p: any) => p.name.toLowerCase() === name.toLowerCase()
        );

        if (!product) {
          return {
            content: [
              { type: "text", text: `No product found with name "${name}"` },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text: `🛍️ ${product.name}\n💵 $${product.price}\n📝 ${product.description}`,
            },
          ],
        };
      }
    );
    // Get products by category tool
    server.tool(
      "getProductsByCategory",
      "Get products by category",
      {
        category: z.string().describe("Exact name of the product"),
      },
      {
        title: "Get Products by Category",
        readOnlyHint: true,
        idempotentHint: true,
        destructiveHint: false,
        openWorldHint: true,
      },
      async ({ category }) => {
        const products = await import("../../data/product.json", {
          with: { type: "json" },
        }).then((m) => m.default);

        const filtered = products.filter(
          (p: any) => p.category?.toLowerCase() === category.toLowerCase()
        );

        if (filtered.length === 0) {
          return {
            content: [
              {
                type: "text",
                text: `No products found in category '${category}'.`,
              },
            ],
          };
        }

        return {
          content: [
            {
              type: "text",
              text:
                `📦 Products in '${category}':\n\n` +
                filtered
                  .map((p: any) => `- ${p.name} ($${p.price})`)
                  .join("\n"),
            },
          ],
        };
      }
    );
  },
  {
    capabilities: {
      tools: {
        searchProduct: {
          description: "Search for a product by name from the product database",
        },
        getProductDetails: {
          description:
            "Get detailed info about a product from the product database",
        },
        getProductsByCategory: {
          description: "Get products by category",
        },
      },
    },
  },
  {
    redisUrl: process.env.REDIS_url,
    sseEndpoint: "/sse",
    streamableHttpEndpoint: "/mcp",
    verboseLogs: true,
    maxDuration: 60,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
