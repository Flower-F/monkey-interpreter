// Symbol Token
export const SymbolTokenTypes = {
  ASSIGN: "=",
  PLUS: "+",
  MINUS: "-",
  DIVISION: "/",
  MULTIPLE: "*",

  GREATER_THAN: ">",
  LESS_THAN: "<",
  EQUAL: "==",
  NOT_EQUAL: "!=",

  COMMA: ",",
  SEMICOLON: ";",
  BANG: "!",

  LEFT_PAREN: "(",
  RIGHT_PAREN: ")",
  LEFT_BRACE: "{",
  RIGHT_BRACE: "}",
} as const;

// Keyword Token
export const KeywordTokenTypes = {
  FUNCTION: "fn",
  LET: "let",
  TRUE: "true",
  FALSE: "false",
  IF: "if",
  ELSE: "else",
  RETURN: "return",
} as const;

// Custom Token
export const CustomTokenTypes = {
  IDENTIFIER: "IDENTIFIER",
  INT: "INT",
};

export const TokenTypes = {
  ...SymbolTokenTypes,
  ...KeywordTokenTypes,
  ...CustomTokenTypes,
  ILLEGAL: "ILLEGAL",
  EOF: "EOF",
} as const;

export type TokenType = (typeof TokenTypes)[keyof typeof TokenTypes];

export type Token = {
  type: TokenType;
  literal: string;
};

export function getIdentifierType(identifier: string): TokenType {
  for (const value of Object.values(KeywordTokenTypes)) {
    if (value && identifier === value) {
      return value;
    }
  }

  return TokenTypes.IDENTIFIER;
}
