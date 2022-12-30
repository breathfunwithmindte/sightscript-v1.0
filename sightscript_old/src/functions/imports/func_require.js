const Func = require("../../types/Func");
const Parsed = require("../../types/Parsed");
const Parser = require("../../parser/Parser");

module.exports = new Func({
  func_name: "require",
  prop_type: "values",
  /**
   * @param  {Parsed} current
   */
  func_exe: async function (current, sp_state) {
    const { self, func } = this;
    const props = func.getProps(self, current.props, sp_state);
    const current_require_prop = props[0];
    if(current_require_prop.search(".ss") !== -1) {
      /** do something we have import file type */
      clog(31, "this type of import is not implemented.");
    }else {
      const [current_require_name, current_require_property] = current_require_prop.split("::");
      const current_require = self.runtime_imports.get(current_require_name)
      if(!current_require) {
        clogs(41, 31, "[ERROR]", "required file not found with name = " + current_require_name);
        return null;
      }
      const ss = new self.sightscript({
        script: current_require
      })
      const result = await ss.execute();
      current_export = current_require_property ? ss.state[current_require_property] : ss.state["export"];
      return current_export || null;

    }
    return;
  } 
})