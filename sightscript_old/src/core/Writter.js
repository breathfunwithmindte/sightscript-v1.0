/**
 * 
 * @param {object} obj // ? write to // 
 * @param {*} name // ? object property, sightscript variable name //
 * @param {*} value // ? value to write //
 * @returns void
 */

 module.exports = (sp_state, state, name, value) => {
  if(!sp_state) return console.log("no local state writter");
  if(!state) return console.log("no state writter");
  if(!name) return console.log("no name writter");
  let obj = name.startsWith("$") ?  state : sp_state;
  if(name.split(" ").length > 1) return console.log("name bad formated writter");;
  const i = name.startsWith("$") ? name.substring(1, name.length).split(".") : name.split(".");
  if(i.length === 1)
  {
    obj[i[0]] = value;
    return obj;
  }

  let initial_obj = { ...getValue(obj, i.slice(0, i.length - 1).join(".")), [i[i.length - 1]]: value }
  let index = i.length - 2;
  while (index > 0)
  {
    // todo cloning the memory ... check if needed to update
    // todo test it with variable.user = variable1.user;
    // todo change after property in user, this will not change in both of the objects;
    initial_obj = { ...getValue(obj, i.slice(0, index).join(".")), [i[index]]: initial_obj };
    index--;
  }
  for (const key in initial_obj) {
    if (Object.hasOwnProperty.call(initial_obj, key)) {
      if(!obj[i[0]]){ obj[i[0]] = {} }
      obj[i[0]][key] = initial_obj[key] 
    }
  }

  return obj
}

function getValue (object, string)
{
  if(!object) return console.log("No object, get value !!");
  if(!string) return console.log("No string, get value !!");
  let lobj = {...object};
  string.split(".").map(i => {
    if(lobj){ lobj = lobj[i] }
  });
  if(lobj instanceof Object === false) return {};
  return lobj;
}
