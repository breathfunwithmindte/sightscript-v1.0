s.function_builder("wowo", (props) => {
  console.log("WOWOWOOWOW", props)
})

s.inset_function_advanced("wowow", new Func({
  func_name: "wowow",
  prop_type: "values",
  func_exe: function (current, sp_state) {
    console.log(current, sp_state);
    sp_state.user.age = 15;
  }
}))