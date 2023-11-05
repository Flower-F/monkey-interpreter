import { Token } from "../token/token";
import { Expression } from "./ast";

export class Integer implements Expression {
  private token: Token;
  private value: number;

  private constructor(token: Token, value: number) {
    this.token = token;
    this.value = value;
  }

  public static newInteger = (token: Token, value: number) => {
    return new Integer(token, value);
  };

  public getValue = () => {
    return this.value;
  };

  public expressionNode = () => {};

  public tokenLiteral = () => {
    return this.token.literal;
  };

  public string = () => {
    return this.value.toString();
  };
}
