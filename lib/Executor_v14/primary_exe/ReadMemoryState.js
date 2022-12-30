const FunctionExe = require("../types/FunctionExe");
const ReadMemory = require("./ReadMemory");

const err_message = "Problem is reader functions this should not be happends. Seems like a bug, plz contact with the creator of the sightscript.Some additional informations .... => "

module.exports = (scope_state, global_state, variable_name) => {
    if(!scope_state) throw new Error(
        err_message + JSON.stringify({ scope_state, global_state, variable_name }) + "--if scope_state"
    );
    if(!global_state) throw new Error(
        err_message + JSON.stringify({ scope_state, global_state, variable_name }) + "--if global_state"
    );
    if(!variable_name) throw new Error(
        err_message + JSON.stringify({ scope_state, global_state, variable_name }) + "--if name"
    );

    let obj = variable_name.startsWith("$") ?  global_state : scope_state;
    if(variable_name.split(" ").length > 1) {
        console.log("variable_name bad formated writter :: " + variable_name);
        return { type: "error", name: variable_name, actual_value: null}
    }
    const actual_variable_name = variable_name.startsWith("$") ? variable_name.substring(1, variable_name.length) : variable_name;

    const result = ReadMemory(obj, actual_variable_name.trim());

    if(result === undefined) {
        const result_global = ReadMemory(global_state, actual_variable_name.trim());
        if(result_global instanceof FunctionExe === true) {
            return { type: "function", name: variable_name, actual_value: result_global };
        } else {
            return { type: "variable", name: variable_name, actual_value: result_global ? result_global : null };
        }
    } else if (result instanceof FunctionExe === true) {
        return { type: "function", name: variable_name, actual_value: result };
    } else {
        return { type: "variable", name: variable_name, actual_value: result };
    }

}