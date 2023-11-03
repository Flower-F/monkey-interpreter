import { describe, it, expect } from "vitest";
import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";
import { Statement } from "../ast/ast";
import { LetStatement } from "../ast/statements/let";

describe("parser", () => {
  it("should return let statement", () => {
    const input = `
      let x = 5;
      let y = 10;
      let abcd = 123456;
    `;

    const lexer = Lexer.newLexer(input);
    const parser = Parser.newParser(lexer);
    const program = parser.parseProgram();

    expect(checkParseErrors(parser)).toBeFalsy();
    expect(program).toBeDefined();
    expect(program.getStatements()).toHaveLength(3);

    const tests = ["x", "y", "abcd"];
    tests.forEach((expected, index) => {
      const statements = program.getStatements() || [];
      const statement = statements[index];
      expect(testLetStatement(expected, statement)).toBeTruthy();
    });
  });
});

function testLetStatement(expected: string, statement?: Statement) {
  if (!statement) {
    return false;
  }

  if (
    statement.tokenLiteral() !== "let" ||
    !(statement instanceof LetStatement) ||
    statement.getIdentifier()?.getValue() !== expected ||
    statement.getIdentifier()?.tokenLiteral() !== expected
  ) {
    return false;
  }

  return true;
}

function checkParseErrors(parser: Parser) {
  const errors = parser.getErrors();

  if (errors.length > 0) {
    console.error(`parser has ${errors.length} error(s):`);
    errors.forEach((error, index) => {
      console.error(`#${index + 1} ${error}`);
    });
  }

  return errors.length > 0;
}
