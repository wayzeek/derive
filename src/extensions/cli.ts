import * as readline from "readline/promises";
import { z } from "zod";
import { context, extension, formatMsg, input, output, service } from "@daydreamsai/core";
import chalk from "chalk";
import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import axios from "axios";

const cliContext = context({
  type: "cli",
  key: ({ user }) => user.toString(),
  schema: z.object({ user: z.string() }),
});

// CLI styling configuration
const styles = {
  prompt: chalk.blue.bold('You ⪧ '),
  userLabel: chalk.blue.bold('You'),
  agentLabel: chalk.green.bold('Agent'),
  separator: chalk.gray('─'.repeat(50)),
  errorText: chalk.red,
  exitCommand: chalk.yellow.italic('exit'),
  timestamp: chalk.gray,
  header: chalk.cyan.bold,
};

const clearScreen = () => {
  console.clear();
};

const displayHeader = () => {
  const header = `

ooooooooo                          o88                         
 888    88o  ooooooooo8 oo oooooo  oooo oooo   oooo ooooooooo8 
 888    888 888oooooo8   888    888 888  888   888 888oooooo8  
 888    888 888          888        888   888 888  888         
o888ooo88     88oooo888 o888o      o888o    888      88oooo888 
                                                                                                                
`;
  console.log(styles.header(header));
};

/**
 * Transforms partial format metadata to the standard format
 * @param partialMetadata The metadata in partial format
 * @returns Transformed metadata in standard format
 */
function transformPartialMetadata(partialMetadata: any) {
  // This is a placeholder - the agent will handle the actual transformation
  return partialMetadata;
}

// Store the current metadata request ID for tracking responses
let currentMetadataRequestId: string | null = null;
let currentMetadata: any = null;
const SERVER_PORT = process.env.PORT || 3000;

// Define the AgentMetadata interface for proper typing
interface AgentMetadata {
  setSendFunction: (fn: (context: any, options: any, data: any) => void) => void;
  getSendFunction: () => ((context: any, options: any, data: any) => void) | null;
  setMetadataResponseFunction: (fn: (context: any, options: any, data: any) => void) => void;
  getMetadataResponseFunction: () => ((context: any, options: any, data: any) => void) | null;
  getCurrentRequestId: () => string | null;
  getCurrentMetadata: () => any;
  setCurrentMetadata: (metadata: any) => void;
}

// Define the MetadataProcessor interface for proper typing
interface MetadataProcessor {
  processMetadata: (metadata: any) => any;
  validateMetadata: (metadata: any) => { 
    isValid: boolean; 
    missingFields: string[]; 
    formattingIssues: boolean;
    processedMetadata: any;
  };
}

// Create a service for the agent metadata receiver
const agentMetadataService = service({
  register(container) {
    // Store the send function for later use
    let sendFunction: ((context: any, options: any, data: any) => void) | null = null;
    let metadataResponseFunction: ((context: any, options: any, data: any) => void) | null = null;
    
    container.singleton("agentMetadata", () => ({
      setSendFunction: (fn: (context: any, options: any, data: any) => void) => {
        sendFunction = fn;
      },
      getSendFunction: () => sendFunction,
      setMetadataResponseFunction: (fn: (context: any, options: any, data: any) => void) => {
        metadataResponseFunction = fn;
      },
      getMetadataResponseFunction: () => metadataResponseFunction,
      getCurrentRequestId: () => currentMetadataRequestId,
      getCurrentMetadata: () => currentMetadata,
      setCurrentMetadata: (metadata: any) => {
        currentMetadata = metadata;
      }
    }));
  },
  
  async boot(container) {
    const PORT = process.env.AGENT_PORT || 3001;
    const app = express();
    
    // Middleware to parse JSON bodies
    app.use(bodyParser.json());
    
    // Get the send function
    const agentMetadata = container.resolve("agentMetadata") as AgentMetadata;
    
    // Endpoint to receive metadata from the backend server
    app.post('/agent-metadata', (req, res) => {
      const { metadata, message, requestId } = req.body;
      
      console.log(chalk.magenta.bold('\n📥 Received metadata from server'));
      
      // Store the current request ID and metadata
      currentMetadataRequestId = requestId;
      currentMetadata = metadata;
      
      // Store the metadata in the agent metadata service
      if (typeof agentMetadata.setCurrentMetadata === 'function') {
        agentMetadata.setCurrentMetadata(metadata);
      }
      
      // Process the metadata using the metadata processor
      let processedMetadata = metadata;
      let metadataStatus = 'VALID';
      let missingFields: string[] = [];
      
      try {
        const metadataProcessor = container.resolve('metadataProcessor') as MetadataProcessor;
        if (metadataProcessor) {
          // First validate the metadata
          if (typeof metadataProcessor.validateMetadata === 'function') {
            const validationResult = metadataProcessor.validateMetadata(metadata);
            
            if (validationResult.isValid && !validationResult.formattingIssues) {
              // Metadata is valid and properly formatted
              metadataStatus = 'VALID';
              processedMetadata = metadata;
              console.log(chalk.green('✅ Metadata is valid and properly formatted'));
            } else if (validationResult.isValid && validationResult.formattingIssues) {
              // Metadata has all required information but formatting issues
              metadataStatus = 'REFORMATTED';
              processedMetadata = validationResult.processedMetadata;
              console.log(chalk.blue('🔄 Metadata has been reformatted'));
            } else {
              // Metadata is missing required fields
              metadataStatus = 'INCOMPLETE';
              missingFields = validationResult.missingFields;
              processedMetadata = validationResult.processedMetadata;
              console.log(chalk.yellow('⚠️ Metadata is incomplete'));
              console.log(chalk.yellow(`Missing fields: ${missingFields.join(', ')}`));
            }
          } else if (typeof metadataProcessor.processMetadata === 'function') {
            // Fall back to the old processing method
            processedMetadata = metadataProcessor.processMetadata(metadata);
            console.log(chalk.green('✅ Metadata processed successfully using legacy method'));
          }
        }
      } catch (error) {
        console.error(chalk.red('❌ Error processing metadata:'), error);
      }
      
      // Send the metadata to the agent if send function is available
      const sendFunction = agentMetadata.getSendFunction();
      if (sendFunction) {
        // Use the cliContext directly to ensure proper context handling
        let agentMessage = message || "Please process this metadata and return the processed result.";
        
        // Include both original and processed metadata
        sendFunction(
          cliContext,
          { user: "admin" },
          {
            user: "admin",
            text: `${agentMessage}\n\nOriginal Metadata: ${JSON.stringify(metadata, null, 2)}\n\nProcessed Metadata: ${JSON.stringify(processedMetadata, null, 2)}\n\nMetadata Status: ${metadataStatus}\n\nMissing Fields: ${JSON.stringify(missingFields, null, 2)}\n\nRequest ID: ${requestId}\n\nPlease review the metadata according to the following workflow:\n\n1. If the metadata is already in the correct format with all required fields, return it as is with status 'VALID'\n2. If the metadata contains all required information but is not in the correct format, reformat it to match the standard format and return with status 'REFORMATTED'\n3. If required information is missing, try to guess the missing values if possible. If guessing is not possible, return the metadata with status 'INCOMPLETE' and a list of missing fields that the client needs to provide\n\nAfter processing the metadata, if it's valid or has been successfully reformatted, please register it as an IP asset on Story Protocol and include the registration details in your response.\n\nReturn your response in JSON format within a code block like this:\n\`\`\`json\n{\n  "status": "VALID|REFORMATTED|INCOMPLETE",\n  "missingFields": ["field1", "field2"],\n  "processedMetadata": { ... },\n  "ipRegistration": {\n    "ipId": "string",\n    "transactionHash": "string",\n    "success": true|false,\n    "message": "string",\n    "metadata": {\n      "ipMetadataURI": "string",\n      "nftMetadataURI": "string"\n    }\n  }\n}\n\`\`\``,
          }
        );
        console.log(chalk.green('✅ Metadata sent to agent for review'));
      } else {
        console.log(chalk.red('❌ Send function not available'));
      }
      
      res.json({ success: true });
    });
    
    // Start the server
    app.listen(PORT, () => {
      console.log(chalk.cyan(`Agent is listening for metadata on port ${PORT}`));
    });
  }
});

const readlineService = service({
  register(container) {
    container.singleton("readline", () =>
      readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
    );
  },
});

const getTimestamp = () => {
  return styles.timestamp(`[${new Date().toLocaleTimeString()}]`);
};

export const cli = extension({
  name: "cli",
  services: [readlineService, agentMetadataService],
  contexts: {
    cli: cliContext,
  },
  inputs: {
    "cli:message": input({
      schema: z.object({
        user: z.string(),
        text: z.string(),
      }),
      format: ({ user, text }) =>
        formatMsg({
          role: "user",
          content: text,
          user,
        }),
      async subscribe(send, { container }) {
        const rl = container.resolve<readline.Interface>("readline");
        const agentMetadata = container.resolve("agentMetadata") as AgentMetadata;
        const controller = new AbortController();
        
        // Store the send function for use in the agent endpoint
        agentMetadata.setSendFunction(send);
        
        // Set up the metadata response function
        if (typeof agentMetadata.setMetadataResponseFunction === 'function') {
          const outputs = cli.outputs;
          if (outputs && outputs["cli:metadata-response"]) {
            const metadataResponseOutput = outputs["cli:metadata-response"];
            agentMetadata.setMetadataResponseFunction((context: any, options: any, data: any) => {
              metadataResponseOutput.handler(data, context, { container } as any);
            });
          }
        }

        // Clear screen and show header
        clearScreen();
        displayHeader();
        
        console.log(chalk.cyan.bold('\nWelcome to the Derive CLI!'));
        console.log(styles.separator);
        console.log(chalk.gray(`Type ${styles.exitCommand} to quit\n`));
        console.log(chalk.yellow('Agent is ready to receive metadata from the server...'));
        console.log(chalk.gray('The agent will process metadata when it is received.\n'));

        new Promise<void>(async (resolve) => {
          while (!controller.signal.aborted) {
            const question = await rl.question(styles.prompt);
            
            if (question.toLowerCase() === 'exit') {
              console.log(chalk.yellow('\nGoodbye! 👋\n'));
              break;
            }

            console.log(`${getTimestamp()} ${styles.userLabel}: ${question}\n`);
            
            send(
              cliContext,
              { user: "admin" },
              {
                user: "admin",
                text: question,
              }
            );
          }

          resolve();
        });

        return () => {
          controller.abort();
        };
      },
    }),
  },
  outputs: {
    "cli:message": output({
      description: "Send messages to the user",
      schema: z.object({
        message: z.string().describe("The message to send"),
      }),
      handler(content, ctx, agent) {
        console.log(`${getTimestamp()} ${styles.agentLabel}: ${content.message}\n`);
        console.log(styles.separator + '\n');
        
        // Get the current request ID
        const agentMetadata = agent.container.resolve("agentMetadata") as AgentMetadata;
        const requestId = agentMetadata.getCurrentRequestId();
        
        // If this is a response to a metadata request, use the metadata response output
        if (requestId) {
          const metadataResponseFn = agentMetadata.getMetadataResponseFunction();
          if (metadataResponseFn) {
            // Extract any transformed metadata and IP registration details from the message
            let transformedMetadata = null;
            let missingFields: string[] = [];
            let status: 'VALID' | 'REFORMATTED' | 'INCOMPLETE' = 'VALID';
            let ipRegistration = null;
            
            try {
              // Look for JSON in the message
              const jsonMatch = content.message.match(/```json\n([\s\S]*?)\n```/);
              if (jsonMatch && jsonMatch[1]) {
                const parsedJson = JSON.parse(jsonMatch[1]);
                
                // Extract metadata
                if (parsedJson.processedMetadata) {
                  transformedMetadata = parsedJson.processedMetadata;
                  console.log(chalk.green('✅ Found processed metadata in agent response'));
                }
                
                // Extract missing fields
                if (parsedJson.missingFields && Array.isArray(parsedJson.missingFields)) {
                  missingFields = parsedJson.missingFields;
                  if (missingFields.length > 0) {
                    console.log(chalk.yellow(`⚠️ Missing fields: ${missingFields.join(', ')}`));
                  }
                }
                
                // Extract status
                if (parsedJson.status && ['VALID', 'REFORMATTED', 'INCOMPLETE'].includes(parsedJson.status)) {
                  status = parsedJson.status;
                  console.log(chalk.blue(`ℹ️ Metadata status: ${status}`));
                }
                
                // Extract IP registration details
                if (parsedJson.ipRegistration) {
                  ipRegistration = parsedJson.ipRegistration;
                  console.log(chalk.green('✅ Found IP registration details in agent response'));
                  if (ipRegistration.ipId) {
                    console.log(chalk.green(`IP ID: ${ipRegistration.ipId}`));
                  }
                  if (ipRegistration.transactionHash) {
                    console.log(chalk.green(`Transaction Hash: ${ipRegistration.transactionHash}`));
                  }
                }
              } else {
                // If no JSON found, try to use the processed metadata
                const metadataProcessor = agent.container.resolve('metadataProcessor') as MetadataProcessor;
                if (metadataProcessor && typeof metadataProcessor.processMetadata === 'function') {
                  const originalMetadata = agentMetadata.getCurrentMetadata();
                  if (originalMetadata) {
                    transformedMetadata = metadataProcessor.processMetadata(originalMetadata);
                    console.log(chalk.yellow('⚠️ Using automatically processed metadata as fallback'));
                  }
                }
              }
            } catch (error) {
              console.log(chalk.yellow('⚠️ Could not parse processed metadata from response'));
              // Fallback to the original metadata
              transformedMetadata = agentMetadata.getCurrentMetadata();
            }
            
            // Send the response through the dedicated metadata response output
            metadataResponseFn(
              cliContext,
              { user: "admin" },
              {
                message: content.message,
                requestId,
                transformedMetadata,
                missingFields,
                status,
                ipRegistration
              }
            );
          }
        }
        
        // Add a small delay to ensure prompt appears after all logs
        setTimeout(() => {
          process.stdout.write(styles.prompt);
        }, 100);
        
        return {
          data: content,
          timestamp: Date.now(),
        };
      },
      format: ({ data }) =>
        formatMsg({
          role: "assistant",
          content: data.message,
        }),
    }),
    
    "cli:metadata-response": output({
      description: "Send metadata processing results back to the server",
      schema: z.object({
        message: z.string().describe("The agent's response message"),
        requestId: z.string().describe("The ID of the metadata request"),
        transformedMetadata: z.any().optional().describe("The transformed metadata if available"),
        missingFields: z.array(z.string()).optional().describe("List of missing fields if metadata is incomplete"),
        status: z.enum(["VALID", "REFORMATTED", "INCOMPLETE"]).optional().describe("Status of the metadata processing"),
        ipRegistration: z.object({
          ipId: z.string(),
          transactionHash: z.string(),
          success: z.boolean(),
          message: z.string(),
          metadata: z.object({
            ipMetadataURI: z.string(),
            nftMetadataURI: z.string()
          }).optional()
        }).optional().nullable().describe("IP registration details if available")
      }),
      handler(content, ctx, agent) {
        console.log(chalk.blue('📤 Sending agent response back to server...'));
        
        // Extract IP registration details if available in the JSON response
        let ipRegistration = null;
        try {
          // Look for JSON in the message
          const jsonMatch = content.message.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch && jsonMatch[1]) {
            const parsedJson = JSON.parse(jsonMatch[1]);
            if (parsedJson.ipRegistration) {
              ipRegistration = parsedJson.ipRegistration;
              console.log(chalk.green('✅ Found IP registration details in agent response'));
            }
          }
        } catch (error) {
          console.log(chalk.yellow('⚠️ Could not parse IP registration details from response'));
        }
        
        // Send the response back to the server
        axios.post(`http://localhost:${SERVER_PORT}/agent-response`, {
          requestId: content.requestId,
          agentResponse: content.message,
          transformedMetadata: content.transformedMetadata,
          originalMetadata: currentMetadata,
          missingFields: content.missingFields || [],
          status: content.status || "VALID",
          ipRegistration: content.ipRegistration || ipRegistration
        }).then(() => {
          console.log(chalk.green('✅ Response sent to server'));
          // Clear the current request ID and metadata after sending the response
          currentMetadataRequestId = null;
          currentMetadata = null;
        }).catch(error => {
          console.error(chalk.red('❌ Failed to send response to server:'), error);
        });
        
        return {
          data: content,
          timestamp: Date.now(),
        };
      },
      format: ({ data }) =>
        formatMsg({
          role: "assistant",
          content: data.message,
        }),
    }),
  },
});