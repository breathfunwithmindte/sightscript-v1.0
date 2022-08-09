const FunctionExe = require("../../types/FunctionExe");

module.exports = new FunctionExe("uppercase", async function (executor, scope_state, current) {
  let [actual_string] = await executor.get_anonumous_props(current.prop, scope_state);
  if(typeof actual_string !== "string") throw new Error("String is required for the function uppercase");

  return actual_string.toUpperCase();
});