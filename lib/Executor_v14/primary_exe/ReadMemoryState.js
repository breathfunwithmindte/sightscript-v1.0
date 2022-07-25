const FunctionExe = require("../types/FunctionExe");
const ReadMemory = require("./ReadMemory");

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

    const result = ReadMemory(obj, actual_variable_name, variable_value);

    if(result === undefined) {
        const result_global = ReadMemory(obj, actual_variable_name, variable_value);
        if(result_global instanceof FunctionExe === true) {
            console.log("this variable is function exe type");
        } else {
            return { type: "variable", actual_value: result_global ? result_global : null };
        }
    } else if (result instanceof FunctionExe === true) {
        console.log("this variable is function exe type");
    } else {
        return { type: "variable", actual_value: result };
    }

}