const SightScript = require("./SightScript");
const Func = require("../types/Func");

global["log"] = require("../utils/log").log;

exports["SightScript"] = SightScript;
exports["Func"] = Func;