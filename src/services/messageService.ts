import type { WebClient } from "@slack/web-api";

export class MessageService {
	constructor(private client: WebClient) {}

	async postMessage(channel: string, text: string, threadTs?: string) {
		return await this.client.chat.postMessage({
			channel,
			text,
			thread_ts: threadTs,
			icon_emoji: ":hourglass_flowing_sand:",
			username: process.env.botName,
		});
	}

	async updateMessage(channel: string, ts: string, text: string) {
		return await this.client.chat.update({
			channel,
			ts,
			text,
		});
	}

	async fetchThreadMessages(channel: string, threadTs: string, userId: string) {
		const threadMessages = await this.client.conversations.replies({
			channel,
			ts: threadTs,
			limit: 10,
		});

		const filteredMessages =
			threadMessages.messages
				?.filter((msg) => msg.user === userId && !msg.bot_id)
				.map((msg) => `- ${msg.text}`)
				.join("\n") || "";

		return filteredMessages;
	}
}
