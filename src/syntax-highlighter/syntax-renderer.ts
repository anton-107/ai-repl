import { highlight } from "cli-highlight";

import { ChatBlock, RenderPlugin, SupportedCodingLanguage } from "../chat/chat";

export class SyntaxRenderer implements RenderPlugin {
  public render(content: ChatBlock[]): ChatBlock[] {
    return content.map((block) => {
      if (block.type === "code") {
        block.content = highlight(block.content, {
          language: this.mapCodeLanguage(block.codeLanguage),
        });
      }
      return block;
    });
  }
  private mapCodeLanguage(language: SupportedCodingLanguage): string {
    switch (language) {
      case "python":
        return "python";
      default:
        return "bash";
    }
  }
}
