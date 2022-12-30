const Func = require("../types/Func");
const Parsed = require("../types/Parsed");
const Parser = require("../parser/Parser");

module.exports = new Func({
  func_name: "print",
  prop_type: "values",
  /**
   * @param  {Parsed} current
   */
  func_exe: async function (current, sp_state) {
    const { self, func } = this;
    const props = func.getProps(self, current.props, sp_state);
    console.log(...props);
    return undefined;
  } 
})
