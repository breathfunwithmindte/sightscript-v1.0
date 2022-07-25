module.exports = class FunctionExe {

    funcname;
    funcprops;
    funcexe;

    /**
     function (current, scope_state, executor) {
        1. build the props;
        2. 
        executor.execute()
     }
     */

    constructor (funcname, funcprops, funcexe) {
        this.funcname = funcname;
        this.funcprops = funcprops || "*";
        this.funcexe = funcexe;
    }
    
}