import readline from "readline";
import { Lexer } from "./lexer/lexer";
import { TokenTypes } from "./token/token";

const cli = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "->",
});

cli.prompt();

cli.on("line", (input) => {
  const lexer = Lexer.createLexer(input);

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const token = lexer.getNextToken();
    console.log(token);

    if (token.type === TokenTypes.EOF) {
      break;
    }
  }
  cli.prompt();
});

cli.on("close", () => {
  console.log("Have a nice day!");
  process.exit(0);
});
