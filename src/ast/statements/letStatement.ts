import { Token } from "../../token/token";
import { Expression, Statement } from "../ast";
import { IdentifierExpression } from "../expressions/identifierExpression";

export class LetStatement implements Statement {
  private token: Token;
  private name?: IdentifierExpression;
  private value?: Expression | null;

  private constructor(token: Token) {
    this.token = token;
  }

  public static newLetStatement = (token: Token) => {
    return new LetStatement(token);
  };

  public setName = (name?: IdentifierExpression) => {
    this.name = name;
  };

  public getName = () => {
    return this.name;
  };

  public getValue = () => {
    return this.value;
  };

  public setValue = (value: Expression) => {
    this.value = value;
  };

  public statementNode = () => {};

  public tokenLiteral = () => {
    return this.token.literal;
  };

  public toString = () => {
    const name = this.name?.toString() || "";
    const value = this.value?.toString() || "";
    const out = this.tokenLiteral() + " " + name + " = " + value + ";";
    return out;
  };
}
