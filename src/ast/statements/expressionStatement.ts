import { Token } from "../../token/token";
import { Expression, Statement } from "../ast";

export class ExpressionStatement implements Statement {
  private token: Token;
  private expression: Expression;

  private constructor(token: Token, expression: Expression) {
    this.token = token;
    this.expression = expression;
  }

  public statementNode() {}

  public tokenLiteral() {
    return this.token.literal;
  }

  public string() {
    if (this.expression) {
      return this.expression.string();
    }
    return "";
  }
}
