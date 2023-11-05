import { describe, it, expect } from "vitest";
import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";
import { LetStatement } from "../ast/statements/letStatement";
import { ReturnStatement } from "../ast/statements/returnStatement";
import { ExpressionStatement } from "../ast/statements/expressionStatement";
import { Identifier } from "../ast/identifier";
import { Integer } from "../ast/integer";

describe("parser", () => {
  it("should parse let statement", () => {
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

    const statements = program.getStatements();
    expect(statements).toHaveLength(3);

    const tests = ["x", "y", "abcd"];
    tests.forEach((expected, index) => {
      const statement = statements[index];

      expect(statement?.tokenLiteral()).toBe("let");
      expect(statement instanceof LetStatement).toBeTruthy();

      const letStatement = statement as LetStatement;
      expect(letStatement.getName()?.getValue()).toBe(expected);
      expect(letStatement.getName()?.tokenLiteral()).toBe(expected);
    });
  });

  it("should parse return statement", () => {
    const input = `
      return 5;
      return 10;
      return 12345;
    `;

    const lexer = Lexer.newLexer(input);
    const parser = Parser.newParser(lexer);
    const program = parser.parseProgram();

    expect(checkParseErrors(parser)).toBeFalsy();
    expect(program).toBeDefined();

    const statements = program.getStatements();
    expect(statements).toHaveLength(3);

    statements.forEach((statement) => {
      expect(statement.tokenLiteral()).toBe("return");
      expect(statement instanceof ReturnStatement).toBeTruthy();
    });
  });

  it("should parse identifier expression", () => {
    const input = "abcd;";
    const lexer = Lexer.newLexer(input);
    const parser = Parser.newParser(lexer);
    const program = parser.parseProgram();

    expect(checkParseErrors(parser)).toBeFalsy();
    expect(program).toBeDefined();

    const statements = program.getStatements();
    expect(statements).toHaveLength(1);

    statements.forEach((statement) => {
      expect(statement instanceof ExpressionStatement).toBeTruthy();

      const expression = (statement as ExpressionStatement).getExpression();
      expect(expression instanceof Identifier).toBeTruthy();

      const identifier = expression as Identifier;
      expect(identifier.getValue()).toBe("abcd");
      expect(identifier.tokenLiteral()).toBe("abcd");
    });
  });

  it("should parse integer literal expression", () => {
    const input = "5;";
    const lexer = Lexer.newLexer(input);
    const parser = Parser.newParser(lexer);
    const program = parser.parseProgram();

    expect(checkParseErrors(parser)).toBeFalsy();
    expect(program).toBeDefined();

    const statements = program.getStatements();
    expect(statements).toHaveLength(1);

    statements.forEach((statement) => {
      expect(statement instanceof ExpressionStatement).toBeTruthy();

      const expression = (statement as ExpressionStatement).getExpression();
      expect(expression instanceof Integer).toBeTruthy();

      const integerLiteral = expression as Integer;
      expect(integerLiteral.getValue()).toBe(5);
      expect(integerLiteral.tokenLiteral()).toBe("5");
    });
  });
});

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
