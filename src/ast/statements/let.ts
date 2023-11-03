import { Token } from "../../token/token";
import { Expression, Identifier, Statement } from "../ast";

export class LetStatement implements Statement {
  private token: Token;
  private identifier?: Identifier | undefined;

  private value?: Expression;

  private constructor(token: Token) {
    this.token = token;
  }

  public static createLetStatement(token: Token) {
    return new LetStatement(token);
  }

  public setIdentifier(value?: Identifier) {
    this.identifier = value;
  }

  public getIdentifier() {
    return this.identifier;
  }

  public getValue() {
    return this.value;
  }

  public statementNode() {}

  public tokenLiteral() {
    return this.token.literal;
  }
}
