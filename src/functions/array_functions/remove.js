const Func = require("../../types/Func");
const Parsed = require("../../types/Parsed");
const Parser = require("../../parser/Parser");

module.exports = new Func({
  func_name: "remove",
  prop_type: "values",
  /**
   * @param  {Parsed} current
   */
  func_exe: async function (current, sp_state) {
    const { self, func } = this;
    const props = func.getProps(self, current.props, sp_state);
    if(props[0] instanceof Array === false) {
      clogs(41, 31, "[ERROR]", "First argument of function find should be an array.")
      return;
    }
    if(props[1] instanceof Parsed === false) {
      clogs(41, 31, "[ERROR]", "Second argument of function find should be an callback[Parsed].")
      return;
    }
    const array = props[0]
    const callback = props[1]
    let newarray = [];

    const compiled = self.compiler.main_compile(callback.codeblock);
    const callbackprops = callback.props.split(",").map(i => i.trim());
    const p_elm_name = callbackprops[0] === "" ? "element" : callbackprops[0]; // props element name
    const p_elm_index = callbackprops[1] ? callbackprops[1] : "index"; // props element index
    callback.setCodeblock(compiled);

    for (let index = 0; index < array.length; index++) {
      const elm = array[index];
      const result = await self.primary_execute(callback.codeblock, {
        ...sp_state, [p_elm_name]: elm, [p_elm_index]: index, 
      });
      if(!result) {
        newarray.push(elm);
      }    
    }

    return newarray
 
  } 
})