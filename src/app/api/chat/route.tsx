import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, generateText, streamText} from 'ai';
import { z } from 'zod';
import * as mathjs from 'mathjs';
// import {generateText, tool } from 'ai';
// import searchProductDescription from './description_embeddings';
import {searchProductDescription, searchByProductName, searchtopsellers  } from './description_embeddings';

// Allow streaming responses up to 30 seconds
export const maxDuration = 50;


export async function POST(req: Request) {
  const { messages } = await req.json();
  // console.log(messages);

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    system: 'you are a sales person and an ENTHUSIASTIC tech guy on an online Electronics marketplace which sells television, mobile phones, laptops, smart watches only and you need to sell products listed in database to user, you can show the product information to user, compare different products.' +
    'if user asks for discounted price of a product, you can show the discounted price of the product' + 
    'if user asks to compare two products which you have suggested, compare laptops and mobile phones on basis of price, RAM, storage, camera quality' +
    'if user wants to negotiate on price, you can offer a 0-10% discount, to calculate the final price you can use calculateDiscount tool.' +
    "if user asks for top seller(trending) products of a category, use searchtopsellers tool to get the top seller products of the category." +
    'include sales pitch and product information in the response' + 'ask a question in end to engage the user.' +
    'if user asks to compare product price with the competitors(Amazon), you can give a compparison of original_price and amazon_price' +
    'Final responce format : A single String. Do not include special symbols like : *, |, "",',
    // prompt: problem,
    messages: convertToCoreMessages(messages),
    tools: {
      searchProductDescription: {
        description: 'Search for a product based on descriptions or specifications given by user based on a prompt.',
        parameters: z.object({
          prompt: z.string().describe('The prompt to generate the embedding for.'),
          matchThreshold: z.number().describe('The similarity threshold for matching.'),
          matchCnt: z.number().describe('The number of matches to return.'),
        }),
        execute: async ({ prompt}: { prompt: string}): Promise<string> => {
          try {
            // console.log("searchProductDescription called!!!!!!!!!!!!!");
            const result = await searchProductDescription(prompt);
            // console.log("searchProductDescription result: ", result);
            return JSON.stringify(result);
          } catch (error : any) {
            return JSON.stringify({ error: error.message});
          }
        },
      },
      searchByproductName: {
        description: 'Search for a product based on name of product given by user based on a prompt.',
        parameters: z.object({
          prompt: z.string().describe('The prompt to generate the embedding for.'),
          matchThreshold: z.number().describe('The similarity threshold for matching.'),
          matchCnt: z.number().describe('The number of matches to return.'),
        }),
        execute: async ({ prompt }: { prompt: string}): Promise<string> => {
          try {
            // console.log("searchProductCategory called!!!!!!!!!!!!!");
            const result = await searchByProductName(prompt);
            // console.log("searchProductCategory result: ", result);
            return JSON.stringify(result);
          } catch (error : any) {
            return JSON.stringify({ error: error.message });
          }
        },
      },
      gettop_sellers: {
        description: 'Get top sellers or trending products of : laptops, television, smartwatch, mobile based on the sales data.',
        parameters: z.object({
          prompt: z.string().describe('The prompt to search top_seller column of database. accepted values : laptop, television, mobile, smartwatch.'),
        }),
        execute: async ({ prompt}: { prompt: string}): Promise<string> => {
          try {
            // console.log("gettop_sellers called!!!!!!!!!!!!!");
            const result = await searchtopsellers(prompt);
            // console.log("gettop_sellers result: ", result);
            return JSON.stringify(result);
          } catch (error : any) {
            return JSON.stringify({ error: error.message });
          }
        },
      },
      calculate:{
        description:
          'A tool for evaluating mathematical expressions. it can be used to calculate new discounted price of products.' +
          'Example expressions: ' +
          "'1.2 * (2 + 4.5)', '12.7 cm to inch', 'sin(45 deg) ^ 2'.",
        parameters: z.object({ expression: z.string() }),
        execute: async ({ expression }) => mathjs.evaluate(expression),
      },
  }
}
);

  return result.toDataStreamResponse();

}