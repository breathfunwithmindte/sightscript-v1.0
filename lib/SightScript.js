const Compiler = require("./Compiler/Compiler");
const Executor = require("./Executor_v14/Executor");
const FunctionExe = require("./Executor_v14/types/FunctionExe");
const Tokenizer = require("./Tokenizer/Tokenizer");
const Executable = require("./types/Executable");
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
   * @type {String} _codeblock_string_v2
   */
  _codeblock_string_v2;

  /**
   * @type {Map<string, Token>} _tokens
   */
  _tokens = new Map();

  /**
   * @type {Executor} _executor 
   */
  _executor;

  /**
   * @type {String | null} _write_executable 
   */
  _write_executable

  /**
   * @type {String | null} _write_tokenized_string 
   */
  _write_tokenized_string

  /**
   * @type {Executable[]} _executables
   */
  _executables = new Array();

  /**
   * @type {Boolean} _log_state
   */
  _log_state = false;

  constructor(script, write_executable, write_tokenized_string) {
    this._tokenizer = new Tokenizer();
    this._compiler = new Compiler();
    this._executor = new Executor();

    this._write_executable = write_executable || null;
    this._write_tokenized_string = write_tokenized_string || null;

    if(script) {
      this.tokenize_compile(script);
    }

  }

  /**
   * @param  {String} script
   */
  tokenize_compile (script)
  {
    const { codeblock_string_v2, tokens } = this._tokenizer.tokenize_codeblock(script)
    this._codeblock_string_v2 = codeblock_string_v2;
    tokens.forEach((v, k) => this._tokens.set(k, v));

    this._executables = this._compiler.main(this._codeblock_string_v2, this._tokens);
    
    if(this._write_tokenized_string) {
      require("fs").writeFileSync(this._write_tokenized_string, this._codeblock_string_v2);
    }

    if(this._write_executable) {
      require("fs").writeFileSync(this._write_executable, JSON.stringify(this._executables, null, 2));
    }
  }

  use (groupname_or_groups, groupfuncs) {
    if(groupname_or_groups instanceof Array === true) {
      groupname_or_groups.map(i => this.use(i.groupname, i.groupfuncs)); return;
    }
    if(typeof groupname_or_groups !== "string") throw new Error("Group name should be a string with lenth > 1");
    if(groupname_or_groups.length < 2) throw new Error("Group name should be a string with lenth > 1");
    if(groupfuncs instanceof Array === false) throw new Error("Group funcs is not an array type.");
    const newgroup = new Object();
    groupfuncs.map(groupfunc => {
      if(groupfunc instanceof FunctionExe === false) throw new Error("Group func should be a type of FunctionExe");
      newgroup[groupfunc.funcname] = groupfunc;
    })
    this._executor.state[groupname_or_groups] = newgroup;
  }

  async execute ()
  {
    return await this._executor.execute(this._executables, undefined, this._log_state ? "-- GLOBAL --" : null);
  }

};


// const something = 1000;

// sightscript.use([
//   { groupname: "sightapi", groupfuncs: [] },
//   { groupname: "sightbase", groupfuncs: [
//     new FunctionExe("somename", async function (executor, scope_state, current) {
//       const r = await executor.execute([], {})
//       this.funcexe = 10;
//       console.log(this, "@@@@@@@@@@")
//       console.log(r);
//       console.log("hello world", something);
//     })
//   ] }

// ]);