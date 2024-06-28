import { BashRunnerChat } from "../chat/bash-runner";
import { ChatBlock } from "../chat/chat";

type ChatAction =
  | "exit"
  | "keep-chatting"
  | "run-python"
  | "run-nodejs"
  | "run-bash";

export interface ChatContinuationOption {
  label: string;
  action: ChatAction;
  payload: string | undefined;
}

export interface RunCodeOption extends ChatContinuationOption {
  payload: string;
}

export class ChatRouter {
  public buildOptions(output: ChatBlock[]): ChatContinuationOption[] {
    return this.codeRunnerOptions(output).concat(this.defaultOptions());
  }
  public async routeToNextChat(option: RunCodeOption) {
    const bashRunner = new BashRunnerChat();

    switch (option.action) {
      case "run-nodejs":
      case "run-python":
        throw Error("Running scripts is not implemented yet");
      case "run-bash":
      default:
        await bashRunner.start(option.payload);
    }
  }
  private codeRunnerOptions(output: ChatBlock[]): ChatContinuationOption[] {
    return output
      .filter(
        (x) =>
          x.type === "code" &&
          ["bash", "python", "nodejs"].includes(x.codeLanguage),
      )
      .map((x) => {
        switch (x.codeLanguage) {
          case "python":
            return {
              label: `Run suggested ${x.codeLanguage} script`,
              action: "run-python",
              payload: x.content,
            };
          case "nodejs":
            return {
              label: `Run suggested ${x.codeLanguage} script`,
              action: "run-nodejs",
              payload: x.content,
            };
          default:
            return {
              label: `Run suggested command ($ ${this.truncateCommand(x.content)})`,
              action: "run-bash",
              payload: x.content,
            };
        }
      });
  }
  private defaultOptions(): ChatContinuationOption[] {
    return [
      {
        label: "Keep chatting",
        action: "keep-chatting",
        payload: undefined,
      },
      {
        label: "Exit",
        action: "exit",
        payload: undefined,
      },
    ];
  }
  private truncateCommand(str: string, maxLength: number = 50): string {
    if (str.length <= maxLength) {
      return str;
    }

    const truncatedStr = str.slice(0, maxLength - 3); // Truncate the string, leaving space for the ellipsis
    return `${truncatedStr}...`; // Append the ellipsis
  }
}
