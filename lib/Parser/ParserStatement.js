const Tokenizer = require("../Tokenizer/Tokenizer");
const Executable = require("../types/Executable");
const ExecutableTypes = require("../types/ExecutableTypes");
const Expression = require("../types/Expression");
const ParserObjArr = require("./ParserObjArr");
const ParserVariable = require("./ParserVariable");
const Logs = require("../utils/Logs");

module.exports = class ParserStatement extends ParserObjArr {
  
  /**
   * @param {String} line
   * @param {Map<string, Token>} tokens
   */
  parser_if_statement (line, tokens)
  {
    let [one, two, three] = this.#split_if_for(line, tokens);
    const tokenizer = new Tokenizer();
    const result = tokenizer.tokenize_codeblock(three);
    three = result.codeblock_string_v2;
    result.tokens.forEach((v, k) => tokens.set(k, v));
    const executable_codeblock = this.main(three, tokens);
    return new Executable({ type: ExecutableTypes.IF_STATEMENT, ifexpression: this.parse_expression(two, tokens), codeblock: executable_codeblock });
  }

   /**
   * @param {String} line
   * @param {Map<string, Token>} tokens
   */
  parser_for_statement (line, tokens)
  {
    let [one, two, three] = this.#split_if_for(line, tokens);
    const tokenizer = new Tokenizer();
    const result = tokenizer.tokenize_codeblock(three);
    three = result.codeblock_string_v2;
    result.tokens.forEach((v, k) => tokens.set(k, v));
    const executable_codeblock = this.main(three, tokens);
    const [iname, istart, iend, iplus] = two.split(",").map(i => i.trim());
    return new Executable({ type: ExecutableTypes.FOR_STATEMENT, forexpression: [
      iname || "i", 
      isNaN(Number(istart)) ? 0 : Number(istart), 
      isNaN(Number(iend)) ? 100 : (Number(iend) > 10000 ? 10000 : Number(iend)), 
      isNaN(Number(iplus)) ? 1 : Number(iplus)
    ], codeblock: executable_codeblock });
  }


  #split_if_for (i, tokens) {
    const [first, pre_second] = i.split("__PAR__").map(j => j.trim());
    const [second, thrid] = pre_second.split("__CODE__").map(j => j.trim());
    return [first, tokens.get("__PAR__" + second).codeblock, tokens.get("__CODE__" + thrid).codeblock] 
  }

  parse_expression (codeblock_string, tokens)
  {
    let expression_arr = new Array();

    const tokenizer = new Tokenizer();
    const result = tokenizer.tokenize_codeblock(codeblock_string);
    result.tokens.forEach((v, k) => tokens.set(k, v));

    let expression_line = result.codeblock_string_v2.split(/\r?\n/).join("");
    // Logs.logc(31, result.codeblock_string_v2)
    let tmpkeys = new Map();
    Expression.map(exp => { 
      const tokenizer = new Tokenizer();
      const r = tokenizer.tokenize_expressions(expression_line, `${exp}`);
      r.tokens.forEach((v, k) => tmpkeys.set(k, v));
      expression_line = r.codeblock;
    }) 
    //console.log(expression_line)
    tmpkeys.forEach((v, k) => { expression_line = expression_line.replace(k, `${v.codeblock}\n`) });
    // console.log(expression_line, "##########")
    const expression_lines = expression_line.split("\n").map(i => i.trim()).filter(f => f !== "");

    expression_lines.map((eline, eind) => {
      if(eind === expression_lines.length -1 && eline.startsWith("__PAR__")) {
       expression_arr.push({ 
        expression_token: "none", type: "arr", expression_line: eline,
        child: this.parse_expression(tokens.get(eline).codeblock, tokens)
      })
      } else if (eline.startsWith("__PAR__")) {
        const curr = this.#find_expression_line_token(eline, tokens);
        expression_arr.push({
          ...curr, type: "subexpression", 
          child: this.parse_expression(tokens.get(curr.expression_line).codeblock, tokens)
        })
      } else {
        expression_arr.push({...this.#find_expression_line_token(eline, tokens)})
      }
    })
    return expression_arr;

  }

  #find_expression_line_token (expression_line, tokens)
  {
    let local_expression_line = expression_line.trim();
    let current_token = "none";
    let current_expression_line = null;
    Expression.map(i => {
      if(local_expression_line.endsWith(i) && current_expression_line === null) {
        current_token = i;
        current_expression_line = local_expression_line.substring(0, local_expression_line.length - i.length).trim()
      }
    })
    current_expression_line = current_expression_line === null ? local_expression_line : current_expression_line
    // Logs.logc(31, expression_line + "\t\t\t" + current_token)
    // Logs.logc(33, current_expression_line + "\t\t\t" + current_token)
    if(!isNaN(Number(current_expression_line))) {
      return  { 
        expression_token: current_token, type: "number", child: [],
        expression_line: Number(current_expression_line) 
      }
    } else if (current_expression_line === "true") {
      return {
        expression_token: current_token, type: "bool", child: [],
        expression_line: true
      }
    } else if (current_expression_line === "false") {
      return {
        expression_token: current_token, type: "bool", child: [],
        expression_line: false
      }
    } else if (current_expression_line === "null") {
      return {
        expression_token: current_token, type: "null", child: [],
        expression_line: null
      }
    } else if (current_expression_line.startsWith("__STRING__")) {
      return {
        expression_token: current_token, type: "string",  child: [],
        expression_line: tokens.get(current_expression_line).codeblock
      }
    }
    return {
      expression_token: current_token, type: "variable", child: [],
      expression_line: current_expression_line
    }
  }


}