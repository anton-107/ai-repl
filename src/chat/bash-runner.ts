import { log, note } from "@clack/prompts";

export class BashRunnerChat {
  public async start(inputCommand: string) {
    log.message(
      "I am BashRunner agent. I am going to run bash script for you.",
    );
    log.message("Please review the command I am going to run:");

    note(inputCommand, "bash");

    await confirm("Shall i go ahead and run this command?");
  }
}
