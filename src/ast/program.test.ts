import { describe, it, expect } from "vitest";
import { Program } from "./program";
import { LetStatement } from "./statements/letStatement";
import { TokenTypes } from "../token/token";
import { IdentifierExpression } from "./expressions/identifierExpression";

describe("AST", () => {
  it("should return proper string in string method", () => {
    const program = Program.newProgram();
    const letStatement = LetStatement.newLetStatement({
      type: TokenTypes.LET,
      literal: "let",
    });
    letStatement.setName(
      IdentifierExpression.newIdentifierExpression(
        {
          type: TokenTypes.IDENTIFIER,
          literal: "myVar",
        },
        "myVar",
      ),
    );
    letStatement.setValue(
      IdentifierExpression.newIdentifierExpression(
        {
          type: TokenTypes.IDENTIFIER,
          literal: "anotherVar",
        },
        "anotherVar",
      ),
    );
    program.pushStatement(letStatement);
    expect(program.string()).toEqual("let myVar = anotherVar;");
  });
});
