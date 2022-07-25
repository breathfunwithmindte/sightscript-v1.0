const WriteMemory = require("./primary_exe/WriteMemory");
const WriteMemoryState = require("./primary_exe/WriteMemoryState");
const ReadMemory = require("./primary_exe/ReadMemory");
const ReadMemoryState = require("./primary_exe/ReadMemoryState");
const Executable = require("../types/Executable");
const makeid = require("../utils/makeid");
const ExeMethods = require("./ExeMethods");

module.exports = class ExeMethodsFunc extends ExeMethods {

    /**
     * @param {} -- default (current, scope_state); whenever not used comments that mean method get defaults;
     */

    /**
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc nothing funcy simple write variable with ready value from compiler;
     */
    async execute_func_exe (current, scope_state)
    {
        const current_function = ReadMemoryState(scope_state, this.state, current.name);
        if(current_function.type === "function") {
            return await current_function.actual_value.funcexe(this, scope_state, current);
        } else {
            throw new Error(`${current.name} is not a function.`);
        }
    }
   


    /**
     * @param {Executable[]} array_executables
     * @param {any} scope_state
     */
    async get_anonumous_props (array_executables, scope_state)
    {
        const actual_arr = new Array();
        const tmp_arr = [...array_executables.map(i => {return {...i, name: makeid(25)}})];
        const tmp_obj = {...scope_state};
        await this.execute(tmp_arr, tmp_obj);
        tmp_arr.map(i => actual_arr.push(tmp_obj[i.name]));
        return actual_arr;
    }
    
}