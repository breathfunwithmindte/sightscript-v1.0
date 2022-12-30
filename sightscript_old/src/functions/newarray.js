const Func = require("../types/Func");
const Parsed = require("../types/Parsed");
const Parser = require("../parser/Parser");

module.exports = new Func({
  func_name: "newarray",
  prop_type: "values",
  /**
   * @param  {Parsed} current
   */
  func_exe: async function (current, sp_state) {
    const { self, func } = this;
    if(current.type !== "variable-function-exe") return;
    self.writeSomething(current.name, [], sp_state)
    return undefined;
  } 
})