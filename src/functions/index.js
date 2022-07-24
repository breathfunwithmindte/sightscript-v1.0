const print = require("./print");
const struct = require("./struct");
const newarray = require("./newarray");

const { push , find, filter, map, remove, clean } = require("./array_functions")
const { split, substring, charget, slice, trim, lowercase, uppercase, starts_with, ends_with } = require("./string_functions");
const { func_import, func_use, func_require } = require("./imports");
/**
 * @type {Map <string, object>}
 */
const functions = new Map();

functions.set("print", print);
functions.set("struct", struct);
functions.set("newarray", newarray);

functions.set("push", push);
functions.set("find", find);
functions.set("filter", filter);
functions.set("map", map);
functions.set("clean", clean);
functions.set("remove", remove);

functions.set("split", split);
functions.set("trim", trim);
functions.set("slice", slice);
functions.set("charget", charget);
functions.set("substring", substring);
functions.set("uppercase", uppercase);
functions.set("lowercase", lowercase);
functions.set("starts_with", starts_with);
functions.set("ends_with", ends_with);


functions.set("import", func_import);
functions.set("use", func_use);
functions.set("require", func_require);

module.exports = functions;