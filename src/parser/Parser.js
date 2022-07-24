const Parsed = require("../types/Parsed");

module.exports = class Parser {
  /**
   * @param {string} script
   * @param {Map<string, string>} tokens
   * @debug log to the console the array of parsed elements;
   */
  static parse(script, tokens, errors) {
    let parsed_lines = [];
    script.split(/\r?\n/).map((i) => {
      // todo find regex split and improve this code here //
      i = i.split("#")[0];
      i = i.split("//")[0];
      if (i === "") return;
      i.trim()
        .split(";")
        .map((j) => {
          if (j.trim() === "") return;
          j = j.trim();
          if(j.startsWith("__COMMENT__")) return;
          if (j.startsWith("__IF__") || j.startsWith("__FOR__")) {
            // parsing if //
            parsed_lines.push(
              this.ParseIfFor(j, tokens) ||
                new Parsed("if-for::ERROR IF_OR_FOR ")
            );
          } else if (j.startsWith("__FUNCTION__")) {
            // function //
            parsed_lines.push(
              this.ParseFunctionDeclaration(j, tokens, errors) ||
                new Parsed("function::hello world error")
            );
          } else if(j.startsWith("return")) {
            parsed_lines.push(new Parsed({
              type: "return",
              name: "return",
              value: j.trim().substring(6, j.length).trim()
            }))
          } else if (j.split("=").length === 1) {
            parsed_lines.push(
              this.ParseFunctionExe(j, tokens, errors) ||
                new Parsed("function-or-method-exe:: Something went wrong")
            );
          } else {
            parsed_lines.push(Parser.parse_variables(j, errors, errors));
          }
        });
    });
    //  console.table(parsed_lines);
    //console.log(parsed_lines.map(i => i.codeblock))
    return parsed_lines;
  }

  static ParseFunctionExe(line, tokens, errors) {
    try {
      const v = tokens.get(`__PAR__${line.split("__PAR__")[1].trim()}`);
      if (!v) return null;
      const name = line.split("__PAR__")[0].trim();
      const type = name.split("::").length > 1 ? "method-exe" : "function-exe";
      return new Parsed({
        status: 0,
        type: type,
        props: v.substring(1, v.length - 1),
        name: name,
      });
    } catch (e) {
      errors.critical.push({ 
        type: "critical", message: e.toString(), description: "Error from parser function exe.", line: line, line_index: 0
      })
      clogs(41, 31, "ERROR", "at parsing line  <<" + line + ">>" + e.toString());
      return null;
      // todo do smth with the error //
    }
  }

  /**
   * @param  {string} code
   */
  static ParseIfFor(line, tokens, errors) {
    try {
      if (!tokens.has(line)) {
        /* todo push error message; <maybe>return null;*/
      }
      const initial_length = line.startsWith("__IF__") ? 2 : 3;
      let code = tokens.get(line);
      code = code.trim();
      const pre_props_token = code.split(":");
      const props_token = pre_props_token[0].substring(
        initial_length,
        pre_props_token[0].length
      );
      let props = tokens.get(props_token.trim());
      props = props.substring(1, props.length - 1);
      const body = pre_props_token[1].substring(
        0,
        pre_props_token[1].length - 3
      );
      // todo [maybe] improve this how to get type (if | for)
      return new Parsed({
        status: 0,
        type: initial_length === 2 ? "ifstatement" : "forloop",
        props: props.trim(),
        codeblock: this.parse(body, tokens, errors),
        name: initial_length === 2 ? "ifstatement" : "forloop",
      });
    } catch (err) {
      // todo [maybe] some errors handle //
      errors.critical.push({ 
        type: "critical", message: e.toString(), description: "Error from parser if/for.", line: line, line_index: 0
      })
      clogs(41, 31, "ERROR", "at parsing if or for looop." + err.toString());
      return null;
    }
  }

  /**
   * @param  {string} code
   * @return  {list} // -1 if error
   * @doc 
   * get the codeblock of function total ==> split the code block to 2 parts (function funct_name __PAR__1234id => __CODE__1234id )
   * name-prop part and codeblock part
   * todo space between make it not required (...) {...}
   */
  static ParseFunctionDeclaration(line, tokens, errors) {
    try {
      if (!tokens.has(line)) {
        /* todo push error message; <maybe>return -1;*/
      }
      const code = tokens.get(line);

      // ? name props part AND code block part;
      const [first_part, second_part] = code.split("=>").map(i => i.trim());

      let codeblock = tokens.get(second_part);
      codeblock = codeblock.substring(1, codeblock.length - 1);
      codeblock = this.parse(codeblock, tokens, errors);

      let func_name = first_part.split("__PAR__")[0];
      func_name = func_name.substring(8, func_name.length);
      func_name = func_name.trim();

      let func_props = first_part.split(func_name)[1];
      func_props = func_props.trim();
      func_props = tokens.get(func_props);
      func_props = func_props.substring(1, func_props.length - 1);

      return new Parsed({
        status: 0, type: "function", props: func_props, name: func_name, codeblock: codeblock,
      })

    } catch (e) {
      // todo [maybe] some errors handle //
      errors.critical.push({ 
        type: "critical", message: e.toString(), description: "Error at parsing function definition." + e.toString(), line: line, line_index: 0
      })
      clogs(41, 31, "ERROR", "at parsing function declaration " + e.toString());
      return null;
    }
  }

  /**
   * @param  {string} line
   * @return
   * typeA = { type: "variable", name: <variable name>, value: <value || null>, ready: boolean, status: <-1:error, 0:ok >  }
   */
  static parse_variables(line, errors) {
    try {
      // ! can be bug here for value if we have expressions like == or !=
      if (!line) throw new Error("hello world no line");
      // console.log(line, "<==============") // use this for debug;
      const variable_name = line.split("=")[0].trim();
      const value = line.split("=").slice(1, line.length).join("=");
      // * register method to struct //
      if (value.split("::").length > 1) {
        return new Parsed({
          type: "variable-method-exe",
          name: variable_name,
          value: value.trim(),
        });
      }
      if (value.trim().startsWith("__CALLBACK__")) {
        return new Parsed({
          type: "variable-callback",
          name: variable_name,
          value: value.trim(),
        });
      }
      // * value is functions with type as variable = <some name>__PAR__<id> //
      if (value.split("__PAR__").length > 1) {
        {
          return new Parsed({
            type: "variable-function-exe",
            name: variable_name,
            value: value.trim(),
          });
        }
      }
      // * value is some kind of value //
      return new Parsed({
        type: "variable",
        name: variable_name,
        value: value.trim(),
        ready: true,
      });
    } catch (e) {
      errors.critical.push({
        type: "critical", message: e.toString(), description: "Error at parsing variables.", line: line, line_index: 0
      })
      clogs(41, 31, "[ERROR]", e.toString() + "Parser - variable error");
      return new Parsed({ type: "fail", name: "asdasd" })
    }
  }
};
