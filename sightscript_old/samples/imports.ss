// ? import ("UserModel");                # this run during run time and get the exported value from global state of imported file;
// ? use ("UserModel");                   # this run during run time and get everything from global state of used file;
// ? require ("UserModel::UserStruct")    # this run during run time and get specific property of required file global state;
// ? ~include ("UserModel")               # pre compiled method, copy paste the code from that file into the main file;

// * any method starts with ~ means that will run before the complile proccess.


use("testone");

~include("testone");

$user = import("testone");

$other_user = require("testone::lala");
