import { Token } from "../../token/token";
import { Expression } from "../ast";

export class IdentifierExpression implements Expression {
  private token: Token;
  private value: string;

  private constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  public static newIdentifierExpression = (token: Token, value: string) => {
    return new IdentifierExpression(token, value);
  };

  public getValue = () => {
    return this.value;
  };

  public expressionNode = () => {};

  public tokenLiteral = () => {
    return this.token.literal;
  };

  public toString = () => {
    return this.value;
  };
}
