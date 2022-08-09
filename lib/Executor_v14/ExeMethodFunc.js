const WriteMemory = require("./primary_exe/WriteMemory");
const WriteMemoryState = require("./primary_exe/WriteMemoryState");
const ReadMemory = require("./primary_exe/ReadMemory");
const ReadMemoryState = require("./primary_exe/ReadMemoryState");
const Executable = require("../types/Executable");
const makeid = require("../utils/makeid");
const FunctionExe = require("./types/FunctionExe");
const ExeMethodObjArr = require("./ExeMethodObjArr");

module.exports = class ExeMethodsFunc extends ExeMethodObjArr {

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
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc nothing funcy creating new FunctionExe -> modify it -> write to memory;
     */
    async execute_func_declaration (current, scope_state)
    {
       const newfuncexe = new FunctionExe(current.name, async function (executor, scope_state, current) {
            const local_function_scope_state = new Object();

            // get list of props including callback 
            // ! (executed as function declaration with random name)
            // matching the props of func with the props that recieved from get_anonumous_props;
            const list_prop_values = await executor.get_anonumous_props(current.prop, scope_state);

            this.funcprops.map((prop_name, index) => {
                local_function_scope_state[prop_name] = list_prop_values[index] !== undefined ? list_prop_values[index] : null;
            })
            // ! executing the function codeblock;
            const log_func_scope = executor.log_func_scope ? `-- IN FUNC -- ${current.name}` : undefined;
            const result_in  = await executor.execute(this.funccodeblock, local_function_scope_state, log_func_scope);
            return result_in;
       })
       newfuncexe.modify_func(current.funcprops, current.codeblock);
       WriteMemoryState(scope_state, this.state, current.name, newfuncexe);
    }

    /**
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc nothing funcy simple write variable with ready value from compiler;
     */
    async execute_if_statement (current, scope_state)
    {
        if(this.execute_expression(current.ifexpression, scope_state)) {
            return await this.execute(current.codeblock, scope_state);
        }
    }

    /**
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc return function exe;
     */
    async return_variable_funcexe (current, scope_state)
    {
        const r = await this.execute_func_exe(current.variable_func_exe, scope_state);
        return r;
    }

    /**
     * 
     * @param {Executable} current 
     * @param {*} scope_state 
     * @returns 
     */
     async execute_variable_func_exe (current, scope_state)
     {
        const r = await this.execute_func_exe(current.variable_func_exe, scope_state);
        WriteMemoryState(scope_state, this.state, current.name, r);
     }


    /**
     * @param {Executable[]} array_executables
     * @param {any} scope_state
     * @doc generating random names for each of executables
     *      executables are list of props that function recieved during exe 
     *      for example print(5, "a") -> current props are 5, and "a" as executables objects;
     *      
     *      create a new scope state object that is cloned of the current one;
     *      executes the props executables list, that will add to this new scope object the new variables
     *      after that for each of props, will get the value of new scope state and push it to the empty array
     *      at the end returning the array;
     */
    async get_anonumous_props (array_executables, scope_state)
    {
        const actual_arr = new Array(); // creating new array
        const tmp_arr = [...array_executables.map(i => {return {...i, name: makeid(25)}})]; // generating names for anonymous executables
        const tmp_obj = {...scope_state}; //clone scope state
        await this.execute(tmp_arr, tmp_obj); // exe the list of exe anonymous props that will set to cloned scope state new values
        tmp_arr.map(i => actual_arr.push(tmp_obj[i.name])); // push the new properties of scope state to the actual arr
        return actual_arr; // return this array
    }
    
}