const Func = require("../../types/Func");
const Parsed = require("../../types/Parsed");
const Parser = require("../../parser/Parser");

module.exports = new Func({
  func_name: "newarray",
  prop_type: "values",
  /**
   * @param  {Parsed} current
   */
  func_exe: async function (current, sp_state) {
    const { self, func } = this;
    if(current.type !== "function-exe") return;
    const [arr_name, element] = current.props.split(",").map(i => i.trim());
    const current_array = self.readSomething(arr_name, sp_state);
    const actual_value = func.getProps(self, element, sp_state);
    current_array.push(actual_value[0]);
    return undefined;
  } 
})