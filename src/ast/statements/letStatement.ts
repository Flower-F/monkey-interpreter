import { Token } from "../../token/token";
import { Expression, Statement } from "../ast";
import { Identifier } from "../identifier";

export class LetStatement implements Statement {
  private token: Token;
  private name?: Identifier;
  private value?: Expression | null;

  private constructor(token: Token) {
    this.token = token;
  }

  public static newLetStatement(token: Token) {
    return new LetStatement(token);
  }

  public setName(name?: Identifier) {
    this.name = name;
  }

  public getName() {
    return this.name;
  }

  public getValue() {
    return this.value;
  }

  public setValue(value: Expression) {
    this.value = value;
  }

  public statementNode() {}

  public tokenLiteral() {
    return this.token.literal;
  }

  public string() {
    let out = "";

    out += this.tokenLiteral() + " ";
    out += this.name?.string();
    out += " = ";

    if (this.value) {
      out += this.value.string();
    }

    out += ";";
    return out;
  }
}
