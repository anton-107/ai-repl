import { lexer } from "marked";

import { ChatBlock, SupportedCodingLanguage } from "../chat/chat";

export class MarkdownParser {
  public parse(text: string): ChatBlock[] {
    const lex = lexer(text);

    return lex.flatMap((x) => {
      const codeLanguage =
        x.type === "code" && x.lang ? this.mapCodeLanguage(x.lang) : "none";
      return {
        type: x.type === "code" ? "code" : "text",
        codeLanguage,
        content:
          codeLanguage === "none" ? x.raw : x.type === "code" ? x.text : x.raw,
      };
    });
  }
  private mapCodeLanguage(language: string): SupportedCodingLanguage {
    switch (language) {
      case "python":
        return "python";
      case "javascript":
        return "nodejs";
      case "bash":
        return "bash";
      default:
        return "none";
    }
  }
}
