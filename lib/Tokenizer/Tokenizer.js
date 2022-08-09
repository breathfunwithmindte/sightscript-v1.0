const Token = require("../types/Token");
const makeid = require("../utils/makeid");
const Searcher = require("./Searcher");

module.exports = class Tokenizer {
  #tokens = new Map();

  tokenize_codeblock (codeblock_string)
  {
    let local_codeblock = codeblock_string;
    /**
     * @doc search and update strings " | ' | `.
     */
    local_codeblock = this.#singleRegexReplaceWrapper("__STRING__", `"((.|\n|\r)*?)"`, local_codeblock);
    local_codeblock = this.#singleRegexReplaceWrapper("__STRING__", `'((.|\n|\r)*?)'`, local_codeblock);
    local_codeblock = this.#singleRegexReplaceWrapper("__TSTRING__", "`((.|\n|\r)*?)`", local_codeblock);
    
    // ? parse -> () && [] && {}
    local_codeblock = this.#found_code_replace_wrapper("(", ")", local_codeblock, "__PAR__", "parenthesis");
    local_codeblock = this.#found_code_replace_wrapper("[", "]", local_codeblock, "__ARR__", "array");
    local_codeblock = this.#found_code_replace_wrapper("{", "}", local_codeblock, "__CODE__", "codeblock");
    local_codeblock = this.#found_code_replace_wrapper("/**", "*/", local_codeblock, "__COMMENT__", "comment");

    local_codeblock = local_codeblock
      .replaceAll(";", " \n")
      .split(/\r?\n/)
      .filter((f) => f !== "")
      .map((i) => i.trim())
      .join("\n");

      //console.log(local_codeblock)

    return {
      codeblock_string_v2: local_codeblock,
      tokens: this.#tokens,
    };
  }

  #singleRegexReplaceWrapper (id, regex, local_codeblock)
  {
    const result_string_1 = Searcher.simpleRegexReplace(
      local_codeblock,
      regex || `"((.|\n|\r)*?)"`,
      { idName: id || "__STRING__" }
    );
    result_string_1.tokens.forEach((v, k) =>
      this.#tokens.set(k, {
        ...v,
        codeblock: v.codeblock.substring(1, v.codeblock.length - 1),
      })
    );
    return result_string_1.codeblock;
  }

  tokenize_expressions (string_value, symbol)
  {
    let localstring = string_value;
    let index = 0;
    while(localstring.match(`\\${symbol === "||" ? `|\\|` : symbol}`) && index < 1000) {
      let id = `EXP__${makeid(23)}`;
      localstring = localstring.replace(symbol, id);
      this.#tokens.set(id, new Token("expression", symbol));
      index ++;
      if(index > 997) {
        console.log("too may whiles")
        break;
      }
    }
    return { codeblock: localstring, tokens: this.#tokens }
  }

  #found_code_replace_wrapper (start, end, prop_codeblock, id_prop, token_type)
  {
    let local_codeblock = prop_codeblock;
    const found_codes_for_replace = Searcher.startEndMultyCharacters(start,end,local_codeblock);
    for (
      let index = 0; 
      index < found_codes_for_replace.length; 
      index++
      ) {
      const current = found_codes_for_replace[index];
      const id = id_prop + makeid(23);
      local_codeblock = local_codeblock.replace(current, id);
      this.#tokens.set(
        id,
        new Token(
          token_type,
          current.substring(1, current.length - 1).trim()
        )
      );
    }
    return local_codeblock;
  }

}