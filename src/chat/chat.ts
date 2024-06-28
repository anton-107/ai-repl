import {
  intro,
  isCancel,
  log,
  note,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import { cyan, green, magenta } from "kolorist";

import { BedrockClient } from "../bedrock/bedrock-client";
import { ChatContinuationOption, ChatRouter } from "../router/chat-router";

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
  private router: ChatRouter = new ChatRouter();

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
      this.goodbye();
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
    infoSpin.stop(magenta("AI"));
    const blocks = this.renderResponse(aiResponse);

    // select next step:
    return await this.selectNextStep(blocks);
  }

  private renderResponse(aiResponse: string): ChatBlock[] {
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
    return blocks;
  }

  private async selectNextStep(blocks: ChatBlock[]) {
    const options = this.router.buildOptions(blocks);
    if (options.length === 0) {
      return await this.nextLoop();
    }

    const nextStep: symbol | ChatContinuationOption = await select({
      message: `${magenta("AI:")} What do you want to do next?`,
      options: options.map((option) => {
        return {
          value: option,
          label: option.label,
        };
      }),
    });

    if (typeof nextStep === "symbol") {
      return await this.nextLoop();
    }

    switch (nextStep.action) {
      case "exit":
        return this.goodbye();
      case "keep-chatting":
        return await this.nextLoop();
      default:
        if (typeof nextStep.payload !== "string") {
          throw Error(`Can not run code without payload`);
        }
        await this.router.routeToNextChat({
          ...nextStep,
          payload: nextStep.payload,
        });
        return await this.nextLoop();
    }
  }

  private goodbye() {
    outro(green("Goodbye!"));
    process.exit(0);
  }
}
