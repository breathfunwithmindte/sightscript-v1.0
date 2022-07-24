const logs = require("./logs");
const Parsed = require("./Parsed");

module.exports = class Func {
  constructor(props) {
    this.func_name = String;
    this.prop_type = String;
    this.func_exe = Function;
    this.config = Object;

    if (!props) return;
    this.setFunc_name(props.func_name);
    this.setFunc_prop_type(props.prop_type);
    this.setFunc_exe(props.func_exe);
    this.setConfig(props.config);
  }

  /**
   * @param  {string} name
   */
  setFunc_name(name) {
    if (typeof name !== "string") return;
    this.func_name = name;
  }

  /**
   * @param  {string} proptype
   */
  setFunc_prop_type(proptype) {
    if (typeof proptype !== "string") return;
    this.prop_type = proptype;
  }

  /**
   * @param  {function} func
   */
  setFunc_exe(func) {
    if (typeof func !== "function") return;
    this.func_exe = func;
  }

  /**
   * @param  {function} config
   */
  setConfig(config) {
    if (typeof config !== "object") return (this.config = new Object());
    this.config = config;
  }

  async exe(instance, current, sp_state) {
    const newfunc = this.func_exe.bind({ self: instance, func: this });
    return await newfunc(current, sp_state);
  }

  /**
   * @param {SightScript} instance
   * @param {string} props
   * @param {object} sp_state
   * @returns {list<object>}
   * todo maybe find better solution, bad but working code.
   */
  getProps(instance, props, sp_state) {
    if (this.prop_type === "values") {
      return instance.compiler.compile_props_variables(
        props,
        sp_state,
        instance.state,
        instance
      );
    } else if (this.prop_type === "structed") {
      let props_values = new Array();
      let parent = "none";
      let methods = [];
      props.split(/\r?\n/).map((i) => {
        i = i.trim();
        if (i === "") return;
        if (i.startsWith("extends") && i.split("extends").length > 1) {
          // ? first of all get the parent struct ...
          const parent_class = instance.readSomething(
            i.split("extends")[1].trim(),
            sp_state
          );
          if(parent_class === null){
            return logs.logc(31, `Parent class with name ${i.split("extends")[1].trim()} not found.`);
          }
          // ? if class exist and it is type of class and class.new is type of Func
          // ? then we can do logic for extends
          if (
            parent_class.system_type === "class" &&
            parent_class.init instanceof Func === true
            ) {
            // ? copy already pushed properties, then push the properties of parent class
            // ? ofc not forget to filter the private properties of parent class
            props_values = [...props_values, ...parent_class.system_config.schema.filter(f => !f.is_private)];
            // ? set the parent class name just in case we need it somewhere later
            parent = i.split("extends")[1].trim();
            // ? push methods from parent class to methods variable... dont forget to filter some properties.
            parent_class.system_methods.filter(f => f.is_private === false).map(smethod => {
              methods.push({
                methodname: smethod.methodname, 
                is_private: smethod.is_private, 
                actualmethod: parent_class[smethod.methodname]
              })
            })
            return;
          }
        }

        const { line, is_private } = this.#isPrivate(i);
        const obj = new Object();
        const arr = line.split(" ").filter((f) => f !== "");
        
        obj["property"] = arr[0];
        obj["type"] = arr[1] || "string";

        if(obj["type"].startsWith("__CALLBACK__")) {
          const methodcallback = instance.compiler.compile_props_variables(obj["type"], sp_state, instance.state, instance);
          const current_methodcallback = methodcallback[0]
          if(!current_methodcallback) return;
          if(current_methodcallback instanceof Parsed === false) throw new Error("2nd parameter should be type of callback.")
          if(current_methodcallback.type !== "callback") throw new Error("2nd parameter should be type of callback.")
          const compiled = instance.compiler.main_compile(current_methodcallback.codeblock);
          current_methodcallback.setCodeblock(compiled);
          const newmethodfunc = new Func({
            func_name: arr[0],
            prop_type: "values",
            config: {callback: current_methodcallback},
            func_exe: async function (current, l_sp_state) {
              const { self, func } = this;
              const props = func.getProps(self, current.props);
              let obj_props = new Object();
              func.config.callback.props.split(",").map(i => i.trim()).map((i, ind) => obj_props[i] = props[ind]);
              const newl_sp_state = { ...l_sp_state, ...obj_props, lala: "something more" }
              const use_name = current.type === "variable-method-exe" ?
               current.value.split("::")[0].trim() 
               : 
               current.name.split("::")[0].trim()
              const current_instance_of_class = self.readSomething(use_name, l_sp_state);
              newl_sp_state["current"] = current_instance_of_class;
              await self.primary_execute(func.config.callback.codeblock, newl_sp_state)
  
            }
          })
          methods.push({
            methodname: arr[0], 
            is_private: is_private, 
            actualmethod: newmethodfunc
          })
          return;
        }

        arr.slice(2, arr.length).map((i) => {
          const [n, v] = i.split("::");
          const av = this.#props_variables_struct_get_value(v);
          obj[n] = av === undefined ? true : av;
        });
        obj["is_private"] = is_private;
        props_values.push(obj);
      });
      return { schema: props_values, parent_class: parent, methods: methods};
    }

    return {};
  }

  #props_variables_struct_get_value(v) {
    if (!v) return undefined;
    if (v === "true" || v === "TRUE") return true;
    if (v === "false" || v === "FALSE") return false;
    if (!isNaN(Number(v))) return Number(v);
    return v;
  }

  isPrivate(string, private_default) {
    return this.#isPrivate(string);
  }

  #isPrivate(string) {
    if (string.search("private") !== -1)
      return { line: string.replace("private", "").trim(), is_private: true };
    return { line: string.replace("public", "").trim(), is_private: false };
  }

};
