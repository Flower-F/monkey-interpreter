import { Token } from "../../token/token";
import { Expression, Statement } from "../ast";

export class ReturnStatement implements Statement {
  token: Token;
  value?: Expression | null;

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

  public toString = () => {
    const value = this.value?.toString() || "";
    const out = this.tokenLiteral() + " " + value + ";";
    return out;
  };
}
