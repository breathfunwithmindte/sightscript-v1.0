const WriteMemory = require("./primary_exe/WriteMemory");
const WriteMemoryState = require("./primary_exe/WriteMemoryState");
const ReadMemory = require("./primary_exe/ReadMemory");
const ReadMemoryState = require("./primary_exe/ReadMemoryState");
const Executable = require("../types/Executable");
const makeid = require("../utils/makeid");
const Logs = require("../utils/Logs");

module.exports = class ExeMethods {

    /**
     * @param {} -- default (current, scope_state); whenever not used comments that mean method get defaults;
     */

    /**
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc nothing funcy simple write variable with ready value from compiler;
     */
    write_variable_value (current, scope_state)
    {
        WriteMemoryState(scope_state, this.state, current.name, current.value);
    }
    /**
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc nothing funcy simple write variable with by reading value from local or global state;
     */
    write_variable_variable (current, scope_state)
    {
        WriteMemoryState(
            scope_state, this.state, current.name, ReadMemoryState(scope_state, this.state, current.value).actual_value
        );
    }

    execute_return_variable (current, scope_state)
    {
        return ReadMemoryState(scope_state, this.state, current.value).actual_value;
    }


    write_variable_tstring (current, scope_state)
    {
        let current_value = current.value;
        ;[...current.value.matchAll("{{((.|\n|\r)*?)}}")].map(i => {
            let initial_string = i[0];
            let variable_string = i[0].substring(2, i[0].length - 2).trim();
            let actual_value = ReadMemoryState(scope_state, this.state, variable_string).actual_value;
            current_value = current_value.replace(initial_string, actual_value.toString());
        })
        WriteMemoryState(scope_state, this.state, current.name, current_value);
    }
   
    
}