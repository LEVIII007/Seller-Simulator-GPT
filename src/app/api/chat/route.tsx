import { openai } from '@ai-sdk/openai';
import { convertToCoreMessages, streamText } from 'ai';
import { z } from 'zod';
// import {generateText, tool } from 'ai';
// import searchProductDescription from './description_embeddings';
import { searchProductCategory, searchProductDescription } from './description_embeddings';

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;




export async function POST(req: Request) {
  const { messages } = await req.json();
  console.log(messages);

  const result = await streamText({
    model: openai('gpt-3.5-turbo'),
    system: 'you are a seller and a sales person on an online marketplace and you need to sell products listed in database to user, you can show user the product information to user, compare different products.' +
    'Final responce format : must sound like a sales person tailored to the user quesiton, based on the user data and product data' + 
        'include sales pitch and product information in the response' + 'ask a question in end to engage the user',
    // prompt: problem,
    messages: convertToCoreMessages(messages),
    tools: {
    getDataFromDatabase : {
        description : 'fetch data about any product or user from database given a very descriptive query in natural language, query needs to be very descriptive to get the correct data',
        parameters : z.object({ query : z.string() }),
        execute : async ({query} : { query : string }) => {
          if (!query) {
            throw new Error("Query parameter is required");
          }
          try {
            console.log("getDataFromDatabase called!!!!!!!!!!!!!");
            const response = await fetch('http://127.0.0.1:5000/query', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ query })
            });
      
            if (!response.ok) {
              throw new Error(`API call failed with status ${response.status}`);
            }
      
            const jsondata = await response.json();
            const data = jsondata['data'];
            if (!data || typeof data !== 'string') {
              throw new Error("Invalid response from API");
            }
      
            return data;
          } catch (error) {
            console.error("Error fetching data from database:", error);
            throw error;
          }
        }
      },
      askForConfirmation: {
        description: 'Ask the user for confirmation. This can be used to confirm an action before proceeding. after user confirm the action,give user some response',
        parameters: z.object({
          message: z.string().describe('The message to ask for confirmation.'),
        }),
      },
      
      searchProductDescription: {
        description: 'Search for a product based on descriptions or specifications given by user based on a prompt.',
        parameters: z.object({
          prompt: z.string().describe('The prompt to generate the embedding for.'),
          matchThreshold: z.number().describe('The similarity threshold for matching.'),
          matchCnt: z.number().describe('The number of matches to return.'),
        }),
        execute: async ({ prompt, matchThreshold, matchCnt }: { prompt: string; matchThreshold: number; matchCnt: number }): Promise<string> => {
          try {
            console.log("searchProductDescription called!!!!!!!!!!!!!");
            const result = await searchProductDescription(prompt, matchThreshold, matchCnt);
            return JSON.stringify(result);
          } catch (error : any) {
            return JSON.stringify({ error: error.message});
          }
        },
      },
      searchProductCategory: {
        description: 'Search for a product based of category of product given by user based on a prompt.',
        parameters: z.object({
          prompt: z.string().describe('The prompt to generate the embedding for.'),
          matchThreshold: z.number().describe('The similarity threshold for matching.'),
          matchCnt: z.number().describe('The number of matches to return.'),
        }),
        execute: async ({ prompt, matchThreshold, matchCnt }: { prompt: string; matchThreshold: number; matchCnt: number }): Promise<string> => {
          try {
            console.log("searchProductCategory called!!!!!!!!!!!!!");
            const result = await searchProductCategory(prompt, matchThreshold, matchCnt);
            return JSON.stringify(result);
          } catch (error : any) {
            return JSON.stringify({ error: error.message });
          }
        },
      },
  }
}
);

  return result.toDataStreamResponse();
}