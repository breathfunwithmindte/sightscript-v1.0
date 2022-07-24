const Parser = require("../Parser/Parser");
const Parsed = require("../types/Parsed");
const { SightScript } = require("../core");
const Func = require("./Func");

describe('Func Data Type Test', () => {

  test("fill gap", () => {
    expect(1 + 1).toBe(2);
  })
  const func = new Func();
  test("Func type is Private :: struct type props", () => {
    expect(func.isPrivate("private username string")).toEqual({ line: "username string", is_private: true });
    expect(func.isPrivate(" username string ")).toEqual({ line: "username string", is_private: false });
    expect(func.isPrivate("public username string")).toEqual({ line: "username string", is_private: false });
  })

  // todo tests for compiler getprops() and 2 functions in it... total 3 tests;

});
