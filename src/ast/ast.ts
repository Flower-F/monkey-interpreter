import { Token } from "../token/token";

export interface ASTNode {
  tokenLiteral: () => string;
}

export interface Statement extends ASTNode {
  statementNode: () => void;
}

export interface Expression extends ASTNode {
  expressionNode: () => void;
}

export class Program implements ASTNode {
  private statements: Statement[];

  private constructor(statements: Statement[]) {
    this.statements = statements;
  }

  public static createProgram() {
    return new Program([]);
  }

  public setStatements(statements: Statement[]) {
    this.statements = statements;
  }

  public pushStatement(statement: Statement) {
    this.statements.push(statement);
  }

  public getStatements() {
    return this.statements;
  }

  public tokenLiteral() {
    if (this.statements.length > 0) {
      return this.statements[0]?.tokenLiteral() || "";
    }

    return "";
  }
}

export class Identifier implements Expression {
  private token: Token;
  private value: string;

  private constructor(token: Token, value: string) {
    this.token = token;
    this.value = value;
  }

  public static createIdentifier(token: Token, value: string) {
    return new Identifier(token, value);
  }

  public getValue() {
    return this.value;
  }

  public expressionNode() {}

  public tokenLiteral() {
    return this.token.literal;
  }
}
