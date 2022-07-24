const Writter = require("./Writter");

describe('writter - test', () => {
  
  test("primary function", () => {
    const state = new Object();
    const sp_state = new Object();

    const result = Writter(sp_state, state, "variable", 5);
    expect(sp_state.variable).toBe(5);
    expect(result).toBe(sp_state);

    const result1 = Writter(sp_state, state, "variable", { something: state });
    expect(sp_state.variable.something).toBe(state);
    expect(result1).toBe(sp_state)

    const result2 = Writter(sp_state, state, "$variable", 10);
    expect(state.variable).toBe(10);
    expect(result2).toBe(state);
    
  })

  test("primary function with dot walking", () => {
    const state = new Object();
    const sp_state = new Object();
    sp_state["variable"] = { shouldnotchange: 10 }
    const result = Writter(sp_state, state, "variable.something", 5);
    expect(result.variable.something).toBe(5);
    expect(result.variable.shouldnotchange).toBe(10);
    expect(result).toBe(sp_state);
    
  })


});
