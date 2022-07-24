const Tokenizer = require("../Tokenizer/Tokenizer");
const Executable = require("../types/Executable");
const ExecutableTypes = require("../types/ExecutableTypes");
const ParserStatement = require("./ParserStatement");


module.exports = class ParserFunc extends ParserStatement {
  
  /**
   * @param {String} line
   * @param {Map<string, Token>} tokens
   */
  parse_function (line, tokens)
  {
    let [funcname, funcprops, funcbody] = this.#split_function(line, tokens);
    const tokenizer = new Tokenizer();
    const result = tokenizer.tokenize_codeblock(funcbody);
    funcbody = result.codeblock_string_v2;
    result.tokens.forEach((v, k) => tokens.set(k, v));
    const executable_codeblock = this.main(funcbody, tokens);
    return new Executable({ 
      name: funcname,
      type: ExecutableTypes.FUNCTION_DECLARATION, 
      funcprops: funcprops.split(",").map(i =>i.trim()).filter(f => f !== ""), 
      codeblock: executable_codeblock 
    });
  }

  /**
   * @param {String} line
   * @param {Map<string, Token>} tokens
   * @doc split the __PAR__ and getting (funcname, funcprops) => ...find/replace tokens... => 
   *      => tokenize the funcprops to get codeblock_string_v2 => use compile_props method of parser => 
   *      => return exe;
   */
  parse_function_exe (line, tokens)
  {
    let [funcname, funcprops] = line.split("__PAR__").map(j => j.trim());
    try {
      funcprops = tokens.get(`__PAR__${funcprops}`).codeblock;
      const tokenizer = new Tokenizer();
      const result = tokenizer.tokenize_codeblock(funcprops);
      funcprops = result.codeblock_string_v2;
      result.tokens.forEach((v, k) => tokens.set(k, v));
      const props = this.compile_props(result.codeblock_string_v2, tokens);
      return new Executable({
        name: funcname, type: ExecutableTypes.FUNCTION_EXE, props: props
      })
    } catch (err) {
      return new Executable({
        name: funcname, type: ExecutableTypes.ERROR, 
        error: `line ${line}, funcname ${funcname}, funcprops ${funcprops}, error_message: ${err.toString()}` 
      })
    }
  }

  #split_function (i, tokens) {
    const [prefuncname, pre_second] = i.split("__PAR__").map(j => j.trim());
    const [funcinitial, funcname] = prefuncname.split(" ").map(j=>j.trim());
    const [second, thrid] = pre_second.split("__CODE__").map(j => j.trim());
    return [funcname, tokens.get("__PAR__" + second).codeblock, tokens.get("__CODE__" + thrid).codeblock] 
  }




}