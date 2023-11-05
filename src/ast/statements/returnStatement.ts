import { Token } from "../../token/token";
import { Expression, Statement } from "../ast";

export class ReturnStatement implements Statement {
  token: Token;
  returnValue?: Expression | null;

  private constructor(token: Token) {
    this.token = token;
  }

  public static newReturnStatement = (token: Token) => {
    return new ReturnStatement(token);
  };

  public statementNode = () => {};

  public tokenLiteral = () => {
    return this.token.literal;
  };

  public string = () => {
    const out = this.tokenLiteral() + " " + (this.returnValue?.string() || "") + ";";
    return out;
  };
}
