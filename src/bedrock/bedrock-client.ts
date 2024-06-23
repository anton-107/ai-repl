import {
  BedrockRuntimeClient,
  ConverseCommand,
  Message,
} from "@aws-sdk/client-bedrock-runtime";

export class BedrockClient {
  public async sendQuestion(userMessage: string) {
    const client = new BedrockRuntimeClient();
    const modelId = "anthropic.claude-3-sonnet-20240229-v1:0";

    // Start a conversation with the user message.
    const conversation: Message[] = [
      {
        role: "user",
        content: [{ text: userMessage }],
      },
    ];

    // Create a command with the model ID, the message, and a basic configuration.
    const command = new ConverseCommand({
      modelId,
      messages: conversation,
    });

    try {
      // Send the command to the model and wait for the response
      const response = await client.send(command);

      // Extract and print the response text.
      if (
        !response.output ||
        !response.output.message ||
        !response.output.message.content
      ) {
        return `[DEBUG] Got empty response: ${response}`;
      }
      return response.output.message.content.map((x) => x.text).join("\n\n\n");
    } catch (err) {
      return `[ERROR] Can't invoke '${modelId}'. Reason: ${err}`;
    }
  }
}
