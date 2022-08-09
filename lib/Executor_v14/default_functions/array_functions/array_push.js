const FunctionExe = require("../../types/FunctionExe");

module.exports = new FunctionExe("push", async function (executor, scope_state, current) {
  let [actual_array, something] = await executor.get_anonumous_props(current.prop, scope_state);
  if(actual_array instanceof Array === false) throw new Error("Array is required for the function push.");
  actual_array.push(something)
  return actual_array
});