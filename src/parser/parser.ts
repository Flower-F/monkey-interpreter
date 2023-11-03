import { Identifier, Program } from "../ast/ast";
import { LetStatement } from "../ast/statements/let";
import { Lexer } from "../lexer/lexer";
import { Token, TokenType, TokenTypes } from "../token/token";

export class Parser {
  private lexer: Lexer;
  private curToken?: Token;
  private nextToken?: Token;
  private errors: string[];

  private constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.errors = [];
  }

  public static createParser(lexer: Lexer): Parser {
    const parser = new Parser(lexer);

    parser.moveToNextToken();

    return parser;
  }

  public getErrors() {
    return this.errors;
  }

  private moveToNextToken() {
    this.curToken = this.nextToken;
    this.nextToken = this.lexer.getNextToken();
  }

  public parseProgram(): Program {
    const program = Program.createProgram();

    while (!this.expectCurrentToken(TokenTypes.EOF)) {
      const statement = this.parseStatement();
      if (statement) {
        program.pushStatement(statement);
      }
      this.moveToNextToken();
    }

    return program;
  }

  private parseStatement() {
    const tokenType = this.curToken?.type;
    switch (tokenType) {
      case TokenTypes.LET: {
        return this.parseLetStatement();
      }
      default: {
        return null;
      }
    }
  }

  private parseLetStatement() {
    if (!this.curToken) {
      return null;
    }
    const letStatement = LetStatement.createLetStatement(this.curToken);

    if (!this.expectNextToken(TokenTypes.IDENTIFIER)) {
      this.pushError(TokenTypes.IDENTIFIER);
      return null;
    }
    this.moveToNextToken();

    const identifier = Identifier.createIdentifier(this.curToken, this.curToken.literal);
    letStatement.setIdentifier(identifier);

    if (!this.expectNextToken(TokenTypes.ASSIGN)) {
      this.pushError(TokenTypes.ASSIGN);
      return null;
    }
    this.moveToNextToken();

    while (!this.expectCurrentToken(TokenTypes.SEMICOLON)) {
      this.moveToNextToken();
    }

    return letStatement;
  }

  private expectCurrentToken(tokenType: TokenType) {
    return this.curToken?.type === tokenType;
  }

  private expectNextToken(tokenType: TokenType) {
    return this.nextToken?.type === tokenType;
  }

  private pushError(tokenType: TokenType) {
    const message = `expected next token to be ${tokenType}, got ${this.nextToken} instead`;
    this.errors.push(message);
  }
}
