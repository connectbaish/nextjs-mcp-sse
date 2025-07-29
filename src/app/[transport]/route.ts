import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";

// type Product = {
//   id: number;
//   name: string;
//   price: number;
//   description: string;
//   category?: string;
// };

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "search-product",
      "Search for a product and return the query string",
      {
        query: z.string(),
      },
      {
        title: "Search Product",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
      async ({ query }) => {
        return {
          content: [
            {
              type: "text",
              text: `You searched for "${query}".`,
            },
          ],
        };
      }
    );

    // Search tool
    // server.tool(
    //   "searchProducts",
    //   "Search for a product by name from the product database",
    //   {
    //     name: z.string(),
    //   },
    //   {
    //     title: "Search Product",
    //     readOnlyHint: true,
    //     destructiveHint: false,
    //     idempotentHint: true,
    //     openWorldHint: true,
    //   },
    //   async ({ name }) => {
    //     try {
    //       const products: Product[] = await import("../../data/product.json", {
    //         with: { type: "json" },
    //       }).then((m) => m.default);

    //       const result = products.filter((product) =>
    //         product.name.toLowerCase().includes(name.toLowerCase())
    //       );

    //       if (result.length === 0) {
    //         return {
    //           content: [
    //             { type: "text", text: `No products found for "${name}"` },
    //           ],
    //         };
    //       }

    //       return {
    //         content: [
    //           {
    //             type: "text",
    //             text:
    //               `Found ${result.length} product(s):\n\n` +
    //               result
    //                 .map((p) => `- ${p.name} (Price: $${p.price})`)
    //                 .join("\n"),
    //           },
    //         ],
    //       };
    //     } catch (_err) {
    //       return {
    //         content: [{ type: "text", text: "Error searching for product" }],
    //       };
    //     }
    //   }
    // );

    // Get product details tool
    // server.tool(
    //   "getProductDetails",
    //   "Get detailed info about a product from the product database",
    //   {
    //     name: z.string().describe("Exact name of the product"),
    //   },
    //   {
    //     title: "Get Product Details",
    //     readOnlyHint: true,
    //     idempotentHint: true,
    //     openWorldHint: true,
    //     destructiveHint: false,
    //   },
    //   async ({ name }) => {
    //     const products: Product[] = await import("../../data/product.json", {
    //       with: { type: "json" },
    //     }).then((m) => m.default);

    //     const product = products.find(
    //       (p) => p.name.toLowerCase() === name.toLowerCase()
    //     );

    //     if (!product) {
    //       return {
    //         content: [
    //           { type: "text", text: `No product found with name "${name}"` },
    //         ],
    //       };
    //     }

    //     return {
    //       content: [
    //         {
    //           type: "text",
    //           text: `🛍️ ${product.name}\n💵 $${product.price}\n📝 ${product.description}`,
    //         },
    //       ],
    //     };
    //   }
    // );

    // // Get products by category tool
    // server.tool(
    //   "getProductsByCategory",
    //   "Get products by category",
    //   {
    //     category: z.string().describe("Exact name of the category"),
    //   },
    //   {
    //     title: "Get Products by Category",
    //     readOnlyHint: true,
    //     idempotentHint: true,
    //     destructiveHint: false,
    //     openWorldHint: true,
    //   },
    //   async ({ category }) => {
    //     const products: Product[] = await import("../../data/product.json", {
    //       with: { type: "json" },
    //     }).then((m) => m.default);

    //     const filtered = products.filter(
    //       (p) => p.category?.toLowerCase() === category.toLowerCase()
    //     );

    //     if (filtered.length === 0) {
    //       return {
    //         content: [
    //           {
    //             type: "text",
    //             text: `No products found in category '${category}'.`,
    //           },
    //         ],
    //       };
    //     }

    //     return {
    //       content: [
    //         {
    //           type: "text",
    //           text:
    //             `📦 Products in '${category}':\n\n` +
    //             filtered.map((p) => `- ${p.name} ($${p.price})`).join("\n"),
    //         },
    //       ],
    //     };
    //   }
    // );
  },  
  {
    capabilities: {
      tools: {
        "search-product": {
          description: "Search for a product and return the query string",
        },
        // searchProduct: {
        //   description: "Search for a product by name from the product database",
        // },
        // getProductDetails: {
        //   description:
        //     "Get detailed info about a product from the product database",
        // },
        // getProductsByCategory: {
        //   description: "Get products by category",
        // },
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
