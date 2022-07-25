module.exports = class FunctionExe {

    funcname;
    funcprops;
    funcexe;

    async execute (executor, scope_state, current)
    {
        let result;
        try {
            await this.funcexe(current, scope_state, executor);
        } catch (e) {
            throw new Error("Some execute func error") // !todo this error handle
        }
    }
    
}