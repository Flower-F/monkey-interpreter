import { Token, TokenType } from "../token/token";

const ASCII_CODE = {
  a: "a".charCodeAt(0),
  A: "A".charCodeAt(0),
  z: "z".charCodeAt(0),
  Z: "Z".charCodeAt(0),
  _: "_".charCodeAt(0),
  0: "0".charCodeAt(0),
  9: "9".charCodeAt(0),
} as const;

export function newToken(tokenType: TokenType, ch: string): Token {
  return {
    type: tokenType,
    literal: ch,
  };
}

export function isLetter(ch: string) {
  const charCode = ch.charCodeAt(0);
  return (
    (charCode >= ASCII_CODE.a && charCode <= ASCII_CODE.z) ||
    (charCode >= ASCII_CODE.A && charCode <= ASCII_CODE.Z) ||
    charCode === ASCII_CODE._
  );
}

export function isDigit(ch: string) {
  const charCode = ch.charCodeAt(0);
  return charCode >= ASCII_CODE[0] && charCode <= ASCII_CODE[9];
}
