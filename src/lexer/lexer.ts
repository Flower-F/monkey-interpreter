import { SymbolTokenTypes, Token, TokenTypes, getIdentifierType } from "../token/token";
import { isDigit, isLetter } from "../common/utils";

export class Lexer {
  private input: string;
  private position: number;
  private readPosition: number;
  private ch: string;

  private constructor(input: string) {
    this.input = input;
    this.position = 0;
    this.readPosition = 0;
    this.ch = "";
  }

  public static newLexer(input: string): Lexer {
    const lexer = new Lexer(input);
    lexer.readChar();
    return lexer;
  }

  public getNextToken(): Token {
    this.skipWhiteSpace();

    let token: Token = {
      type: TokenTypes.EOF,
      literal: "",
    };

    if (this.ch === "") {
      return token;
    }
    if (this.ch === "=" && this.getNextChar() === "=") {
      const ch = this.ch;
      this.readChar();
      token = Token.newToken(SymbolTokenTypes.EQUAL, ch + this.ch);
      this.readChar(); // do it again to skip the second =
      return token;
    }
    if (this.ch === "!" && this.getNextChar() === "=") {
      const ch = this.ch;
      this.readChar();
      token = Token.newToken(SymbolTokenTypes.NOT_EQUAL, ch + this.ch);
      this.readChar(); // do it again to skip the second =
      return token;
    }

    for (const value of Object.values(SymbolTokenTypes)) {
      if (value && this.ch === value) {
        token = Token.newToken(value, this.ch);
        this.readChar();
        return token;
      }
    }

    if (isLetter(this.ch)) {
      token.literal = this.readIdentifier();
      token.type = getIdentifierType(token.literal);
      return token;
    }
    if (isDigit(this.ch)) {
      token.literal = this.readNumber();
      token.type = TokenTypes.INTEGER;
      return token;
    }

    token = Token.newToken(TokenTypes.ILLEGAL, this.ch);
    this.readChar();
    return token;
  }

  private readChar() {
    this.ch = this.input[this.readPosition] || "";
    this.position = this.readPosition;
    this.readPosition++;
  }

  private readIdentifier() {
    const position = this.position;
    while (isLetter(this.ch)) {
      this.readChar();
    }

    return this.input.slice(position, this.position);
  }

  private readNumber() {
    const position = this.position;
    while (isDigit(this.ch)) {
      this.readChar();
    }

    return this.input.slice(position, this.position);
  }

  private skipWhiteSpace() {
    while (this.ch === " " || this.ch === "\t" || this.ch === "\n" || this.ch === "\r") {
      this.readChar();
    }
  }

  private getNextChar() {
    return this.input[this.readPosition] || "";
  }
}
