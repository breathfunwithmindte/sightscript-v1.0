const FunctionExe = require("../../types/FunctionExe");

module.exports = new FunctionExe("endswith", async function (executor, scope_state, current) {
  let [actual_string, end_with_value] = await executor.get_anonumous_props(current.prop, scope_state);
  if(typeof actual_string !== "string") throw new Error("String is required for the function endswith");
  if(typeof end_with_value !== "string") throw new Error("End with value is required to be a string.");

  return actual_string.endsWith(end_with_value);
});