const FunctionExe = require("../../types/FunctionExe");

module.exports = new FunctionExe("filter", async function (executor, scope_state, current) {
  let [actual_array, callback] = await executor.get_anonumous_props(current.prop, scope_state);
  if(actual_array instanceof Array === false) throw new Error("Array is required for the function filter.");
  if(callback instanceof FunctionExe === false) throw new Error("Second prop should be type of function");

  const newarray = []

  for (let index = 0; index < actual_array.length; index++) {
    let obj = {...scope_state}
    obj[callback.funcprops[0]] = {...actual_array[index]};
    obj[callback.funcprops[1] || "index"] = index;
    const r = await executor.execute(callback.funccodeblock, obj)
    if(r) {
      newarray.push({...actual_array[index]});
    }
  }

  return newarray

});