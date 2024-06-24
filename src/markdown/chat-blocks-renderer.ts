import { ChatBlock, RenderPlugin } from "../chat/chat";
import { MarkdownParser } from "./parser";

export class MarkdownRenderer implements RenderPlugin {
  private parser = new MarkdownParser();

  public render(content: ChatBlock[]): ChatBlock[] {
    const r: ChatBlock[] = [];
    return content.reduce((acc, block) => {
      const parsedBlocks = this.parser.parse(block.content);
      return acc.concat(parsedBlocks);
    }, r);
  }
}
