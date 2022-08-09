const FunctionExe = require("../../types/FunctionExe");

module.exports = new FunctionExe("statswith", async function (executor, scope_state, current) {
  let [actual_string, start_with_value] = await executor.get_anonumous_props(current.prop, scope_state);
  if(typeof actual_string !== "string") throw new Error("String is required for the function statswith");
  if(typeof start_with_value !== "string") throw new Error("Start with value is required to be a string.");

  return actual_string.startsWith(start_with_value);
});