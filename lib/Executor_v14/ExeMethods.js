const WriteMemory = require("./primary_exe/WriteMemory");
const WriteMemoryState = require("./primary_exe/WriteMemoryState");

module.exports = class ExeMethods {

    /**
     * @param {}
     */
    write_variable_value (current, scope_state)
    {
        WriteMemoryState(scope_state, this.state, current.name, current.value);
    }
    
}