module.exports = (name, sp_state, g_state) => {
  if(!name) return null;
  if(name === "true") return true;
  if(name === "false") return false;
  if(name.startsWith("$")){
    let obj = {...g_state};
    name.substring(1, name.length).split(".").map(i => {
      if(obj){ obj = obj[i] }
    });
    if(obj === undefined) return null;
    return obj;
  }else{
    if(!sp_state) return null;
    let obj = {...sp_state};
    name.split(".").map(i => {
      if(obj){ obj = obj[i] }
    });
    if(obj === undefined) return null;
    return obj;
  }
}