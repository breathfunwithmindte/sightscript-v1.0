const Func = require("../../types/Func");
const Parsed = require("../../types/Parsed");
const Parser = require("../../parser/Parser");

module.exports = new Func({
  func_name: "clean",
  prop_type: "values",
  /**
   * @param  {Parsed} current
   */
  func_exe: async function (current, sp_state) {
    const { self, func } = this;
    if(current.type !== "function-exe") return;
    const [arr_name] = current.props.split(",");
    self.writeSomething(arr_name.trim(), [], sp_state);
    return;
  } 
})