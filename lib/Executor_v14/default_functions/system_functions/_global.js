const FunctionExe = require("../../types/FunctionExe");

module.exports = new FunctionExe("global", async function (executor, scope_state, current) {
  return executor.state;
});