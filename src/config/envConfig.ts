import { GetParameterCommand, SSMClient } from "@aws-sdk/client-ssm";

const ssmClient = new SSMClient({ region: "ap-northeast-1" });

const getSSMParameter = async (name: string, key: string): Promise<string> => {
	const command = new GetParameterCommand({
		Name: name,
		WithDecryption: true,
	});
	const response = await ssmClient.send(command);
	const jsonValue = JSON.parse(response.Parameter?.Value || "{}");
	return jsonValue[key];
};

// TODO: キャッシュまたはjson作って保持するように修正する
export const loadConfig = async () => {
	const parameterStoreName = process.env.parameterStoreName || "";
	const slackSigningSecret = await getSSMParameter(
		parameterStoreName,
		"slack_signing_secret",
	);
	const slackBotToken = await getSSMParameter(
		parameterStoreName,
		"slack_bot_token",
	);

	// TODO: openaiで決め打ちしているものを修正。他モデル導入時に検討
	const openaiApiKey = await getSSMParameter(
		parameterStoreName,
		"openai_api_key",
	);
	const apiType = process.env.apiType || "openai";

	return {
		slackSigningSecret,
		slackBotToken,
		openaiApiKey,
		apiType: apiType,
	};
};
