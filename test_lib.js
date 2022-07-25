const { SightScript } = require("./lib");
global["log"] = console.log

const sightscript = new SightScript(`
  /** user = 5;
  // print("hello world", [12, 14, { asdasd: 1312312}], user); */
  function somefunc (a, b) {
    b(1, 2)
  }
  somefunc(5, (aa, bb) => { print(aa, bb) })

  find([1, 2], (a, b) => {

  })
`);

;(async () => {
  try {
    
  } catch (e) {
    console.log(e)
  }
})()


// var = 1;
//   var1 = "Hello, World!"
//   var2 = 'Hello, World'
//   var3 = var2

//   var4 = [1, 2, "something", var2]

//   print('hello world')

//   find(arr, (a, b, c) => {
    
//   })

//   var5 = {
//     username: "Hello world"
//     password: 1234,
//     something: var4,
//     profile: {
//       description: "some string"
//     }
//   }

//   if (
//     1 == 1203 + "dq2312" + (asidjasidj + 123123 + "ASdasd" - (Asdasdsa adsdas)) -    xcvcxwqwe /123*12938123
//     (2 + var5 - 10 * (5 + 10/20 + "hello world")) || 'asdok' == (dasdko + 1) 
    
//     ) {
//     something = 10;
    
//   }

//   for (i, 0, 50000, 1) {

//   }

//   function sometname (a, b) {
//     vaa = 5;
//   }