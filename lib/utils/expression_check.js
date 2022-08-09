const Expressions = require("../types/Expression");

module.exports = (value) => {
  let check = false;
  for (let i = 0; i < Expressions.length; i++) {
    if(value.split(Expressions[i]).length > 1 && value.split("=>").length === 1) {
      check = true;
      break;
    }
  }
  return check;
}