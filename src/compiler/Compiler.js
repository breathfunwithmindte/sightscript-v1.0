const Parsed = require("../types/Parsed");
const Parser = require("../parser/Parser");
module.exports = class Compiler {
  #functions = require("./helpers/index");
  #reader = require("./helpers/Reader");
  #tokens;
  #runtime_errors = new Array();
  #errors;
  tests = []
  /**
   * @type {list<Parsed>}
   */
  executables = new Array();

  /**
   * @param  {list<Parsed>} objects
   * @param  {Map<string, string>} tokens
   * @param {boolean} store_global
   */
  main_compile (objects, tokens, errors)
  {
    // todo improve this place, use tokens and errors from outside without passing props.
    if(this.#tokens === undefined)
    {
      this.#tokens = tokens;
    }
    if(this.#errors === undefined)
    {
      this.#errors = errors;
    }

    /**
     * @type {list<Parsed>}
     */
    const local_executables = new Array();
  
    objects.map((object, index) => {
      if(["variable", "variable-method-exe", "variable-function-exe"].some(s => s === object.type))
      {
        return local_executables.push(this.#compile_variable_v2(object));
      }
      if(object.type === "function-exe" || object.type === "method-exe")
      {
        object.setCodeblock(this.main_compile(object.codeblock))
        return local_executables.push(object);
      }
      if(object.type === "ifstatement" || object.type === "forloop" || object.type === "function")
      {
        object.setCodeblock(this.main_compile(object.codeblock));
        return local_executables.push(object);
      }
      if(object.type === "return")
      {
        if(object.value.search("\\+|-|\\*|\\/|\\|\\||&&|==|!=|<=|>=") !== -1) {
          object.setType("return-operator-expression");
        }else if(!isNaN(Number(object.value))) {
          object.setType("return-actual-value");
          object.value = Number(object.value);
        }else if(object.value.startsWith("__STRING__")) {
          object.setType("return-actual-value");
          object.value = this.#tokens.get(object.value.trim())
        }
        return local_executables.push(object);
      }
      if(object.type === "variable-callback")
      {
        this.#compile_callback(object, this.#tokens ? this.#tokens : tokens);
        local_executables.push(object);
        return;
      }
      if(object.status === -1) {
        clogs(41, 31, "[ERROR]", "Compiler could not complile object << " + JSON.stringify(object) + " >>. \nSkipping this object and continue;")
      }
    })
    return local_executables;
  }

  #compile_callback (object, tokens)
  {
    const code = tokens.get(object.value);
    if(!code) return [];
    const [initial_part, pre_codeblock] = code.split("=>").map(i => i.trim());
    const codeblock = tokens.get(pre_codeblock);
    object.setCodeblock(Parser.parse(codeblock.substring(1, codeblock.length - 1), tokens, this.#errors));
    object.setProps(initial_part.substring(3, initial_part.length - 1))
  }

  #compile_callback_toParsed (string)
  {
    const code = this.#tokens.get(string);
    if(!code) return [];
    const [initial_part, pre_codeblock] = code.split("=>").map(i => i.trim());
    const codeblock = this.#tokens.get(pre_codeblock);
    return new Parsed({
      status: 0,
      type: "callback",
      codeblock: Parser.parse(codeblock.substring(1, codeblock.length - 1), this.#tokens, this.#errors),
      props: initial_part.substring(3, initial_part.length - 1),
      name: "callback",
    })
  }
  
  #compile_variable_v2 (variable_obj)
  {
    let v = variable_obj.value;
    if(typeof v !== "string") return;
    if(v.startsWith("__STRING__"))
    {
      const av = this.#tokens.get(v) // actual value //
      variable_obj.setType("variable-string");
      variable_obj.value = av.substring(1, av.length - 1);
      return variable_obj;
    }
    if(v.startsWith("__TSTRING__"))
    {
      const av = this.#tokens.get(v) // actual value //
      variable_obj.setType("variable-tstring");
      variable_obj.value = av.substring(1, av.length - 1);
      return variable_obj;
    }
    if(!isNaN(Number(v))) {
      variable_obj.setType("variable-number");
      variable_obj.value = Number(v);
      return variable_obj;
    }
    if(v.search("\\+|-|\\*|\\/|\\|\\||&&|==|!=|<=|>=") !== -1){
      variable_obj.setType("variable-operatorORexpression");
      variable_obj.ready = false;
      return variable_obj;
    }
    if(variable_obj.type === "variable-method-exe" || variable_obj.type === "variable-function-exe")
    {
      const par_code = this.#tokens.get("__PAR__" + v.split("__PAR__")[1]);
      variable_obj.setProps(par_code.substring(1, par_code.length - 1));
      variable_obj.value = v.split("__PAR__")[0];
      variable_obj.ready = true;
      return variable_obj
    }
    return variable_obj
  }

  // todo take a look the differences about v0 and v2 compile_datattypes;
  #compile_datatype (value)
  {
    // todo variable with operators, expressions //
    if(typeof value === "string") {
      // !debug console.log("@@", value)
      if(value.startsWith("__STRING__")) {
        const v = this.#tokens.get(value);
        return { type: "variable-string", value: v.substring(1, v.length - 1), ready: true }
      }
      if(value.startsWith("__TSTRING__")) {
        const v = this.#tokens.get(value);
        return { type: "variable-tstring", value: v.substring(1, v.length - 1), ready: true }
      }
      if(value.startsWith("__CALLBACK__")) {
        return this.#compile_callback_toParsed(value, this.#tokens);
      }
      if(value.search("__PAR__") != -1) {
        const v = this.#tokens.get(`__PAR__${value.split("__PAR__")[1].trim()}`)
        if(value.split("::").length > 1) {
          return {
            type: "variable-method-exe", value: value.split("__PAR__")[0].trim(), props: v.substring(1, v.length -1)
          }
        }else{
          return {
            type: "variable-function-exe", value: value.split("__PAR__")[0].trim(), props: v.substring(1, v.length -1)
          }
        }
      }
      if(!isNaN(Number(value))) {
        return { type: "variable-number", value: Number(value), ready: true }
      }
      if(value.search("\\+|-|\\*|\\/|\\|\\||&&|==|!=|<=|>=") !== -1){
        return { type: "variable-operatorORexpression", value: value, ready: false }
      }
      return { type: "variable", value: value, ready: false }
    }
  }

  compile_datatype (value)
  {
    return this.#compile_datatype(value);
  }

  getProps (type, props, sp_state, g_state)
  {
    if(type === "values") return this.compile_props_variables(props, sp_state, g_state);
    return []
  }

  compile_props_variables (props, sp_state, g_state, instance) 
  {
    let props_values = new Array();
    if(props === "") return [];
    props.split(",").map(i => {
      const v_object = this.#compile_datatype(i.trim());
      if(v_object.type === "variable-string" || v_object.type === "variable-number"){
        props_values.push(typeof v_object.value === "string" ? v_object.value.trim() : v_object.value);
      }else if (v_object.type === "variable-tstring" && instance){
        props_values.push(instance.getTstring(v_object.value, sp_state));
      }else if (v_object.type === "variable"){
        props_values.push(this.#reader(v_object.value.trim(), sp_state, {...g_state}));
      }else if(v_object.type === "callback") {
        props_values.push(v_object);
      }
    });
    return props_values;
  }

  

}