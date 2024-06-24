import { cli, command } from "cleye";

import { Chat } from "../chat/chat";
import { MarkdownRenderer } from "../markdown/chat-blocks-renderer";

export class CommandLineInterface {
  constructor() {}
  public run() {
    cli({
      commands: [
        command(
          {
            name: "chat",
            parameters: ["[prompt]"],
          },
          async (argv: { _: string[] }) => {
            const initialPrompt = argv._.join(" ").trim();
            const markdownRenderer = new MarkdownRenderer();
            const chat = new Chat([markdownRenderer]);
            await chat.start(initialPrompt);
          },
        ),
      ],
    });
  }
}
