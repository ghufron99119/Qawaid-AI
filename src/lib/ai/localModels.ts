export const LOCAL_MODELS = {
  reasoning: process.env.OLLAMA_MODEL_REASONING || "glm-5:cloud",
  grammar: process.env.OLLAMA_MODEL_GRAMMAR || "qwen2.5-coder:7b",
  general: process.env.OLLAMA_MODEL_GENERAL || "llama3.2"
};

export type AITask = keyof typeof LOCAL_MODELS;
