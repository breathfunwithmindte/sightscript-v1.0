const { SightScript, FunctionExe } = require("./lib");

global["log"] = console.log

const sightscript = new SightScript(
  require("fs").readFileSync(require("path").resolve() + "/index.ss", "utf-8"),
  require("path").resolve() + "/test_logs/exe.json",
  require("path").resolve() + "/test_logs/tokenized_string_v2"
);

//sightscript._log_state = true

// sightscript.use("some group name", [])
//sightscript.use([{ groupname: "ASdsad", groupfuncs: [] }])

;(async () => {
  try {
    console.log(await sightscript.execute())
  } catch (e) {
    console.log(e)
  }
})()
