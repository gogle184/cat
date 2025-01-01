import { App, AwsLambdaReceiver } from "@slack/bolt";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { loadConfig } from "./config/envConfig";
import { SlackController } from "./controllers/slackController";
import { ChatService } from "./services/chatService";
import { MessageService } from "./services/messageService";

let app: App;
let awsLambdaReceiver: AwsLambdaReceiver;

async function initialize() {
	const config = await loadConfig();

	awsLambdaReceiver = new AwsLambdaReceiver({
		signingSecret: config.slackSigningSecret,
	});

	app = new App({
		token: config.slackBotToken,
		receiver: awsLambdaReceiver,
		processBeforeResponse: true,
	});

	// TODO: openaiで決め打ちしているものを修正。他モデル導入時に検討
	const chatService = new ChatService(
		config.apiType,
		config.openaiApiKey,
		process.env.openaiModel || "",
	);
	const messageService = new MessageService(app.client);
	const slackController = new SlackController(messageService, chatService);

	app.event("message", async ({ event, context }) => {
		const retryNum = context.retryNum || 0;
		if (retryNum > 0) {
			return;
		}
		await slackController.handleMessage(event);
	});
}

export const handler: APIGatewayProxyHandlerV2 = async (
	event,
	context,
	callback,
) => {
	if (!app) {
		await initialize();
	}

	const lambdaHandler = awsLambdaReceiver.toHandler();
	return lambdaHandler(event, context, callback);
};
