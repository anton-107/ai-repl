import { intro, isCancel, log, outro, spinner, text } from "@clack/prompts";
import { cyan, green, magenta } from "kolorist";

import { BedrockClient } from "../bedrock/bedrock-client";

export class Chat {
  private bedrockClient: BedrockClient;
  constructor() {
    const instructionsPrompt = process.env.INSTRUCTIONS_PROMPT;
    this.bedrockClient = new BedrockClient(instructionsPrompt);
  }
  public async start(initialPrompt: string) {
    intro(`Starting new conversation`);
    await this.nextLoop(initialPrompt);
  }
  private async nextLoop(initialPrompt: string = ""): Promise<void> {
    const userPrompt = await text({
      message: cyan("You"),
      initialValue: initialPrompt,
    });
    const question = String(userPrompt || "").trim();

    if (isCancel(userPrompt) || question === "exit") {
      outro(green("Goodbye!"));
      process.exit(0);
    }

    const infoSpin = spinner();
    infoSpin.start("I am thinking");

    if (!question) {
      infoSpin.stop(magenta("AI"));
      log.error("   Please ask something");
      return await this.nextLoop();
    }

    // todo: ask bedrock
    const aiResponse = await this.bedrockClient.sendQuestion(question);

    infoSpin.stop(magenta("AI"));
    log.success(`${aiResponse}`);
    await this.nextLoop();
  }
}
