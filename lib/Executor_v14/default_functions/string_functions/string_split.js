const FunctionExe = require("../../types/FunctionExe");

module.exports = new FunctionExe("match", async function (executor, scope_state, current) {
  let [actual_string, split_value] = await executor.get_anonumous_props(current.prop, scope_state);
  if(typeof actual_string !== "string") throw new Error("String is required for the function split");
  
  return actual_string.split(split_value || "");
});