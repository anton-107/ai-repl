import { confirm, log, note } from "@clack/prompts";
import execSh from "exec-sh";
import { bold, red } from "kolorist";

interface ExecutionResult {
  stdout: string;
  stderr: string;
  code: number;
}

export class BashRunnerChat {
  public async start(inputCommand: string) {
    log.message(
      "I am BashRunner agent. I am going to run bash script for you.",
    );
    log.message("Please review the command I am going to run:");

    note(inputCommand, "bash");

    const isConfirmed = await confirm({
      message: "Shall i go ahead and run this command?",
    });

    if (!isConfirmed) {
      log.info(
        `Ok. I will ${bold(red("not"))} run this command. Can I help with anything else?`,
      );
      log.info(`(type "exit" to quit)`);
      return;
    }
    const result = await this.executeCommand(inputCommand);
    log.message(`I tried running this command and these were the outputs:`);
    log.message(`exit code: ${result.code}`);
    if (result.stdout) {
      log.message(`stdout: ${result.stdout}`);
    }
    if (result.stderr) {
      log.message(`stderr: ${result.stderr}`);
    }
    if (!result.stdout && !result.stderr) {
      log.message("Both stdout and stderr appear to be empty");
    }
    log.info(`What shall i do next?`);
  }
  private async executeCommand(inputCommand: string): Promise<ExecutionResult> {
    let result: { stdout: string; stderr: string };
    try {
      result = await execSh.promise(inputCommand, { stdio: false });
      return { ...result, code: 0 };
    } catch (err) {
      return err as ExecutionResult;
    }
  }
}
