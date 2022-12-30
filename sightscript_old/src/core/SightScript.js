const Tokenizer = require("../tokenizer/Tokenizer");
const Parser = require("../parser/Parser");
const Compiler = require("../compiler/Compiler");
const Parsed = require("../types/Parsed");
const Executor = require("./Executor");
const functions = require("../functions");
const Func = require("../types/Func");

module.exports = class SightScript extends Executor {
  constructor(props)
  {
    super(props.script);
    //return;
    /**
     * @type {Map<string, object>}
     */
    this.functions = functions;
    this.runtime_imports = props.runtime_imports;
    this.sightscript = SightScript;
    /**
     * @type {object}
     * @doc primary state of script proccess. It is the global scope;
     */
    //return;
    this.state = new Object();
    // console.log(this.tokens);
    // console.log(this.script);

    this.critical_errors = new Array();
    this.warning_errors = new Array();

    /**
     * @type  {object}
     * @doc using to store private properties of classes
     * combine state variable - private state using name + id;
     */
    this.private_state = new Object();

    /**
     * @type {list<Parsed>}
     * @doc theses objects compiler can read.
     */
    this.objects = Parser.parse(this.script, this.tokens, { critical: this.critical_errors });
    // console.table(this.objects)
    
    this.compiler = new Compiler();

    this.executables = this.compiler.main_compile(this.objects, this.tokens, { critical: this.critical_errors })
    if(props.log_executables) {
      console.table(this.executables);
    }
    //console.table(this.executables)

    /**
     * @type {list<string>}
     * runtime errors like variable not found, method not envoiked, function not exist;
     */
    this.runtime_errors = new Array();
    this.operatos_expressions = ["+", "-", "*", "/", "&&", "||", ">", "<", "<=", ">=", "==", "===", "!=", "!=="]
    // console.log(this);
    //delete this.tokens;
    // runtime, system, dynamic
  }

  async execute ()
  {
    if(this.critical_errors.length > 0) {
      console.table(this.critical_errors);
      return clog(31, "There are some critical errors, code could not be executed.")
    }
    const gresult = await this.primary_execute(this.executables, {});
    if(gresult === undefined) return undefined;
    return JSON.parse(JSON.stringify(gresult))
  }


  function_builder (func_name, func_exe) {
    if(typeof func_name !== "string") throw new Error("func_name should be a string");
    if(typeof func_exe !== "function") throw new Error("func_exe should be a function");
    const func = new Func({ 
      func_name: func_name, 
      prop_type: "values",
      func_exe: async function (current, sp_state) {
        const { self, func } = this;
        const props = self.compiler.getProps(func.prop_type, current.props, sp_state, self.state);
        const r = await func_exe(props);
        return r;
      },
      config: {}
    })
    this.functions.set(func_name, func);

  }

  inset_function_advanced (func_name, func_instance) 
  {
    this.functions.set(func_name, func_instance);
  }


}