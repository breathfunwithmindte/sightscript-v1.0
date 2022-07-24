const Tokenizer = require("../tokenizer/Tokenizer");
const Func = require("../types/Func");
const Parsed = require("../types/Parsed");
const Writter = require("./Writter");

module.exports = class Executor extends Tokenizer {
  constructor(props)
  {
    super(props)
  }

  async primary_execute (executables, initial_sp_state)
  {
    let sp_state = initial_sp_state ? initial_sp_state : new Object(); // ! scoped proccess state //
    // console.log(executables)
    for (let index = 0; index < executables.length; index++) {
      const current = executables[index];
      if(!current) continue;
      // todo debug this error || also debug why i cant pass structs throw props;
      //  if(!current) {
      //   console.log(current, "###########3", index);
      //   console.table(executables)
      //   console.table(this.objects[2].codeblock)
      //   return;
      // }
      if(current.type === "variable-number" || current.type === "variable-string")
      {
        this.#writeVariable(current, sp_state)
      }
      if(current.type === "variable-tstring")
      {
        this.#writeVariable(this.#executeTstring(current, sp_state), sp_state);
      }
      if(current.type === "variable")
      {
        this.#writeVariableWithVariable(current, sp_state)
      }
      if(current.type === "variable-operatorORexpression")
      {
        this.writeSomething(current.name, this.#compilerAnDrun_operatorsORexpresstions(current.value, sp_state), sp_state);
      }
      if(current.type === "function-exe")
      {
        await this.#executeFunction(current, sp_state);
      }
      if(current.type === "variable-method-exe")
      {
        await this.#executeVariableMethod(current, sp_state);
      }
      if(current.type === "method-exe")
      {
        await this.#executeMethod(current, sp_state);
      }
      /**@function */
      if(current.type === "function") 
      {
        this.#defineFunction(current, sp_state);
      }
      if(current.type === "variable-function-exe")
      {
        await this.#executeVariableFunction(current, sp_state);
      }
      if(current.type === "ifstatement")
      {
        const r = await this.#executeIfstatement(current, sp_state);
        if(r !== undefined) return r;
      }

      /** @return */
      if(current.type === "return-actual-value")
      {
        return current.value;
      }
      if(current.type === "return-operator-expression")
      {
        return this.#compilerAnDrun_operatorsORexpresstions(current.value, sp_state);
      }
      if(current.type === "return")
      {
        return this.#getValue(sp_state, current.value);
      }
      
    }
    return sp_state["export"];
  }

  /**
   * 
   * @param {Parsed} current 
   * @param {object} sp_state
   * @returns void 
   * todo check if there is variable with same name that is not writable;
   */
  #writeVariable (current, sp_state)
  {
    Writter(sp_state, this.state, current.name, current.value);
  }

  writeSomething (name, value, sp_state)
  {
    Writter(sp_state, this.state, name, value);
  }

  readSomething (name, sp_state)
  {
    return this.#getValue(sp_state, name);
  }

  /**
   * 
   * @param {Parsed} current 
   * @param {object} sp_state
   * @returns void 
   * todo check if there is variable with same name that is not writable;
   */
  #writeVariableWithVariable (current, sp_state)
  {
    Writter(sp_state, this.state, current.name, this.#getValue(sp_state, current.value));
  }

  #executeTstring (current, sp_state)
  {
    [...current.value.matchAll("{{(.*)}}")].map(i => i[0]).map(i => {
      let initial_i = i;
      i = i.substring(2, i.length - 2).trim();
      if(i === "") return;
      if(i.search("\\+|-|\\*|\\/|\\|\\||&&|==|!=|<=|>=") !== -1) {
        current.value = current.value.replace(initial_i, this.#compilerAnDrun_operatorsORexpresstions(i, sp_state));
      }else {
        current.value = current.value.replace(initial_i, this.#getValue(sp_state, i))
      }
    })
    return current;
  }

  async #executeFunction (current, sp_state)
  {
    if(!this.functions.has(current.name)) return console.log("function not found with this name !!!");
    const func = this.functions.get(current.name);
    try{
      await func.exe(this, current, sp_state);
    }catch(err){
      console.log(err);
    }
  }

  async #executeIfstatement (current, sp_state)
  {
    if(this.#compilerAnDrun_operatorsORexpresstions(current.props, sp_state)) {
      const r = await this.primary_execute(current.codeblock, sp_state);
      return r;
    }
    return undefined;
  }

  #defineFunction (current, sp_state)
  {
    const func = new Func({ 
      func_name: current.name, 
      prop_type: "values",
      func_exe: async function (in_current, in_sp_state) {
        const { self, func } = this;
        const props = self.compiler.getProps(func.prop_type, in_current.props, in_sp_state, self.state);
        let prop_sp_state = new Object();
        current.props
          .split(",")
          .map(i => i.trim())
          .filter(f => f !== "")
          .map((i, index) => prop_sp_state[i] = props[index])
        const r = await self.primary_execute(current.codeblock, prop_sp_state);
        return r;
      },
      config: {props: current.props}
    })
    this.functions.set(current.name, func);
  }

  async #executeVariableFunction (current, sp_state)
  {
    if(!this.functions.has(current.value)) return console.log("function not found with this name !!!");
    const func = this.functions.get(current.value);
    try{
      const r = await func.exe(this, current, sp_state);
      if(r === undefined) return // console.log("this is undefined");
      Writter(sp_state, this.state, current.name, r);
    }catch(err){
      console.log(err);
    }
  }

  async #executeVariableMethod (current, sp_state)
  {
    const [object_before, method_name] = current.value.split("::");
    const actual_value = this.#getValue(sp_state, object_before.trim());
    if(!actual_value) return console.log("no value"); // todo do smth with the error //;
    if(actual_value[method_name] instanceof Func) {
      try{
        const r = await actual_value[method_name].exe(this, current, sp_state)
        if(r === undefined) return // console.log("this is undefined");
        Writter(sp_state, this.state, current.name, r);
      }catch(err){
        console.log(err);
      }
    }else{
      console.log("method is not instance of function " + JSON.stringify(current));
      // todo do smth with the error //
    }
  }

  async #executeMethod (current, sp_state)
  {
    const [object_before, method_name] = current.name.split("::");
    const actual_value = this.#getValue(sp_state, object_before.trim());
    if(!actual_value) return console.log("no value"); // todo do smth with the error //;
    if(actual_value[method_name] instanceof Func) {
      try{
        console.log(await actual_value[method_name].exe(this, current, sp_state))
      }catch(err){
        console.log(err);
      }
    }else{
      console.log("method is not instance of function " + JSON.stringify(current));
      // todo do smth with the error //
    }
  }


  /**
   * @param  {object} sp_state
   * @param  {string} name
   * @returns  {any}
   */
  #getValue (sp_state, name)
  {
    if(!name) return null;
    if(name === "true") return true;
    if(name === "false") return false;
    if(name.startsWith("$")){
      let obj = this.state;
      name.substring(1, name.length).split(".").map(i => {
        if(obj){ obj = obj[i] }
      });
      if(obj === undefined) return null;
      return obj;
    }else{
      if(!sp_state) return null;
      let obj = sp_state;
      name.split(".").map(i => {
        if(obj){ obj = obj[i] }
      });
      if(obj === undefined) return null;
      return obj;
    }
  }

  #compilerAnDrun_operatorsORexpresstions (value, sp_state, inside)
  {
    if(typeof value !== "string") {
      clogs(41, 31, "[ERROR]", "Value should be type of string, error at expressions, " + value)
      return null;
    }
    let local_value = value;
    //clog(31, "->" + local_value + "|||__" + JSON.stringify(sp_state) + "__" + inside)
    value.split(" ").map(i => {
      if(i.startsWith("__STRING__") || i.startsWith("__TSTRING__")) {
        local_value = this.#replacer(local_value, i)
      } else if(i.startsWith("__PAR__")) {
        let t = this.tokens.get(i.trim());
        t = t.substring(1, t.length - 1);
        t = this.#compilerAnDrun_operatorsORexpresstions(t, sp_state, true)
        local_value = local_value.replace(i, `(${t})`)
      } else if(i.startsWith("__GROUP__")) {
        let t = this.tokens.get(i.trim())
        t = t.substring(2, t.length - 2);
        t = this.#compilerAnDrun_operatorsORexpresstions(t, sp_state, true);
        local_value = local_value.replace(i, `(${t})`)
      } else if(this.#getValue(sp_state, i) !== null) {
        const vv = this.#getValue(sp_state, i);
        if(typeof vv === "string") {
          local_value = local_value.replace(i, `"${vv}"`);
        }else if(typeof vv === "boolean" || typeof vv === "number") {
          local_value = local_value.replace(i, vv);
        }else{
          local_value = local_value.replace(i, vv.toString());
        }
      } else if(isNaN(Number(i)) && !this.operatos_expressions.some(s => s === i.trim())) {
        if(i.trim() === "" || i.trim() === "(" || i.trim() === ")") return;
        local_value = local_value.replace(i, `${this.readSomething(i.trim(), sp_state)}`)
      }
    })
    if(inside)
    {
      const v = eval(local_value)
      if(!isNaN(Number(v))) {
        return v 
      }else{
        return `"${v}"`
      }
    }
    return eval(local_value);
  }

  getTstring (value, sp_state)
  {
    let initial_value = value;
    [...value.matchAll("{{(.*)}}")].map(i => i[0]).map(i => {
      let initial_i = i;
      i = i.substring(2, i.length - 2).trim();
      if(i === "") return;
      if(i.search("\\+|-|\\*|\\/|\\|\\||&&|==|!=|<=|>=") !== -1) {
        initial_value = initial_value.replace(initial_i, this.#compilerAnDrun_operatorsORexpresstions(i, sp_state));
      }else {
        initial_value = initial_value.replace(initial_i, this.#getValue(sp_state, i))
      }
    })
    return initial_value;
  }

  #replacer (string, token) 
  {
    return string.replace(token, this.tokens.get(token.trim()))
  }

}