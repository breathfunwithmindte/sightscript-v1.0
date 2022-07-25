const WriteMemory = require("./primary_exe/WriteMemory");
const WriteMemoryState = require("./primary_exe/WriteMemoryState");
const ReadMemory = require("./primary_exe/ReadMemory");
const ReadMemoryState = require("./primary_exe/ReadMemoryState");
const Executable = require("../types/Executable");
const makeid = require("../utils/makeid");

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
    /**
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc nothing funcy simple write variable with ready value from compiler;
     */
    async write_variable_object (current, scope_state)
    {
        let actual_obj = new Object();
        let newobj = {...scope_state};
        await this.execute(current.obj_value, newobj);
        // todo fix bug where scope property change is in object there is property with same name;
        current.obj_value.map(i => {actual_obj[i.name] = newobj[i.name];});
        WriteMemoryState(scope_state, this.state, current.name, actual_obj);
    }
    /**
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc nothing funcy simple write variable with ready value from compiler;
     */
    async write_variable_array (current, scope_state)
    {
        const variable_array = await this.#get_anonumous_variables(current.arr_value, scope_state); 
        WriteMemoryState(scope_state, this.state, current.name, variable_array);
    }



    /**
     * @param {Executable[]} array_executables
     * @param {any} scope_state
     */
    async #get_anonumous_variables (array_executables, scope_state)
    {
        const actual_arr = new Array();
        const tmp_arr = [...array_executables.map(i => {return {...i, name: makeid(25)}})];
        const tmp_obj = {...scope_state};
        await this.execute(tmp_arr, tmp_obj);
        tmp_arr.map(i => actual_arr.push(tmp_obj[i.name]));
        return actual_arr;
    }
    
}