import { Expression } from "../ast/ast";
import { IdentifierExpression } from "../ast/expressions/identifierExpression";
import { IntegerExpression } from "../ast/expressions/integerExpression";
import { PrefixExpression } from "../ast/expressions/prefixExpression";
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

  public static newParser = (lexer: Lexer) => {
    const parser = new Parser(lexer);
    parser.moveToNextToken();
    parser.moveToNextToken();

    parser.registerPrefix(TokenTypes.IDENTIFIER, parser.parseIdentifier);
    parser.registerPrefix(TokenTypes.INTEGER, parser.parseInteger);
    parser.registerPrefix(TokenTypes.NOT, parser.parsePrefixExpression);
    parser.registerPrefix(TokenTypes.MINUS, parser.parsePrefixExpression);

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

  private parseLetStatement = () => {
    if (!this.curToken) {
      return null;
    }
    const letStatement = LetStatement.newLetStatement(this.curToken);

    if (!this.expectNextTokenIs(TokenTypes.IDENTIFIER)) {
      this.pushNextTokenParseError(TokenTypes.IDENTIFIER);
      return null;
    }
    this.moveToNextToken();

    const identifier = IdentifierExpression.newIdentifierExpression(this.curToken, this.curToken.literal);
    letStatement.setName(identifier);

    if (!this.expectNextTokenIs(TokenTypes.ASSIGN)) {
      this.pushNextTokenParseError(TokenTypes.ASSIGN);
      return null;
    }
    this.moveToNextToken();

    while (!this.expectCurrentTokenIs(TokenTypes.SEMICOLON)) {
      this.moveToNextToken();
    }

    return letStatement;
  };

  private parseReturnStatement = () => {
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

  private parseExpressionStatement = () => {
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

  private parseExpression = (precedence: number) => {
    if (!this.curToken) {
      return null;
    }

    const prefix = this.prefixParseFunctionMap.get(this.curToken.type);
    if (!prefix) {
      this.pushNoPrefixParseFnError(this.curToken.type);
      return null;
    }

    const leftExpression = prefix();
    return leftExpression;
  };

  private parseIdentifier = () => {
    if (!this.curToken) {
      return null;
    }

    return IdentifierExpression.newIdentifierExpression(this.curToken, this.curToken.literal);
  };

  private parseInteger = () => {
    if (!this.curToken) {
      return null;
    }

    const value = parseInt(this.curToken.literal);
    if (Number.isNaN(value)) {
      const message = `could not parse ${this.curToken.literal} as an integer`;
      this.errors.push(message);
    }

    return IntegerExpression.newIntegerExpression(this.curToken, Number(this.curToken.literal));
  };

  private parsePrefixExpression = () => {
    if (!this.curToken) {
      return null;
    }

    const expression = PrefixExpression.newPrefixExpression(this.curToken, this.curToken.literal);
    this.moveToNextToken();
    expression.setValue(this.parseExpression(PrecedenceTable.PREFIX));

    return expression;
  };

  private expectCurrentTokenIs = (tokenType: TokenType) => {
    return this.curToken?.type === tokenType;
  };

  private expectNextTokenIs = (tokenType: TokenType) => {
    return this.nextToken?.type === tokenType;
  };

  private pushNextTokenParseError = (tokenType: TokenType) => {
    const message = `expected next token type to be ${tokenType}, got ${this.nextToken?.type} instead`;
    this.errors.push(message);
  };

  private pushNoPrefixParseFnError(tokenType: TokenType) {
    const msg = `no prefix parse function for ${tokenType} found`;
    this.errors.push(msg);
  }

  private registerPrefix = (tokenType: TokenType, prefixParseFn: PrefixParseFunction) => {
    this.prefixParseFunctionMap.set(tokenType, prefixParseFn);
  };

  private registerInfix = (tokenType: TokenType, infixParseFn: InfixParseFunction) => {
    this.infixParseFunctionMap.set(tokenType, infixParseFn);
  };
}
