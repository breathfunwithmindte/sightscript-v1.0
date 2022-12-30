const WriteMemory = require("./WriteMemory");

const err_message = "Problem is writter functions this should not be happends. Seems like a bug, plz contact with the creator of the sightscript.Some additional informations .... => "

module.exports = (scope_state, global_state, variable_name, variable_value) => {
    if(!scope_state) throw new Error(
        err_message + JSON.stringify({ scope_state, global_state, variable_name, variable_value }) + "--if scope_state"
    );
    if(!global_state) throw new Error(
        err_message + JSON.stringify({ scope_state, global_state, variable_name, variable_value }) + "--if global_state"
    );
    if(!variable_name) throw new Error(
        err_message + JSON.stringify({ scope_state, global_state, variable_name, variable_value }) + "--if name"
    );

    let obj = variable_name.startsWith("$") ?  global_state : scope_state;
    if(variable_name.split(" ").length > 1) return console.log("variable_name bad formated writter");
    const actual_variable_name = variable_name.startsWith("$") ? variable_name.substring(1, variable_name.length) : variable_name;

    WriteMemory(obj, actual_variable_name, variable_value);
}