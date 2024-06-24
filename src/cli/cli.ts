import { cli, command } from "cleye";

import { Chat } from "../chat/chat";
import { MarkdownRenderer } from "../markdown/chat-blocks-renderer";
import { SyntaxRenderer } from "../syntax-highlighter/syntax-renderer";

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
            const syntaxRenderer = new SyntaxRenderer();
            const chat = new Chat([markdownRenderer, syntaxRenderer]);
            await chat.start(initialPrompt);
          },
        ),
      ],
    });
  }
}
