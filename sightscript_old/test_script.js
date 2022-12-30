const { sightScript, SightScript, Func } = require("./src/core")



const runtime_imports = new Map();
runtime_imports.set("testone", `
  print("some code from run time testone");
  user.username = "Mike";
  $lala = 5;
  $export = user
`)


;(async () => {

  const s = new SightScript({
    script: require("fs").readFileSync(require("path").resolve() + "/index.ss").toString(),
    runtime_imports: runtime_imports, 
    log_executables: true
  })
  console.log(s.tokens)
  //const result = await s.execute();

  //console.log(result, s.state);

}) ()