const Func = require("../../types/Func");
const Parsed = require("../../types/Parsed");
const Parser = require("../../parser/Parser");

module.exports = new Func({
  func_name: "use",
  prop_type: "values",
  /**
   * @param  {Parsed} current
   */
  func_exe: async function (current, sp_state) {
    const { self, func } = this;
    const props = func.getProps(self, current.props, sp_state);
    const current_import_name = props[0];
    if(current_import_name.endsWith(".ss")) {
      /** do something we have import file type */
      // todo implement the inport from file
      clog(31, "this type of import is not implemented.");
    }else {
      const current_import = self.runtime_imports.get(current_import_name)
      if(!current_import) {
        clogs(41, 31, "[ERROR]", "use Error, import not found with name = " + current_import_name);
        return null;
      }
      const ss = new self.sightscript({
        script: current_import
      })
      await ss.execute();
      self.state = {...self.state, ...ss.state};
      return null;
    }
    return;
  } 
})