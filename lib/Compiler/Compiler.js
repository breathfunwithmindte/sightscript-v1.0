const Parser = require("../Parser/Parser");

module.exports = class Compiler extends Parser {

  main (codeblock_string_v2, tokens)
  {
    const executables = new Array();

    let ll = [];
    tokens.forEach(v => ll.push(v))
    //console.log(ll.length)
    codeblock_string_v2.split("\n").map(i => i.trim()).map(i => {
      if (i.startsWith("__COMMENT__")) {
        return console.log("comment", i);
      } else if(i.split("=").length > 1) {
        /** variable */
        const executable = this.parse_variable(i, tokens);
        executables.push(executable)
        //console.log(JSON.stringify(executable.short_log_str()))

      } else if (i.split("__CODE__").length > 1 && i.split("__PAR__").length > 1 && i.startsWith("if")) {
        const executable = this.parser_if_statement(i, tokens);
        executables.push(executable)

      } else if (i.startsWith("return")) {
        /** variable */
        const executable = this.parse_return_variable(i, tokens);
        executables.push(executable)
        //console.log(JSON.stringify(executable.short_log_str()))
      } else if (i.split("__CODE__").length > 1 && i.split("__PAR__").length > 1 && i.startsWith("for")) {
        const executable = this.parser_for_statement(i, tokens);
        executables.push(executable)
        
      } else if (i.split("__CODE__").length > 1 && i.split("__PAR__").length > 1 && i.startsWith("function")) {
        /** function declaration */
        const executable = this.parse_function(i, tokens);
        executables.push(executable);

      } else if (i.split("__CODE__").length == 1 && i.split("__PAR__").length == 2 ) {
        /** function exe */
        const executable = this.parse_function_exe(i, tokens);
        executables.push(executable);
      } else {
        console.log(`FOUND UNKNOW LINE ${i}`)
      }

    })

    let ll1 = [];
    tokens.forEach(v => ll1.push(v))
    //console.log(ll1.length)

    return executables;

  }

  compile_props (codeblock_string_v2, tokens)
  {
    const executables = [];
    codeblock_string_v2.split(",").map(i => {
      const executable = this.parse_anonymous_variable(i, tokens);
        executables.push(executable)
    })
    return executables;
  }

}