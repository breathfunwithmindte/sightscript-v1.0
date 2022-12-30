const Tokenizer = require("../Tokenizer/Tokenizer");
const ParserVariable = require("./ParserVariable");

module.exports = class ParserObjArr extends ParserVariable {


  /**
   * @param {String} line
   * @param {Map<string, Token>} tokens
   * @doc tokenize the line --> split the line by , --> pass the parts in the parse_anonymous_variable
   */
  parse_array(line, tokens) 
  {
    const tokenizer = new Tokenizer();
    const result = tokenizer.tokenize_codeblock(line);
    result.tokens.forEach((v, k) => tokens.set(k, v));
    const executables = [];
    result.codeblock_string_v2.split(",").map(i => i.trim()).filter(f => f !== "").map(i => executables.push(this.parse_anonymous_variable(i, tokens)))
    return executables;
  }

  /**
   * @param {String} line
   * @param {Map<string, Token>} tokens
   * @doc tokenize the line --> split the line by , --> pass the parts in the parse_anonymous_variable
   */
  parse_object(line, tokens) 
  {
    try {
    const tokenizer = new Tokenizer();
    const result = tokenizer.tokenize_codeblock(line);
    if(result.codeblock_string_v2 === "") return [];
    result.tokens.forEach((v, k) => tokens.set(k, v));
    const executables = [];
    result.codeblock_string_v2.split(",").map(i => i.trim()).map(i => {
      if(i.startsWith("__COMMENT__")) return;
      executables.push(this.parse_variable(i, tokens, ":"))
    })
    return executables;
    } catch (err) {
    return new Executable({
      name: "variable object", type: ExecutableTypes.ERROR, error: `line ${line}, error_message: ${err.toString()}` 
    })
    }
  } 


  /**
   * @param {String} line
   * @param {Map<string, Token>} tokens
   * @doc tokenize the line --> split the line by , --> pass the parts in the parse_anonymous_variable
   */
  parse_array_element(line, tokens) 
  {
    const [arrvariable, arr_id] = line.split("__ARR__").map(i => i.trim());
    const curr_arr_codeblock = tokens.get(`__ARR__${arr_id}`);
    if(!curr_arr_codeblock) return { arrvariable: arrvariable, element_index: 0 };
    const arr_index = isNaN(Number(curr_arr_codeblock.codeblock)) ? 0 : Number(curr_arr_codeblock.codeblock);
    return { arrvariable: arrvariable, element_index: arr_index };
  }


  parse_callback (line, tokens)
  {
  const [props_part, body_part] = line.split("=>").map(i => i.trim());
  const props_part_code = tokens.get(props_part).codeblock;
  const body_part_code = tokens.get(body_part).codeblock;

  const tokenizer = new Tokenizer();
  const result = tokenizer.tokenize_codeblock(body_part_code);
  result.tokens.forEach((v, k) => tokens.set(k, v));

  const exe_codeblock = this.main(result.codeblock_string_v2, tokens);
  
  return { props: props_part_code.split(",").map(i => i.trim()).filter(f => f !== ""), exe: exe_codeblock }

  }

};
