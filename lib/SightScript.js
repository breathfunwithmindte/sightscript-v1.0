const Compiler = require("./Compiler/Compiler");
const Executor = require("./Executor_v14/Executor");
const Parser = require("./Parser/Parser");
const Tokenizer = require("./Tokenizer/Tokenizer");
const Token = require("./types/Token");

module.exports = class SightScript {
  /**
   * @type {Tokenizer} _tokenizer
   */
  _tokenizer;

  /**
   * @type { Compiler } _compiler
   */
  _compiler;

  /**
   * @type {Map<string, Token>} _tokens
   */
  _tokens = new Map();

  /**
   * @type {Executor} _executor 
   */
  _executor;

  constructor(script) {
    this._tokenizer = new Tokenizer();
    this._compiler = new Compiler();
    this._executor = new Executor();

    const { codeblock_string_v2, tokens } = this._tokenizer.tokenize_codeblock(script)

    tokens.forEach((v, k) => this._tokens.set(k, v));

    const executables = this._compiler.main(codeblock_string_v2, this._tokens)

    //console.table(this._compiler.main(codeblock_string_v2, this._tokens).map(i => i.short_log()));
    require("fs").writeFileSync(require("path").resolve() + "/lib/test_logs/exe.json", JSON.stringify( executables, null, 3 ));

    this._executor.execute(executables);
 
    /**
     * @doc
     */
  }
};
