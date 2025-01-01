import type { KnownEventFromType } from "@slack/bolt";
import type { GenericMessageEvent } from "@slack/types";
import type { ChatService } from "../services/chatService";
import type { MessageService } from "../services/messageService";

export class SlackController {
	private chatService: ChatService;
	private messageService: MessageService;

	constructor(messageService: MessageService, chatService: ChatService) {
		this.chatService = chatService;
		this.messageService = messageService;
	}

	async handleMessage(event: KnownEventFromType<"message">) {
		if (
			!this.isGenericMessageEvent(event) ||
			event.subtype === "bot_message" ||
			event.bot_id
		) {
			return;
		}

		const text = event.text || "";
		const threadTs = event.thread_ts || event.ts;
		const channel = event.channel;
		const userId = event.user;

		let prevMessageText = "";

		prevMessageText = await this.messageService.fetchThreadMessages(
			channel,
			threadTs,
			userId,
		);

		// 「...」メッセージを送信
		const loadingMessage = await this.messageService.postMessage(
			channel,
			":loading:",
			threadTs,
		);

		// プロンプト作成
		const prompt = this.createPrompt(prevMessageText, text);
		const response = await this.chatService.generateResponse(prompt);

		// 応答メッセージを更新
		if (loadingMessage.ts) {
			await this.messageService.updateMessage(
				channel,
				loadingMessage.ts,
				response,
			);
		} else {
			console.error("Failed to get timestamp for loading message.");
		}
	}

	// 新規作成メッセージか判別（スレッド含む）
	private isGenericMessageEvent(
		event: KnownEventFromType<"message">,
	): event is GenericMessageEvent {
		return event && event.type === "message" && "user" in event;
	}

	private createPrompt(prevMessages: string, currentMessage: string): string {
		if (prevMessages) {
			return `これまでの会話:\n${prevMessages}\nユーザーの質問:\n${currentMessage}`;
		}
		return `ユーザーの質問:\n${currentMessage}`;
	}
}
