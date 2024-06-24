import { lexer } from "marked";

import { ChatBlock, SupportedCodingLanguage } from "../chat/chat";

export class MarkdownParser {
  public parse(text: string): ChatBlock[] {
    const lex = lexer(text);

    return lex.flatMap((x) => {
      const type = x.type === "code" ? "code" : "text";
      const codeLanguage =
        x.type === "code" ? this.mapCodeLanguage(x.lang) : "none";
      return {
        type,
        codeLanguage,
        content: x.type === "code" ? x.text : x.raw,
      };
    });
  }
  private mapCodeLanguage(
    language: string | undefined,
  ): SupportedCodingLanguage {
    switch (language) {
      case "python":
        return "python";
      case "javascript":
        return "nodejs";
      case "bash":
      default:
        return "bash";
    }
  }
}
