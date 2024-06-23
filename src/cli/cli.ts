import { cli, command } from "cleye";

import { Chat } from "../chat/chat";

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
            const chat = new Chat();
            await chat.start(initialPrompt);
          },
        ),
      ],
    });
  }
}
