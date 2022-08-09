const Executable = require("../../../types/Executable");
const ExecutableTypes = require("../../../types/ExecutableTypes");
const FunctionExe = require("../../types/FunctionExe");

module.exports = new FunctionExe("map", async function (executor, scope_state, current) {
  let [actual_array, callback] = await executor.get_anonumous_props(current.prop, scope_state);
  if(actual_array instanceof Array === false) throw new Error("Array is required for the function map.");
  if(callback instanceof FunctionExe === false) throw new Error("Second prop should be type of function");
  const newarray = []

  for (let index = 0; index < actual_array.length; index++) {
    let obj = {...scope_state}
    obj[callback.funcprops[0]] = {...actual_array[index]};
    obj[callback.funcprops[1] || "index"] = index;
    const r = await executor.execute(callback.funccodeblock, obj)
    newarray.push(r);
  }


  return newarray


});


// ! alternative --- first working sample;
// for (let index = 0; index < actual_array.length; index++) {
//   let obj = {...scope_state}
//   obj[callback.funcprops[0]] = {...actual_array[index]};
//   obj[callback.funcprops[1] || "index"] = index;

//   const r = await callback.funcexe(executor, obj, new Executable({
//     type: ExecutableTypes.ANONYMOUS_FUNCTION_EXE,
//     props: [
//       new Executable({ type: ExecutableTypes.ANONYMOUS_VARIABLE, name: ".",  value:  callback.funcprops[0]}),
//       new Executable({ type: ExecutableTypes.ANONYMOUS_VARIABLE, name: ".",  value:  callback.funcprops[1] || "index"})
//   ]
//   }))
//   newarray.push(r);
// }