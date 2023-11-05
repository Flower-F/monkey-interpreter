import { Token } from "../../token/token";
import { Expression, Statement } from "../ast";

export class ExpressionStatement implements Statement {
  private token: Token;
  private expression?: Expression | null;

  private constructor(token: Token) {
    this.token = token;
  }

  public static newExpressionStatement = (token: Token) => {
    return new ExpressionStatement(token);
  };

  public getExpression = () => {
    return this.expression;
  };

  public setExpression = (expression?: Expression | null) => {
    this.expression = expression;
  };

  public statementNode = () => {};

  public tokenLiteral = () => {
    return this.token.literal;
  };

  public toString = () => {
    if (this.expression) {
      return this.expression.toString();
    }
    return "";
  };
}
