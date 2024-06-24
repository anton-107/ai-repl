import {
  intro,
  isCancel,
  log,
  note,
  outro,
  spinner,
  text,
} from "@clack/prompts";
import { cyan, green, magenta } from "kolorist";

import { BedrockClient } from "../bedrock/bedrock-client";

export interface RenderPlugin {
  render(content: ChatBlock[]): ChatBlock[];
}

export type SupportedCodingLanguage = "none" | "bash" | "python" | "nodejs";

export interface ChatBlock {
  type: "text" | "code";
  codeLanguage: SupportedCodingLanguage;
  content: string;
}

export class Chat {
  private bedrockClient: BedrockClient;

  constructor(private renderPlugins: RenderPlugin[] = []) {
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

    // ask bedrock
    const aiResponse = await this.bedrockClient.sendQuestion(question);

    // render response
    const plainBlocks: ChatBlock[] = [
      {
        type: "text",
        codeLanguage: "none",
        content: aiResponse,
      },
    ];
    const blocks: ChatBlock[] = this.renderPlugins.reduce((acc, plugin) => {
      return plugin.render(acc);
    }, plainBlocks);

    infoSpin.stop(magenta("AI"));
    blocks.forEach((block) => {
      if (block.type === "code") {
        note(
          block.content,
          block.codeLanguage !== "none" ? block.codeLanguage : "",
        );
      } else if (block.content.trim().length > 0) {
        log.message(`${block.content}`);
      }
    });

    await this.nextLoop();
  }
}
