module.exports = class FunctionExe {

    funcname;
    funcprops = "*";
    funccodeblock = new Array();
    funcexe;

    /**
     * @param {string} funcname 
     * @param {Function} funcexe 
     */
    constructor (funcname, funcexe) {
        this.funcname = funcname;
        this.funcexe = funcexe || function (...args) {
            console.log(`FUNCTION EXE HAS NOT RECIEVED A FUNCTIONEXE PROPERTY. CRITICAL ERROR; ${this.funcname}`)
        };
    }

    modify_func (funcprops, funccodeblock)
    {
        this.funcprops = funcprops;
        this.funccodeblock = funccodeblock;
    }
    
}