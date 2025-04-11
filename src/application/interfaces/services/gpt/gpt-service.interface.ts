export interface IGptResponse {
  message: string | null;
  usage?: {
    /**
     * Number of tokens in the generated completion.
     */
    completion_tokens: number;

    /**
     * Number of tokens in the prompt.
     */
    prompt_tokens: number;

    /**
     * Total number of tokens used in the request (prompt + completion).
     */
    total_tokens: number;
  };
}

export interface IGptCustomParams {
  systemPrompt?: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
  responseFormat?: 'json' | 'text';
  // model?: ChatModel;
  cacheKey?: string;
}

export interface IGptService {
  getCompletion(prompt: string, cacheKey?: string): Promise<IGptResponse>;
  getCustomCompletion(params: IGptCustomParams): Promise<IGptResponse>;
}
