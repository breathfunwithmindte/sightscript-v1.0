const FunctionExe = require("../../types/FunctionExe");

module.exports = new FunctionExe("print", async function (executor, scope_state, current) {
  const runtime_current_props = await executor.get_anonumous_props(current.prop, scope_state);
  console.log(...runtime_current_props);
});

// this.state.lala = {}
// this.state.lala.print = new FunctionExe("print", async function (executor, scope_state, current) {
//     const get_props_values = await executor.get_anonumous_props(current.prop, scope_state);
//     console.log(get_props_values);
//     //console.log(...get_props_values);
//     return "hello from func exe";
// })