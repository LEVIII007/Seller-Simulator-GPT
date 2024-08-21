import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { z } from 'zod';
import * as mathjs from 'mathjs';
// import {generateText, tool } from 'ai';
// import searchProductDescription from './description_embeddings';
import { searchProductCategory, searchProductDescription } from './description_embeddings';

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;


// const { text: answer } = await generateText({
//   model: openai('gpt-4-turbo'),
//   system:
//     'You are solving math problems. ' +
//     'Reason step by step. ' +
//     'Use the calculator when necessary. ' +
//     'When you give the final answer, ' +
//     'provide an explanation for how you arrived at it.',
//   prompt: problem,
//   tools: {
//     calculate: tool({
//       description:
//         'A tool for evaluating mathematical expressions. ' +
//         'Example expressions: ' +
//         "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
//       parameters: z.object({ expression: z.string() }),
//       execute: async ({ expression }) => mathjs.evaluate(expression),
//     }),
//   },
//   maxToolRoundtrips: 10,
// });

// console.log(`ANSWER: ${answer}`);


export async function POST(req: Request) {
  const { messages } = await req.json();
  // console.log(messages);

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    system: 'you are a seller and a sales person on an online Electronics marketplace which sells television, mobile phones, laptops, smart watches only and you need to sell products listed in database to user, you can show the product information to user, compare different products.' +
    'Final responce format : must sound like a sales person tailored to the user quesiton, based on the user data and product data' + 
    'if user asks for discounted price of a product, you can show the discounted price of the product' + 
    'if user asks to compare two products which you have suggested, compare laptops and mobile phones on basis of price, RAM, storage, camera quality' +
    'if user wants to negotiate on price, you can offer a 0-10% discount, to calculate the final price you can use calculateDiscount tool.' +
        'include sales pitch and product information in the response' + 'ask a question in end to engage the user.',
    // prompt: problem,
    messages: convertToCoreMessages(messages),
    tools: {
      searchProductDescription: {
        description:
          "Search for a product based on descriptions or specifications given by user based on a prompt.",
        parameters: z.object({
          prompt: z
            .string()
            .describe("The prompt to generate the embedding for."),
          matchThreshold: z
            .number()
            .describe("The similarity threshold for matching."),
          matchCnt: z.number().describe("The number of matches to return."),
        }),
        execute: async ({ prompt, matchThreshold, matchCnt }: { prompt: string; matchThreshold: number; matchCnt: number }): Promise<string> => {
          try {
            // console.log("searchProductDescription called!!!!!!!!!!!!!");
            const result = await searchProductDescription(prompt);
            console.log("searchProductDescription result: ", result);
            return JSON.stringify(result);
          } catch (error: any) {
            return JSON.stringify({ error: error.message });
          }
        },
      },
      searchProductCategory: {
        description: 'Search for a product based of category of product given by user based on a prompt.',
        parameters: z.object({
          prompt: z
            .string()
            .describe(
              "The prompt to search top_seller column of database. accepted values : laptop, television, mobile, smartwatch."
            ),
        }),
        execute: async ({ prompt, matchThreshold, matchCnt }: { prompt: string; matchThreshold: number; matchCnt: number }): Promise<string> => {
          try {
            // console.log("gettop_sellers called!!!!!!!!!!!!!");
            const result = await searchtopsellers(prompt);
            // console.log("gettop_sellers result: ", result);
            return JSON.stringify(result);
          } catch (error: any) {
            return JSON.stringify({ error: error.message });
          }
        },
      },
      calculate: {
        description:
          "A tool for evaluating mathematical expressions. it can be used to calculate new discounted price of products." +
          "Example expressions: " +
          "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
        parameters: z.object({ expression: z.string() }),
        execute: async ({ expression }) => mathjs.evaluate(expression),
      },
  }
}
);
  console.log(result);
  return result.toDataStreamResponse();

}
