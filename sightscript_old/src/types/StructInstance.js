const Func = require("./Func");

module.exports = class StructInstance {
  system_type = String;
  system_classname = String;
  system_parentclass = String;
  system_config = Object;
  system_methods = Array;

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
    this.set_getObject()
    this.set_toJSON()
    this.set_toString()
    if(system_methods) {
      this.setSystem_methods(system_methods)
    }else{
      this.system_methods = new Array()
    }
    
  }

  set_getObject()
  {
    this.getObject = new Func({
      func_name: "getObject",
      prop_type: "values",
      config: { schema: this.system_config.schema },
      func_exe: async function (current, sp_state)
      {
        const { self, func } = this;
        const namesearch = current.type === "method-exe" ? current.name : current.value;
        const current_class  = self.readSomething(namesearch.split("::")[0].trim(), sp_state);
        if(!current_class) return null;
        const returnObj = new Object();
        current_class.system_config.schema.map(i => {
          if(i.is_private) return;
          returnObj[i.property] = current_class[i.property];
        })
        return returnObj;
      }
    })
  }
  set_toJSON()
  {
    this.toJSON = new Func({
      func_name: "toJSON",
      prop_type: "values",
      config: { schema: this.system_config.schema },
      func_exe: async function (current, sp_state)
      {
        const { self, func } = this;
        const namesearch = current.type === "method-exe" ? current.name : current.value;
        const current_class  = self.readSomething(namesearch.split("::")[0].trim(), sp_state);
        if(!current_class) return null;
        const returnObj = new Object();
        current_class.system_config.schema.map(i => {
          if(i.is_private) return;
          returnObj[i.property] = current_class[i.property];
        })
        return JSON.stringify(returnObj);
      }
    })
  }
  set_toString()
  {
    this.toString = new Func({
      func_name: "toString",
      prop_type: "values",
      config: { schema: this.system_config.schema },
      func_exe: async function (current, sp_state)
      {
        const { self, func } = this;
        const namesearch = current.type === "method-exe" ? current.name : current.value;
        const current_class  = self.readSomething(namesearch.split("::")[0].trim(), sp_state);
        if(!current_class) return null;
        const returnArr = new Array();
        current_class.system_config.schema.map(i => {
          if(i.is_private) return;
          returnArr.push(`Property: ${i.property} is equal ${JSON.stringify(current_class[i.property])}`)
        })
        return returnArr.join("\n");
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
    if(typeof system_parentclass !== "string") throw new Error("System parent class should be type of string.");
    this.system_parentclass = system_parentclass;
  }
  setSystem_methods (system_methods)
  {
    if(system_methods instanceof Array === false) throw new Error("System methods should be type of array");
    system_methods.map(i => this.system_methods.push(i));
  }

  setSystem_methodsAdvanced (Class)
  {
    Class.system_methods.map(i => {
      if(i.is_private === true) return;
      this.system_methods.push(i);
      this[i.methodname] = Class[i.methodname];
    })
  }

  setValues (props)
  {
    this.system_config.schema.map((elm, index) => {
      const curr = props[index];
      if(elm.type === "string") {
        if((!curr || typeof curr !== "string") && elm.required === true) throw new Error(`${elm.property} is required.`);
        this[elm.property] = typeof curr === "string" ? curr.toString() : null
      }else if (elm.type === "number") {
        this[elm.property] = Number(curr)
      } else {
        this[elm.property] = curr || null
      }
    })
  }

}