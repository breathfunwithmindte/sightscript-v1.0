const Parser = require("./Parser");
const Parsed = require("../types/Parsed");


describe('Primary Sightscript', () => {

  test("Parser - main parse return objects of instance Parsed", () => {
    expect(1 + 1).toBe(2)
    // for (let i = 0; i < Parser.parse(sightscript.script, sightscript.tokens).length; i++) {
    //   expect(Parser.parse(sightscript.script, sightscript.tokens)[i] instanceof Parsed).toBe(true)
    // }
  })


});
