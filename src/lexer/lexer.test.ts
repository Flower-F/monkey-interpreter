import { describe, it, expect } from "vitest";
import { TokenTypes } from "../token/token";
import { Lexer } from "./lexer";

describe("Lexer", () => {
  it("should return next token", () => {
    const input = `
      let five = 5;
      let ten = 10;
      let add = fn(x, y) {
        x + y;
      }
      let result = add(five, ten);
      !-/*5;
      5 < 10 > 5;
      if (5 < 10) {
        return true;
      } else {
        return false;
      }
      10 == 10;
      10 != 9;
    `;
    const tests = [
      // let five = 5;
      { expectedType: TokenTypes.LET, expectedLiteral: "let" },
      { expectedType: TokenTypes.IDENTIFIER, expectedLiteral: "five" },
      { expectedType: TokenTypes.ASSIGN, expectedLiteral: "=" },
      { expectedType: TokenTypes.INTEGER, expectedLiteral: "5" },
      { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ";" },

      // let ten = 10;
      { expectedType: TokenTypes.LET, expectedLiteral: "let" },
      { expectedType: TokenTypes.IDENTIFIER, expectedLiteral: "ten" },
      { expectedType: TokenTypes.ASSIGN, expectedLiteral: "=" },
      { expectedType: TokenTypes.INTEGER, expectedLiteral: "10" },
      { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ";" },

      // let add = fn(x, y) {
      //   x + y;
      // }
      { expectedType: TokenTypes.LET, expectedLiteral: "let" },
      { expectedType: TokenTypes.IDENTIFIER, expectedLiteral: "add" },
      { expectedType: TokenTypes.ASSIGN, expectedLiteral: "=" },
      { expectedType: TokenTypes.FUNCTION, expectedLiteral: "fn" },
      { expectedType: TokenTypes.LEFT_PAREN, expectedLiteral: "(" },
      { expectedType: TokenTypes.IDENTIFIER, expectedLiteral: "x" },
      { expectedType: TokenTypes.COMMA, expectedLiteral: "," },
      { expectedType: TokenTypes.IDENTIFIER, expectedLiteral: "y" },
      { expectedType: TokenTypes.RIGHT_PAREN, expectedLiteral: ")" },
      { expectedType: TokenTypes.LEFT_BRACE, expectedLiteral: "{" },
      { expectedType: TokenTypes.IDENTIFIER, expectedLiteral: "x" },
      { expectedType: TokenTypes.PLUS, expectedLiteral: "+" },
      { expectedType: TokenTypes.IDENTIFIER, expectedLiteral: "y" },
      { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ";" },
      { expectedType: TokenTypes.RIGHT_BRACE, expectedLiteral: "}" },

      // let result = add(five, ten);
      { expectedType: TokenTypes.LET, expectedLiteral: "let" },
      { expectedType: TokenTypes.IDENTIFIER, expectedLiteral: "result" },
      { expectedType: TokenTypes.ASSIGN, expectedLiteral: "=" },
      { expectedType: TokenTypes.IDENTIFIER, expectedLiteral: "add" },
      { expectedType: TokenTypes.LEFT_PAREN, expectedLiteral: "(" },
      { expectedType: TokenTypes.IDENTIFIER, expectedLiteral: "five" },
      { expectedType: TokenTypes.COMMA, expectedLiteral: "," },
      { expectedType: TokenTypes.IDENTIFIER, expectedLiteral: "ten" },
      { expectedType: TokenTypes.RIGHT_PAREN, expectedLiteral: ")" },
      { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ";" },

      // !-/*5;
      { expectedType: TokenTypes.BANG, expectedLiteral: "!" },
      { expectedType: TokenTypes.MINUS, expectedLiteral: "-" },
      { expectedType: TokenTypes.DIVISION, expectedLiteral: "/" },
      { expectedType: TokenTypes.MULTIPLE, expectedLiteral: "*" },
      { expectedType: TokenTypes.INTEGER, expectedLiteral: "5" },
      { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ";" },

      // 5 < 10 > 5;
      { expectedType: TokenTypes.INTEGER, expectedLiteral: "5" },
      { expectedType: TokenTypes.LESS_THAN, expectedLiteral: "<" },
      { expectedType: TokenTypes.INTEGER, expectedLiteral: "10" },
      { expectedType: TokenTypes.GREATER_THAN, expectedLiteral: ">" },
      { expectedType: TokenTypes.INTEGER, expectedLiteral: "5" },
      { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ";" },

      // if (5 < 10) {
      //   return true;
      // } else {
      //   return false;
      // }
      { expectedType: TokenTypes.IF, expectedLiteral: "if" },
      { expectedType: TokenTypes.LEFT_PAREN, expectedLiteral: "(" },
      { expectedType: TokenTypes.INTEGER, expectedLiteral: "5" },
      { expectedType: TokenTypes.LESS_THAN, expectedLiteral: "<" },
      { expectedType: TokenTypes.INTEGER, expectedLiteral: "10" },
      { expectedType: TokenTypes.RIGHT_PAREN, expectedLiteral: ")" },
      { expectedType: TokenTypes.LEFT_BRACE, expectedLiteral: "{" },
      { expectedType: TokenTypes.RETURN, expectedLiteral: "return" },
      { expectedType: TokenTypes.TRUE, expectedLiteral: "true" },
      { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ";" },
      { expectedType: TokenTypes.RIGHT_BRACE, expectedLiteral: "}" },
      { expectedType: TokenTypes.ELSE, expectedLiteral: "else" },
      { expectedType: TokenTypes.LEFT_BRACE, expectedLiteral: "{" },
      { expectedType: TokenTypes.RETURN, expectedLiteral: "return" },
      { expectedType: TokenTypes.FALSE, expectedLiteral: "false" },
      { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ";" },
      { expectedType: TokenTypes.RIGHT_BRACE, expectedLiteral: "}" },

      // 10 == 10;
      { expectedType: TokenTypes.INTEGER, expectedLiteral: "10" },
      { expectedType: TokenTypes.EQUAL, expectedLiteral: "==" },
      { expectedType: TokenTypes.INTEGER, expectedLiteral: "10" },
      { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ";" },

      // 10 != 9;
      { expectedType: TokenTypes.INTEGER, expectedLiteral: "10" },
      { expectedType: TokenTypes.NOT_EQUAL, expectedLiteral: "!=" },
      { expectedType: TokenTypes.INTEGER, expectedLiteral: "9" },
      { expectedType: TokenTypes.SEMICOLON, expectedLiteral: ";" },

      { expectedType: TokenTypes.EOF, expectedLiteral: "" },
    ];

    const lexer = Lexer.createLexer(input);

    for (const test of tests) {
      const curToken = lexer.getNextToken();
      expect(curToken.type).toEqual(test.expectedType);
      expect(curToken.literal).toEqual(test.expectedLiteral);
    }
  });
});
