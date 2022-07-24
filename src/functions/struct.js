const Func = require("../types/Func");
const Parsed = require("../types/Parsed");
const Parser = require("../parser/Parser");
const Writter = require("../core/Writter");
const makeid = require("../utils/id");
const Struct = require("../types/Struct");

module.exports = new Func({
  func_name: "struct",
  prop_type: "structed",
  /**
   * @param  {Parsed} current
   */
  func_exe: async function (current, sp_state) {
    const { self, func } = this;
    //console.log(current);
    if (current.type !== "variable-function-exe") return;
    const { parent_class, schema, methods } = func.getProps(self, current.props, sp_state);
    // console.log(parent_class, schema, methods, "@@@@@")
    self.writeSomething(
      current.name,
      new Struct("class", current.name + makeid(14), parent_class, { schema: schema }, methods),
      sp_state
    )
  },
});
