import { describe, it, expect } from "vitest";
import { Lexer } from "../lexer/lexer";
import { Parser } from "./parser";
import { LetStatement } from "../ast/statements/letStatement";
import { ReturnStatement } from "../ast/statements/returnStatement";
import { ExpressionStatement } from "../ast/statements/expressionStatement";
import { IdentifierExpression } from "../ast/expressions/identifierExpression";
import { IntegerExpression } from "../ast/expressions/integerExpression";
import { PrefixExpression } from "../ast/expressions/prefixExpression";

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
      expect(expression instanceof IdentifierExpression).toBeTruthy();

      const identifier = expression as IdentifierExpression;
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
      expect(expression instanceof IntegerExpression).toBeTruthy();

      const integer = expression as IntegerExpression;
      expect(integer.getValue()).toBe(5);
      expect(integer.tokenLiteral()).toBe("5");
    });
  });

  it("should parse prefix expressions", () => {
    const prefixTests: [string, string, number][] = [
      ["!5", "!", 5],
      ["-15;", "-", 15],
    ];

    prefixTests.forEach(([input, expectedOperator, expectedInteger]) => {
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
        expect(expression instanceof PrefixExpression).toBeTruthy();

        const prefixExpression = expression as PrefixExpression;
        expect(prefixExpression.getOperator()).toBe(expectedOperator);
        const value = prefixExpression.getValue();
        expect(value instanceof IntegerExpression).toBeTruthy();

        const integer = value as IntegerExpression;
        expect(integer.getValue()).toBe(expectedInteger);
        expect(integer.tokenLiteral()).toBe(expectedInteger.toString());
      });
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
