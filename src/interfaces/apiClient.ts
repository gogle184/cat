export interface ApiClient {
	chat(prompt: string): Promise<string>;
}
