const FunctionExe = require("../../types/FunctionExe");

module.exports = new FunctionExe("match", async function (executor, scope_state, current) {
  let [actual_string, match_value] = await executor.get_anonumous_props(current.prop, scope_state);
  if(typeof actual_string !== "string") throw new Error("String is required for the function match");
  if(typeof match_value !== "string") throw new Error("Match value is required to be a string.");

  let matched_value = actual_string.match(match_value);

  if(matched_value) return matched_value[0];
  return null
});