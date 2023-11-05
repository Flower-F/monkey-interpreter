import { Token } from "../../token/token";
import { Expression } from "../ast";

export class PrefixExpression implements Expression {
  private token: Token;
  private operator: string;
  private value?: Expression | null;

  private constructor(token: Token, operator: string) {
    this.token = token;
    this.operator = operator;
  }

  public static newPrefixExpression = (token: Token, operator: string) => {
    return new PrefixExpression(token, operator);
  };

  public getValue = () => {
    return this.value;
  };

  public setValue = (value: Expression | null) => {
    this.value = value;
  };

  public getOperator = () => {
    return this.operator;
  };

  public expressionNode = () => {};

  public tokenLiteral = () => {
    return this.token.literal;
  };

  public string = () => {
    const out = "(" + this.operator + (this.value?.string() || "") + ")";
    return out;
  };
}
