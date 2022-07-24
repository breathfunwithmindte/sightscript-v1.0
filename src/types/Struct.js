const Func = require("./Func");
const Parsed = require("./Parsed");
const StructInstance = require("./StructInstance");

module.exports = class Struct {
  system_type = String;
  system_classname = String;
  system_parentclass = String;
  system_config = Object;
  system_methods = Array;
  init = Func;
  use = Func;

  /**
   * @param  {string} system_type
   * @param  {string} system_classname
   * @param  {string} system_parentclass
   * @param  {object} system_config
   * @param  {list<object>} system_methods // object<methodname, is_private>
   */
  constructor (system_type, system_classname, system_parentclass, system_config, system_methods)
  {
    this.setSystem_type(system_type);
    this.setSystem_classname(system_classname);
    this.setSystem_parentclass(system_parentclass);
    this.system_config = system_config || { schema: [] };
    this.setInitmethod();
    this.setUsemethod();
    this.setLogSchemamethod();
    this.system_methods = new Array();
    if(system_methods) {
      this.setSystem_methods(system_methods)
    }
  }

  setInitmethod ()
  {
    this.init = new Func({
      func_name: "init",
      prop_type: "values",
      config: { schema: this.system_config.schema },
      func_exe: async function (current, sp_state)
      {
        try {
          const { self, func } = this;
          const props = func.getProps(self, current.props, sp_state);
          const Class = self.readSomething(current.value.split("::")[0].trim(), sp_state);
          const struct_instance = new StructInstance(
            "class-instance", 
            Class.system_classname, 
            Class.system_parentclass,
            Class.system_config
          );
          struct_instance.setSystem_methodsAdvanced(Class);
          struct_instance.setValues(props);
          //console.log(struct_instance)
          self.writeSomething(current.name, struct_instance, sp_state)
        } catch (e) {
          console.log(e.toString());
        }
      }
    })
  }
  setLogSchemamethod ()
  {
    this["log_schema"] = new Func({
      func_name: "log_schema",
      prop_type: "values",
      config: { schema: this.system_config.schema },
      func_exe: async function (current, sp_state)
      {
        const { self, func } = this;
        const namesearch = current.type === "method-exe" ? current.name : current.value;
        const Class = self.readSomething(namesearch.split("::")[0].trim(), sp_state);
        if(!Class) return console.log("Class not found with this name.");
        console.table(Class.system_config.schema);
        console.table(Class.system_methods);
      }
    })
  }
  setUsemethod ()
  {
    this.use = new Func({
      func_name: "use",
      prop_type: "values",
      config: { schema: this.system_config.schema },
      func_exe: async function (current, sp_state)
      {
        const { self, func } = this;
        const [premethodname, methodcallback] = func.getProps(self, current.props, sp_state);
        const methodname_result = func.isPrivate(premethodname);
        const methodname = methodname_result.line;
        const is_private = methodname_result.is_private;
        if(methodcallback instanceof Parsed === false) throw new Error("2nd parameter should be type of callback.")
        if(methodcallback.type !== "callback") throw new Error("2nd parameter should be type of callback.")
        if(current.type === "variable-method-exe") throw new Error("Register method should not be assigned to a variable.")
        const compiled = self.compiler.main_compile(methodcallback.codeblock);
        methodcallback.setCodeblock(compiled);
        const Class = self.readSomething(current.name.split("::")[0].trim(), sp_state);
        Class[methodname] = new Func({
          func_name: methodname,
          prop_type: "values",
          config: {callback: methodcallback},
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
        Class.addSystem_method({ methodname: methodname, is_private: is_private });

      }
    })
  }
  

  setSystem_type(system_type)
  {
    if(typeof system_type !== "string") throw new Error("System type should be type of string.");
    this.system_type = system_type;
  }
  setSystem_classname(system_classname)
  {
    if(typeof system_classname !== "string") throw new Error("System classname should be type of string.");
    this.system_classname = system_classname;
  }
  setSystem_parentclass(system_parentclass)
  {
    if(!system_parentclass) return this.system_parentclass = "none";
    if(typeof system_parentclass !== "string") throw new Error("System parent class should be type of string.");
    this.system_parentclass = system_parentclass;
  }
  setSystem_methods (system_methods)
  {
    if(system_methods instanceof Array === false) throw new Error("System methods should be type of array");
    system_methods.map(i => {
      if(i.actualmethod) {
        this[i.methodname] = i.actualmethod;
      }
      this.system_methods.push({ methodname: i.methodname, is_private: i.is_private });
    });
  }
  addSystem_method (obj)
  {
    this.system_methods.push(obj);
  }

}