const ExeMethodsFunc = require("./ExeMethodFunc");
const Executable = require("../types/Executable");
const ExecutableTypes = require("../types/ExecutableTypes");
const FunctionExe = require("./types/FunctionExe");
const DefaultFunctionConfig = require("./default_functions/index.json");

module.exports = class Executor extends ExeMethodsFunc {
    
    /**
     * @type {any} - primary global state of the proccess runtime;
     */
    state = new Object();

    /**
     * @type {boolean} - log the scope of the function
     */
    log_func_scope = false;

    constructor () {
        super();
        DefaultFunctionConfig.map(default_function => {this.state[default_function.funcname] = require(default_function.funcsource) });
        //console.log(this.state);
    }
    
    /**
     * @param {Executable[]} executables 
     */
    async execute (executables, scope_state_prop, log)
    {
        let scope_state = scope_state_prop ? scope_state_prop : new Object();

        for (let index = 0; index < executables.length; index++) {
            
            if(executables[index].type === ExecutableTypes.VARIABLE_VALUE) {
                this.write_variable_value(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.ANONYMOUS_VALUE) {
                this.write_variable_value(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.VARIABLE_EXPRESSION) {
                this.write_variable_expression(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.VARIABLE_VARIABLE) {
                this.write_variable_variable(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.ANONYMOUS_VARIABLE) {
                this.write_variable_variable(executables[index], scope_state);
            }     
            if(executables[index].type === ExecutableTypes.VARIABLE_TSTRING) {
                this.write_variable_tstring(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.ANONYMOUS_TSTRING) {
                this.write_variable_tstring(executables[index], scope_state);
            }

            /** @sector OBJECTS - ARRAYS */   
            if(executables[index].type === ExecutableTypes.VARIABLE_OBJECT) {
                await this.write_variable_object(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.ANONYMOUS_OBJECT) {
                await this.write_variable_object(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.VARIABLE_ARRAY) {
                await this.write_variable_array(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.ANONYMOUS_ARRAY) {
                await this.write_variable_array(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.VARIABLE_VARIABLE_ARRAY_ELEMENT) {
                await this.write_variable_array_element(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.ANONYMOUS_VARIABLE_ARRAY_ELEMENT) {
                await this.write_variable_array_element(executables[index], scope_state);
            }

            /** @sector FUNCTIONS */

            if(executables[index].type === ExecutableTypes.FUNCTION_DECLARATION) {
                await this.execute_func_declaration(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.ANONYMOUS_CALLBACK) {
                await this.execute_func_declaration(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.FUNCTION_EXE) {
                await this.execute_func_exe(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.ANONYMOUS_FUNCTION_EXE) {
                await this.execute_variable_func_exe(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.VARIABLE_FUNCTION_EXE) {
                await this.execute_variable_func_exe(executables[index], scope_state);
            }

            /** @sector RETURNS */
            if(executables[index].type === ExecutableTypes.RETURN_VALUE) {
                this.log_execution_scope_state(log, scope_state); // without this line it would not reach the end current method to log smth;
                return executables[index].value;
            }
            if(executables[index].type === ExecutableTypes.RETURN_VARIABLE) {
                this.log_execution_scope_state(log, scope_state); // without this line it would not reach the end current method to log smth;
                return this.execute_return_variable(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.RETURN_ARRAY) {
                this.log_execution_scope_state(log, scope_state); // without this line it would not reach the end current method to log smth;
                return await this.return_variable_array(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.RETURN_OBJECT) {
                this.log_execution_scope_state(log, scope_state); // without this line it would not reach the end current method to log smth;
                return await this.return_variable_object(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.RETURN_ARRAY_ELEMENT) {
                this.log_execution_scope_state(log, scope_state); // without this line it would not reach the end current method to log smth;
                return this.return_variable_array_element(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.RETURN_FUNCTIONEXE) {
                this.log_execution_scope_state(log, scope_state);
                return await this.return_variable_funcexe(executables[index], scope_state);
            }

            /** @sector STATEMENTS */

            if(executables[index].type === ExecutableTypes.IF_STATEMENT) {
               const r = await this.execute_if_statement(executables[index], scope_state);
               if(r !== undefined && r !== null) return r;
            }
            
        }
        
        //console.log(executables[1])
        this.log_execution_scope_state(log, scope_state);

        return scope_state["export"] ? scope_state["export"] : null;
 
    }

    log_execution_scope_state(log, scope_state)
    {
        if(log) {
            console.log(`Logging ${log} => `,scope_state);
        }
    }

}