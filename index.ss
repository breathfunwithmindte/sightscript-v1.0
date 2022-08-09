// this is a comment (also you can use # symbol)

  /**
   * this is multiline comments 
  */

  // strings
  my_string_varirable = "Hello, sightscript is amazing !";

  // numbers
  my_number_variable = 14; my_number_variable2 = 25;
  // ; symbol is required only when you run multiple variables in same like

  // boolean true | false
  my_boolean_variable = true;

  // null
  my_null = null;

  // objects
  my_obj_variable = { user: { username: "Mike", description: "I am using sightscript." } };

  // this is the same with the previous, if variable not exist, it will automatically create one.
  my_obj_variable.user.username = "Mike"
  my_obj_variable.user.description = "I am using sightscript."

  // arrays
  my_arr_variable = [1, 2, null, false, my_obj_variable, { other_variable: "Sightscript is so powerfull." } ]

  // update object property
  my_obj_variable.user.username = "Mike --updated"

  // read array element
  print(my_arr_variable[0]);

  // read array element #2
  print(my_arr_variable.4.other_variable);


  /**
   * list of string functions with their returns 
   * substring :str, 
   * trim :str, 
   * split :arr, 
   * lowercase :str, 
   * uppercase :str, 
   * startswith :bool, 
   * endswith :bool, 
   * match :string or null; -- also can be regex
  */
  some_string = "Hello world";
  
  print("substring ==> ", substring(some_string, 1, 3));
  print("trim ==> ", trim(some_string));
  print("split ==> ", split(some_string, 1, 3));
  print("lowercase ==> ", lowercase(some_string));
  print("uppercase ==> ", uppercase(some_string));
  print("startswith ==> ", startswith(some_string, "Hello"));
  print("endswith ==> ", endswith(some_string, "world"));
  print("match ==> ", match(some_string, "llo"));

  /**
   * @doc list of array functions with their returns 
   * @doc push :str, 
   * @doc map :str, 
   * @doc filter :arr, 
   * @doc find :str, 
  */

  /**
   *@doc  here some simple example of use the array and array s functions;
  */ 
  my_array = [];

  push(my_array, { title: "Sightscript is awesome.", id: 1 })
  push(my_array, { title: "Sightscript is amazing.", id: 2 })
  push(my_array, { title: "Sightscript is fun to work with.", id: 3 })

  print(my_array);

  newarr = map(my_array, (element, index) => { return element.title });

  element_id_1 = find(my_array, (element, index) => {
    if(element.id == 1) {
      return true;
    }
  })

  function my_filter_function (e, i) {
    if(e.id == 3) {
      return false;
    }
    return true;
  }

  array_without_id_3 = filter(my_array, my_filter_function)

  print(element_id_1, array_without_id_3, newarr);

  /**
   * functions
  */

  function multiply (a, b) {
    c = a*b;
    return c;
  }

  print(multiply(2, 3))
  print(multiply(4, 5))

  function other_function () {

    function other_function_inside () {

    }

    /**
     * @doc other_function_inside is available only here in this current scope;
     * @doc  $global variables are available here
     * @doc generally functions are creating there own scope.
    */

  }

  // simple if statement

  if(1 == 1) {
    return "Awesome 1 equeal 1";
  }