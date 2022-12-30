const ExecutableTypes = require("./ExecutableTypes");

module.exports = class Executable {

  /**
   * @type {ExecutableTypes}
   */
  type;

  name;
  prop; // executable[]
  funcprops; // just array []
  value;
  element_index; // int
  variable_func_exe; // executable;
  arr_value; // executable[]
  obj_value; // executable[]
  codeblock; // executable[]
  expressions; // [] expressions
  forexpression;
  ifexpression;
  error;

  constructor ({ 
    type, name, props, value, arr_value, obj_value, codeblock, expressions,
    forexpression, ifexpression, error, funcprops, variable_func_exe, element_index
  })
  {
    this.type = type || ExecutableTypes.UNKNOW;
    this.name = name || ".";
    this.prop = props || [];
    this.funcprops = funcprops || [];
    this.value = value;
    this.element_index = element_index || 0;
    this.variable_func_exe = variable_func_exe || null;
    this.arr_value = arr_value || [];
    this.expressions = expressions || [];
    this.obj_value = obj_value || [];
    this.codeblock = codeblock || [];
    this.forexpression = forexpression || [];
    this.ifexpression = ifexpression || [];
    this.error = error || '';
  }

  short_log_str () {
    return `--T {${this.type}}, --N {${this.name}}, --V {${typeof this.value + "--" + this.value}}`
  }

  short_log () {
    return { 
      type: this.type, name: this.name, value: typeof this.value === "string" ? this.value.substring(0, 24) : this.value,
      ifexp: this.ifexpression.length, forexp: this.forexpression.join(","), funcprops: this.funcprops, props: this.prop,
      codeblock: this.codeblock
    }
  }


}