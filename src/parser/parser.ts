import { Expression } from "../ast/ast";
import { Identifier } from "../ast/identifier";
import { Program } from "../ast/program";
import { ExpressionStatement } from "../ast/statements/expressionStatement";
import { LetStatement } from "../ast/statements/letStatement";
import { ReturnStatement } from "../ast/statements/returnStatement";
import { Lexer } from "../lexer/lexer";
import { Token, TokenType, TokenTypes } from "../token/token";

type PrefixParseFunction = () => Expression | null;
type InfixParseFunction = (expression: Expression) => Expression | null;

enum PrecedenceTable {
  LOWEST = 1,
  EQUALS,
  LESS_GREATER,
  SUM,
  PRODUCT,
  PREFIX,
  CALL,
}

export class Parser {
  private lexer: Lexer;
  private curToken?: Token;
  private nextToken?: Token;
  private errors: string[];
  private prefixParseFunctionMap = new Map<TokenType, PrefixParseFunction>();
  private infixParseFunctionMap = new Map<TokenType, InfixParseFunction>();

  private constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.errors = [];
  }

  public static newParser = (lexer: Lexer): Parser => {
    const parser = new Parser(lexer);
    parser.moveToNextToken();
    parser.moveToNextToken();

    parser.registerPrefix(TokenTypes.IDENTIFIER, parser.parseIdentifier);

    return parser;
  };

  public getErrors = () => {
    return this.errors;
  };

  private moveToNextToken = () => {
    this.curToken = this.nextToken;
    this.nextToken = this.lexer.getNextToken();
  };

  public parseProgram = () => {
    const program = Program.newProgram();

    while (!this.expectCurrentTokenIs(TokenTypes.EOF)) {
      const statement = this.parseStatement();
      if (statement) {
        program.pushStatement(statement);
      }
      this.moveToNextToken();
    }

    return program;
  };

  private parseStatement = () => {
    const tokenType = this.curToken?.type;
    switch (tokenType) {
      case TokenTypes.LET: {
        return this.parseLetStatement();
      }
      case TokenTypes.RETURN: {
        return this.parseReturnStatement();
      }
      default: {
        return this.parseExpressionStatement();
      }
    }
  };

  private parseLetStatement = (): LetStatement | null => {
    if (!this.curToken) {
      return null;
    }
    const letStatement = LetStatement.newLetStatement(this.curToken);

    if (!this.expectNextTokenIs(TokenTypes.IDENTIFIER)) {
      this.pushError(TokenTypes.IDENTIFIER);
      return null;
    }
    this.moveToNextToken();

    const identifier = Identifier.newIdentifier(this.curToken, this.curToken.literal);
    letStatement.setName(identifier);

    if (!this.expectNextTokenIs(TokenTypes.ASSIGN)) {
      this.pushError(TokenTypes.ASSIGN);
      return null;
    }
    this.moveToNextToken();

    while (!this.expectCurrentTokenIs(TokenTypes.SEMICOLON)) {
      this.moveToNextToken();
    }

    return letStatement;
  };

  private parseReturnStatement = (): ReturnStatement | null => {
    if (!this.curToken) {
      return null;
    }

    const statement = ReturnStatement.newReturnStatement(this.curToken);
    this.moveToNextToken();

    while (!this.expectCurrentTokenIs(TokenTypes.SEMICOLON)) {
      this.moveToNextToken();
    }

    return statement;
  };

  private parseExpressionStatement = (): ExpressionStatement | null => {
    if (!this.curToken) {
      return null;
    }

    const statement = ExpressionStatement.newExpressionStatement(this.curToken);
    statement.setExpression(this.parseExpression(PrecedenceTable.LOWEST));

    if (this.expectNextTokenIs(TokenTypes.SEMICOLON)) {
      this.moveToNextToken();
    }

    return statement;
  };

  private parseExpression = (precedence: number): Expression | null => {
    if (!this.curToken) {
      return null;
    }

    const prefix = this.prefixParseFunctionMap.get(this.curToken.type);
    if (!prefix) {
      return null;
    }

    const leftExpression = prefix();
    return leftExpression;
  };

  private parseIdentifier = (): Identifier | null => {
    if (!this.curToken) {
      return null;
    }

    return Identifier.newIdentifier(this.curToken, this.curToken.literal);
  };

  private expectCurrentTokenIs = (tokenType: TokenType) => {
    return this.curToken?.type === tokenType;
  };

  private expectNextTokenIs = (tokenType: TokenType) => {
    return this.nextToken?.type === tokenType;
  };

  private pushError = (tokenType: TokenType) => {
    const message = `expected next token type to be ${tokenType}, got ${this.nextToken?.type} instead`;
    this.errors.push(message);
  };

  private registerPrefix = (tokenType: TokenType, prefixParseFn: PrefixParseFunction) => {
    this.prefixParseFunctionMap.set(tokenType, prefixParseFn);
  };

  private registerInfix = (tokenType: TokenType, infixParseFn: InfixParseFunction) => {
    this.infixParseFunctionMap.set(tokenType, infixParseFn);
  };
}
