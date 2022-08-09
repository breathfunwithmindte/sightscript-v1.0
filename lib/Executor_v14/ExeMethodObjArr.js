const WriteMemory = require("./primary_exe/WriteMemory");
const WriteMemoryState = require("./primary_exe/WriteMemoryState");
const ReadMemory = require("./primary_exe/ReadMemory");
const ReadMemoryState = require("./primary_exe/ReadMemoryState");
const Executable = require("../types/Executable");
const makeid = require("../utils/makeid");
const Logs = require("../utils/Logs");
const ExeMethods = require("./ExeMethods");

module.exports = class ExeMethodObjArr extends ExeMethods {

    /**
     * @param {} -- default (current, scope_state); whenever not used comments that mean method get defaults;
     */

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
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc nothing funcy read the variable by name from memory, and returns the element by index;
     */
    write_variable_array_element (current, scope_state)
    {
      const current_array = ReadMemoryState(scope_state, this.state, current.value);
      if(current_array.type !== "variable") return;
      WriteMemoryState(
        scope_state, this.state, current.name, current_array.actual_value ? current_array.actual_value[current.element_index] : null
        );
    }

    /**
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc nothing funcy read the variable by name from memory, and returns the element by index;
     */
    return_variable_array_element (current, scope_state)
    {
      const current_array = ReadMemoryState(scope_state, this.state, current.value);
      if(current_array.type !== "variable") return null;
      return current_array.actual_value ? current_array.actual_value[current.element_index] : null
    }

    /**
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc nothing funcy read the variable by name from memory, and returns the element by index;
     */
     async return_variable_array (current, scope_state)
     {
        return await this.#get_anonumous_variables(current.arr_value, scope_state); 
     }

    /**
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc nothing funcy simple write variable with ready value from compiler;
     */
    async return_variable_object (current, scope_state)
    {
        let actual_obj = new Object();
        let newobj = {...scope_state};
        await this.execute(current.obj_value, newobj);
        // todo fix bug where scope property change is in object there is property with same name;
        current.obj_value.map(i => {actual_obj[i.name] = newobj[i.name];});
        return actual_obj;
    }  



    /**
     * @param {Executable} current 
     * @param {*} scope_state 
     * @doc nothing funcy simple write variable with ready value from compiler;
     */
    async write_variable_expression (current, scope_state)
    {
        WriteMemoryState(scope_state, this.state, current.name, this.execute_expression(current.expressions, scope_state));
    }

    /**
     * @typedef {Object} Expression
     * @property {string} expression_token ->  + | - | == | etc
     * @property {string} type -> number | string | variable | etc
     * @property {*} expression_line
     * @property {Expression[]} child
     * @param {Expression[]} expressions 
     */
    execute_expression (expressions, scope_state)
    {
        try {
            const result_string_expression = this.convert_expressions(expressions, scope_state);
            // todo fix the bug when a scope_state variable is number but it comparing it as a string ... so age === 10 will be false for example;
            // Logs.logc(35, result_string_expression)
            const result_expression = eval(result_string_expression);
            return result_expression;
        }catch (e) { throw e }
    }

    /**
     * @param {Expression[]} expressions 
     */
    convert_expressions (expressions, scope_state)
    {
        let expression_js_string = "";
        expressions.map(e => {
            if(e.type === "arr" || e.type === "subexpression") {
                const str = this.convert_expressions(e.child, scope_state);
                expression_js_string = expression_js_string + `(${str})` + (e.expression_token === "none" ? "" : e.expression_token);
            } else {
                if(e.type === "variable") {
                    const actual_value = ReadMemoryState(scope_state, this.state, e.expression_line);
                    if(actual_value.type === "variable") {
                        expression_js_string = expression_js_string + `'${actual_value.actual_value}'` + (e.expression_token === "none" ? "" : e.expression_token);
                    }
                } else if(e.type === "string") {
                    expression_js_string = expression_js_string + `'${e.expression_line}'` + (e.expression_token === "none" ? "" : e.expression_token);
                } else {
                    expression_js_string = expression_js_string + e.expression_line + (e.expression_token === "none" ? "" : e.expression_token);
                }
            }
        })
        return expression_js_string;
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