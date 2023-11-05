import { Token } from "../token/token";
import { Expression } from "./ast";

export class Identifier implements Expression {
  private token: Token;
  private value: string;

  private constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  public static newIdentifier = (token: Token, value: string) => {
    return new Identifier(token, value);
  };

  public getValue = () => {
    return this.value;
  };

  public expressionNode = () => {};

  public tokenLiteral = () => {
    return this.token.literal;
  };

  public string = () => {
    return this.value;
  };
}
