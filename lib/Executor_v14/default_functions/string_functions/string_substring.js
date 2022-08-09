const FunctionExe = require("../../types/FunctionExe");

module.exports = new FunctionExe("substring", async function (executor, scope_state, current) {
  let [actual_string, start_index, offset] = await executor.get_anonumous_props(current.prop, scope_state);
  if(typeof actual_string !== "string") throw new Error("String is required for the function substring");
  start_index = start_index || 0;
  offset = offset || actual_string.length;
  return actual_string.substring(start_index, offset);
});