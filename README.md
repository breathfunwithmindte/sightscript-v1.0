# Sightscript-dev
sightscript, secure, fast programming language running on top of javascript;
0 dependecies

sightscript.ss -> compliler -> exe.json -> Executor_v14 -> result;

Initial it was created as an alternative of eval() javascript function. 
System admins can write sightscript to execute different commands on the server in safe way, where the system controls
which functions are allowed to be used from current admin.

For example

Admin with role 'database-manager'
  is allowed to use functions to read/write/update/delete database documents;
Admin with role 'file-system-manager'
  is allowed to read/write files
Admin with role 'file-system-manager' and permission read
  is allowed to read only files but not write
and so on ...


# GET STARTED

  1) install sightscript using npm install
  2) create a javascript and sightscript file like this

Javascript file
``` javascript
const { SightScript, FunctionExe } = require("./lib");

const sightscript = new SightScript(
  require("fs").readFileSync(require("path").resolve() + "/index.ss", "utf-8"),
);

;(async () => {
  try {
    console.log(await sightscript.execute())
  } catch (e) {
    console.log(e)
  }
})()

```

index.ss (sightscript file)
``` javascript
  variable = "Hello, world !"
  second_variable = 1;
  print(variable);

  if(second_variable == 1) {
    return second_variable;
  }
  return "Second variable is not 1";
```

# How it is works

  It works similary as works c/cpp or any other executable language.

  We load the text from the index.ss file for exmaple.

  Then this text passed to the compliler that will generate a list of executables (.json);

  After that this executables are readable from the main executor (Executor_v14);

  Sightscript since complied, is running with the same speed of javascript.

  For performance we dont need to compile each time the .ss file. We can compile it once, and run multiple times.

  We also can transfer the executables, as there are just a json file. 

  For more information about this, we are working to create more clear documetations

# Written

  Written in a simple javascript without unreadable typescript, without tons of packages/lexers etc. 
  0 dependecies clean javascript code. Very lightweight.
  
# Dive in
 1. comments
 2. variables
 3. nested variables
 4. string functions
 5. array functions
 6. system functions
 7. functions
 8. if statement

# Variable


index.ss (sightscript file)
``` javascript
  
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
    return "Awesome 1 equeal 1, sightscript is amazing.";
  }
  


```

- more documetations are comming soon
- creator Mike Karypidis
- licenses Apache-2.0
- github https://github.com/breathfunwithmindte/sightscript-v1.0
