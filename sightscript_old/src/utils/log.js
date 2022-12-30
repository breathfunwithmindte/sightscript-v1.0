exports["log"] = console.log;

global["clog"] = function (color, string) {
  console.log(`\x1b[${color}m`, string ,'\x1b[0m');
}
global["cslog"] = function (color, string, space) {
  let space_string = "  ";
  for (let i = 0; i < space || 0; i++) { space_string = space_string + "\t" }
  console.log(`${space_string}\x1b[${color}m`, string ,'\x1b[0m');
}

global["clogs"] = function (color1, color2, string1, string2) {
  console.log(`\x1b[${color1}m` + string1 +'\x1b[0m' + ` \x1b[${color2}m` + string2 +'\x1b[0m');
}

global["cslogs"] = function (color1, color2, string1, string2, space) {
  let space_string = "  ";
  for (let i = 0; i < space || 0; i++) { space_string = space_string + "\t" }
  console.log(`${space_string}\x1b[${color1}m` + string1 +'\x1b[0m' + ` \x1b[${color2}m` + string2 +'\x1b[0m');
}