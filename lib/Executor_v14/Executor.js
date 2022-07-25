const ExeMethods = require("./ExeMethods");
const Executable = require("../types/Executable");
const ExecutableTypes = require("../types/ExecutableTypes");

module.exports = class Executor extends ExeMethods {
    
    /**
     * @type {any} - primary global state of the proccess runtime;
     */
    state = new Object();
    
    /**
     * @param {Executable[]} executables 
     */
    async execute (executables, scope_state_prop)
    {
        let scope_state = scope_state_prop ? scope_state_prop : new Object();

        // const FunctionExe = require("./types/FunctionExe");
        // scope_state.asd =  new FunctionExe();
        // scope_state.user = "mike";
        // const writter = require("./primary_exe/WriteMemoryState");
        // const reader = require("./primary_exe/ReadMemory");
        // const reader2 = require("./primary_exe/ReadMemoryState");
        // writter(scope_state, {}, "something.asdasd.asdasd", true)
        // console.log("1-->", reader(scope_state, "user"))
        // console.log("2-->", reader2(scope_state, {user: {name: "some name"}}, "$user"))
        // console.log("scope_state", scope_state);

        for (let index = 0; index < executables.length; index++) {
            
            if(executables[index].type === ExecutableTypes.VARIABLE_VALUE) {
                // console.log(executables[index], "simple variable") // ? debug
                this.write_variable_value(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.ANONYMOUS_VALUE) {
                // console.log(executables[index], "simple variable") // ? debug
                this.write_variable_value(executables[index], scope_state);
            }

            if(executables[index].type === ExecutableTypes.VARIABLE_VARIABLE) {
                // console.log(executables[index], "variable variable") // ? debug
                this.write_variable_variable(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.ANONYMOUS_VARIABLE) {
                // console.log(executables[index], "variable variable") // ? debug
                this.write_variable_variable(executables[index], scope_state);
            }
            
            if(executables[index].type === ExecutableTypes.VARIABLE_OBJECT) {
                // console.log(executables[index], "variable variable") // ? debug
                this.write_variable_object(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.ANONYMOUS_OBJECT) {
                // console.log(executables[index], "variable variable") // ? debug
                this.write_variable_object(executables[index], scope_state);
            }

            if(executables[index].type === ExecutableTypes.VARIABLE_ARRAY) {
                // console.log(executables[index], "variable variable") // ? debug
                this.write_variable_array(executables[index], scope_state);
            }
            if(executables[index].type === ExecutableTypes.ANONYMOUS_ARRAY) {
                // console.log(executables[index], "variable variable") // ? debug
                this.write_variable_array(executables[index], scope_state);
            }
            
        }

        //console.log(executables[1])
        if(scope_state_prop === undefined) {
            console.log("final => ",scope_state);
        }
 
    }

}