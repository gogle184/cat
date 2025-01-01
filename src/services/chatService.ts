import { OpenAIClient } from "../api/openaiClient";
import type { ApiClient } from "../interfaces/apiClient";

export class ChatService {
	private aiClient!: ApiClient;

	// TODO: openaiで決め打ちしているものを修正。他モデル導入時に検討
	constructor(apiType: string, openaiApiKey: string, model: string) {
		if (!openaiApiKey) {
			throw new Error("API key is not set.");
		}

		switch (apiType) {
			case "openai":
				this.aiClient = new OpenAIClient(openaiApiKey, model);
				break;
			case "gemini":
				// GeminiClientインスタンス
				break;
			case "llama":
				// LlamaClientインスタンス
				break;
			default:
				throw new Error("Unsupported API type");
		}
	}

	async generateResponse(prompt: string) {
		return this.aiClient.chat(prompt);
	}
}
