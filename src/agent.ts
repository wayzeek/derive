import { createGoogleGenerativeAI } from '@ai-sdk/google';
import {
  createDreams,
  createContainer,
  LogLevel,
  createMemoryStore,
  createChromaVectorStore,
} from "@daydreamsai/core";
import { goalContexts } from "./contexts/goal-context";
import { cli } from "./extensions";
import { actions } from "./actions";
import { outputs } from "./outputs";
import { createStoryClient } from './utils/story';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const model = google("gemini-2.0-flash-001") as any;

// Initialize Story Protocol client
const storyClient = createStoryClient();

// Create container and register Story Protocol client
const container = createContainer();
container.register('storyClient', () => storyClient);

// Configure agent settings
const agentConfig = {
    logger: LogLevel.DEBUG,
    container,
    model,
    extensions: [cli],
    memory: {
      store: createMemoryStore(),
      vector: createChromaVectorStore("derive", "http://localhost:8000"),
    },
    context: goalContexts,
    actions,
    outputs,
};

// Create the agent
const agent = createDreams(agentConfig);

agent.start();
  
