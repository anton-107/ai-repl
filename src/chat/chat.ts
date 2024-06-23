import { intro, isCancel, log, outro, spinner, text } from "@clack/prompts";
import { cyan, green, magenta } from "kolorist";

export class Chat {
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

    infoSpin.stop(magenta("AI"));
    log.success(`You asked: ${question}. My answer: 42`);
    await this.nextLoop();
  }
}
