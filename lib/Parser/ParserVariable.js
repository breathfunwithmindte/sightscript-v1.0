const ExecutableTypes = require("../types/ExecutableTypes");
const Executable = require("../types/Executable");
const Token = require("../types/Token");
const expression_check = require("../utils/expression_check");

module.exports = class ParserVariable {
  /**
   * @param {String} line
   * @param {Map<string, Token>} tokens
   */
  parse_variable(line, tokens, split_with) {
    const [variablename, initialvalue] = line.split(split_with || "=").map((i) => i.trim());
    console.log("!!!!!!!!!!!!", variablename, initialvalue)
    let type;
    let value;
    try {
      const r = this.parse_variable_value(initialvalue, tokens);
      type  = r.type;
      value = r.value;
    } catch (err) {
      console.log(err);
      return new Executable({ type: ExecutableTypes.ERROR, error: err.toString(), name: variablename })
    }
    
    switch (type) {
      case ExecutableTypes.VARIABLE_VALUE:
        return new Executable({ type: type, name: variablename, value: value });
      case ExecutableTypes.VARIABLE_VARIABLE:
        return new Executable({ type: type, name: variablename, value: value });
      case ExecutableTypes.VARIABLE_EXPRESSION:
        return new Executable({ type: type, name: variablename, value: value, expressions: this.parse_expression(value, tokens) });
      case ExecutableTypes.VARIABLE_FUNCTION_EXE:
        return new Executable({ type: type, name: variablename, value: value, variable_func_exe: this.parse_function_exe(value, tokens) });
      case ExecutableTypes.VARIABLE_VARIABLE_ARRAY_ELEMENT:
        const arr_info = this.parse_array_element(value, tokens);
        return new Executable({ type: type, name: variablename, value: arr_info.arrvariable, element_index: arr_info.element_index });
      case ExecutableTypes.VARIABLE_ARRAY:
        return new Executable({ type: type, name: variablename, value: value, arr_value: this.parse_array(value, tokens) });
      case ExecutableTypes.VARIABLE_OBJECT:
        return new Executable({ type: type, name: variablename, value: value, obj_value: this.parse_object(value, tokens) });
      default:
        return new Executable({ type: type });
        break;
    }
  }

  /**
   * @param {String} line
   * @param {Map<string, Token>} tokens
   */
   parse_anonymous_variable(line, tokens) {
     
    let type;
    let value;
    try {
      const r = this.parse_variable_value_anonymous(line.trim(), tokens);
      type  = r.type;
      value = r.value;
    } catch (err) {
      console.log(err);
      return new Executable({ type: ExecutableTypes.ERROR, error: err.toString(), name: line })
    }

    switch (type) {
      case ExecutableTypes.ANONYMOUS_VALUE:
        return new Executable({ type: type, name: ".", value: value });
      case ExecutableTypes.ANONYMOUS_VARIABLE:
        return new Executable({ type: type, name: ".", value: value });
      case ExecutableTypes.ANONYMOUS_EXPRESSION:
        return new Executable({ type: type, name: ".", value: value, expressions: this.parse_expression(value, tokens)  });
      case ExecutableTypes.ANONYMOUS_FUNCTION_EXE:
        return new Executable({ type: type, name: ".", value: value, variable_func_exe: this.parse_function_exe(value, tokens) });
      case ExecutableTypes.ANONYMOUS_VARIABLE_ARRAY_ELEMENT:
        const arr_info = this.parse_array_element(value, tokens);
        return new Executable({ type: type, name: ".",  value: arr_info.arrvariable, element_index: arr_info.element_index  });
      case ExecutableTypes.ANONYMOUS_ARRAY:
        return new Executable({ type: type, name: '.', value: value, arr_value: this.parse_array(value, tokens) });
      case ExecutableTypes.ANONYMOUS_OBJECT:
        return new Executable({ type: type, name: '.', value: value, arr_value: this.parse_object(value, tokens) });
      case ExecutableTypes.ANONYMOUS_CALLBACK:
        const { props, exe } = this.parse_callback(value, tokens);
        return new Executable({ type: type, name: '.', value: value, funcprops: props, codeblock: exe });
      default:
        return new Executable({ type: type });
        break;
    }
  }

  /**
   * @param {String} line
   * @param {Map<string, Token>} tokens
   */
  parse_return_variable (line, tokens) {
    const [prefix, initial_value] = line.split(" ").map(i => i.trim());
    let type;
    let value;
    try {
      const r = this.parse_variable_value_return(initial_value, tokens);
      type  = r.type;
      value = r.value;
    } catch (err) {
      console.log(err);
      return new Executable({ type: ExecutableTypes.ERROR, error: err.toString(), name: line })
    }

    switch (type) {
      case ExecutableTypes.RETURN_VALUE:
        return new Executable({ type: type, name: "return", value: value });
      case ExecutableTypes.RETURN_VARIABLE:
        return new Executable({ type: type, name: "return", value: value });
      case ExecutableTypes.RETURN_FUNCTIONEXE:
        return new Executable({ type: type, name: "return", value: value, variable_func_exe: this.parse_function_exe(value, tokens) });
      case ExecutableTypes.RETURN_ARRAY_ELEMENT:
        const arr_info = this.parse_array_element(value, tokens);
        return new Executable({ type: type, name: "return", value: arr_info.arrvariable, element_index: arr_info.element_index  });
      case ExecutableTypes.RETURN_ARRAY:
        return new Executable({ type: type, name: "return", value: value, arr_value: this.parse_array(value, tokens) });
      case ExecutableTypes.RETURN_OBJECT:
        return new Executable({ type: type, name: "return", value: value, arr_value: this.parse_object(value, tokens) });
      default:
        return new Executable({ type: type });
        break;
    }
  }

  /**
   * @param {String} value
   * @param {Map<string, Token>} tokens
   */
  parse_variable_value(value, tokens) {
    if (expression_check(value)) {
      return {
        type: ExecutableTypes.VARIABLE_EXPRESSION,
        value: value,
      };
    } else if (value.startsWith("__STRING__")) {
      const currtoken = tokens.get(value);
      return {
        type: ExecutableTypes.VARIABLE_VALUE,
        value: currtoken.codeblock,
      };
    } else if (!isNaN(Number(value))) {
      return { type: ExecutableTypes.VARIABLE_VALUE, value: Number(value) };
    } else if (value === "true") {
      return { type: ExecutableTypes.VARIABLE_VALUE, value: true };
    } else if (value === "false") {
      return { type: ExecutableTypes.VARIABLE_VALUE, value: false };
    } else if (value === "null") {
      return { type: ExecutableTypes.VARIABLE_VALUE, value: null };
    } else if (value === " ") {
      return { type: ExecutableTypes.VARIABLE_VALUE, value: undefined };
    } else if (value.startsWith("__STRING__")) {
      const currtoken = tokens.get(value);
      return {
        type: ExecutableTypes.VARIABLE_VALUE,
        value: currtoken.codeblock,
      };
    } else if (value.startsWith("__CODE__") && value.split(" ").length === 1) {
      const currtoken = tokens.get(value);
      return {
        type: ExecutableTypes.VARIABLE_OBJECT,
        value: currtoken.codeblock,
      };
    } else if (value.startsWith("__ARR__") && value.split(" ").length === 1) {
      const currtoken = tokens.get(value);
      return {
        type: ExecutableTypes.VARIABLE_ARRAY,
        value: currtoken.codeblock,
      };
    } else if (value.split("__PAR__").length > 1) {
      return {
        type: ExecutableTypes.VARIABLE_FUNCTION_EXE, value: value,
      };
    } else if (value.split("__ARR__").length > 1) {
      return {
        type: ExecutableTypes.VARIABLE_VARIABLE_ARRAY_ELEMENT, value: value,
      };
    } else {
      return { type: ExecutableTypes.VARIABLE_VARIABLE, value: value };
    }
  }


  /**
   * @param {String} value
   * @param {Map<string, Token>} tokens
   */
   parse_variable_value_anonymous(value, tokens) {
    if (expression_check(value)) {
      return {
        type: ExecutableTypes.ANONYMOUS_EXPRESSION,
        value: value,
      };
    } else if (value.startsWith("__STRING__")) {
      const currtoken = tokens.get(value);
      return {
        type: ExecutableTypes.ANONYMOUS_VALUE,
        value: currtoken.codeblock,
      };
    } else if (!isNaN(Number(value))) {
      return { type: ExecutableTypes.ANONYMOUS_VALUE, value: Number(value) };
    } else if (value === "true") {
      return { type: ExecutableTypes.ANONYMOUS_VALUE, value: true };
    } else if (value === "false") {
      return { type: ExecutableTypes.ANONYMOUS_VALUE, value: false };
    } else if (value === "null") {
      return { type: ExecutableTypes.ANONYMOUS_VALUE, value: null };
    } else if (value === " ") {
      return { type: ExecutableTypes.ANONYMOUS_VALUE, value: undefined };
    } else if (value.startsWith("__STRING__")) {
      const currtoken = tokens.get(value);
      return {
        type: ExecutableTypes.ANONYMOUS_VALUE,
        value: currtoken.codeblock,
      };
    } else if (value.split("=>").length > 1) {
      return {
        type: ExecutableTypes.ANONYMOUS_CALLBACK,
        value: value,
      };
    } else if (value.startsWith("__CODE__") && value.split(" ").length === 1) {
      const currtoken = tokens.get(value);
      return {
        type: ExecutableTypes.ANONYMOUS_OBJECT,
        value: currtoken.codeblock,
      };
    } else if (value.startsWith("__ARR__") && value.split(" ").length === 1) {
      const currtoken = tokens.get(value);
      return {
        type: ExecutableTypes.ANONYMOUS_ARRAY,
        value: currtoken.codeblock,
      };
    } else if (value.split("__PAR__").length > 1) {
      return {
        type: ExecutableTypes.ANONYMOUS_FUNCTION_EXE, value: value,
      };
    } else if (value.split("__ARR__").length > 1) {
      return {
        type: ExecutableTypes.ANONYMOUS_VARIABLE_ARRAY_ELEMENT, value: value,
      };
    } else {
      return { type: ExecutableTypes.ANONYMOUS_VARIABLE, value: value };
    }
  }

  /**
   * @param {String} value
   * @param {Map<string, Token>} tokens
   */
   parse_variable_value_return(value, tokens) {
    if (value.startsWith("__STRING__")) {
      const currtoken = tokens.get(value);
      return {
        type: ExecutableTypes.RETURN_VALUE,
        value: currtoken.codeblock,
      };
    } else if (!isNaN(Number(value))) {
      return { type: ExecutableTypes.RETURN_VALUE, value: Number(value) };
    } else if (value === "true") {
      return { type: ExecutableTypes.RETURN_VALUE, value: true };
    } else if (value === "false") {
      return { type: ExecutableTypes.RETURN_VALUE, value: false };
    } else if (value === "null") {
      return { type: ExecutableTypes.RETURN_VALUE, value: null };
    } else if (value === " ") {
      return { type: ExecutableTypes.RETURN_VALUE, value: undefined };
    } else if (value.startsWith("__STRING__")) {
      const currtoken = tokens.get(value);
      return {
        type: ExecutableTypes.RETURN_VALUE,
        value: currtoken.codeblock,
      };
    } else if (value.startsWith("__CODE__") && value.split(" ").length === 1) {
      const currtoken = tokens.get(value);
      return {
        type: ExecutableTypes.RETURN_OBJECT,
        value: currtoken.codeblock,
      };
    } else if (value.startsWith("__ARR__") && value.split(" ").length === 1) {
      const currtoken = tokens.get(value);
      return {
        type: ExecutableTypes.RETURN_ARRAY,
        value: currtoken.codeblock,
      };
    } else if (value.split("__PAR__").length > 1) {
      return {
        type: ExecutableTypes.RETURN_FUNCTIONEXE, value: value,
      };
    } else if (value.split("__ARR__").length > 1) {
      return {
        type: ExecutableTypes.RETURN_ARRAY_ELEMENT, value: value,
      };
    } else {
      return { type: ExecutableTypes.RETURN_VARIABLE, value: value };
    }
  }


};
