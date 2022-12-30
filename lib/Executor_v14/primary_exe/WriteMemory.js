module.exports = (object, variable_name, variable_value) => {
   
    let obj = object;
    const i = variable_name.split(".");
    
    if(i.length === 1)
    {
      obj[i[0]] = variable_value;
      return obj;
    }
  
    let initial_obj = { ...getValue(obj, i.slice(0, i.length - 1).join(".")), [i[i.length - 1]]: variable_value }
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