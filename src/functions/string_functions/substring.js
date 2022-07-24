const Func = require("../../types/Func");
const Parsed = require("../../types/Parsed");
const Parser = require("../../parser/Parser");

module.exports = new Func({
  func_name: "substring",
  prop_type: "values",
  /**
   * @param  {Parsed} current
   */
  func_exe: async function (current, sp_state) {
    const { self, func } = this;
    const props = func.getProps(self, current.props, sp_state);
    if(typeof props[0] !== "string") {
      clogs(41, 31, "[ERROR]", "First argument of function substring[string] should be an string.")
      return;
    }
    const oldstring = props[0]
    const substringwithA = props[1] || 0;
    const substringwithB = props[2] || oldstring.length;

    return oldstring.substring(substringwithA, substringwithB);
 
  } 
})