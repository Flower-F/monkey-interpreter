import { ASTNode, Statement } from "./ast";

export class Program implements ASTNode {
  private statements: Statement[];

  private constructor(statements: Statement[]) {
    this.statements = statements;
  }

  public static newProgram = () => {
    return new Program([]);
  };

  public setStatements = (statements: Statement[]) => {
    this.statements = statements;
  };

  public pushStatement = (statement: Statement) => {
    this.statements.push(statement);
  };

  public getStatements = () => {
    return this.statements;
  };

  public tokenLiteral = () => {
    if (this.statements.length > 0) {
      return this.statements[0]?.tokenLiteral() || "";
    }

    return "";
  };

  public toString = () => {
    let out = "";

    this.statements.forEach((statement) => {
      out = statement.toString();
    });

    return out;
  };
}
