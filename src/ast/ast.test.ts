import { describe, it, expect } from "vitest";
import { Program } from "./program";
import { LetStatement } from "./statements/letStatement";
import { TokenTypes } from "../token/token";
import { Identifier } from "./identifier";

describe("AST", () => {
  it("should return proper string in string method", () => {
    const program = Program.newProgram();
    const letStatement = LetStatement.newLetStatement({
      type: TokenTypes.LET,
      literal: "let",
    });
    letStatement.setName(
      Identifier.newIdentifier(
        {
          type: TokenTypes.IDENTIFIER,
          literal: "myVar",
        },
        "myVar",
      ),
    );
    letStatement.setValue(
      Identifier.newIdentifier(
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
