export interface ASTNode {
  tokenLiteral: () => string;
  toString: () => string;
}

export interface Statement extends ASTNode {
  statementNode: () => void;
}

export interface Expression extends ASTNode {
  expressionNode: () => void;
}
