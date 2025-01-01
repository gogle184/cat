import { OpenAI } from "openai";
import type { ApiClient } from "../interfaces/apiClient";
import { defaultSystemPrompt } from "../prompts/systemPrompts";

export class OpenAIClient implements ApiClient {
	private client: OpenAI;
	private model: string;

	constructor(apiKey: string, model: string) {
		if (!model) {
			throw new Error("OpenAI model is not set.");
		}
		this.client = new OpenAI({ apiKey });
		this.model = model;
	}

	async chat(prompt: string) {
		const completions = await this.client.chat.completions.create({
			model: this.model,
			messages: [
				{ role: "system", content: defaultSystemPrompt },
				{ role: "user", content: prompt },
			],
			max_tokens: 1000,
			top_p: 0.5,
			frequency_penalty: 1,
		});

		return (
			completions.choices[0]?.message?.content || "応答が取得できませんでした。"
		);
	}
}
