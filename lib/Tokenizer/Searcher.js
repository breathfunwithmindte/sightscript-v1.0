const Token = require("../types/Token");
const makeid = require("../utils/makeid");

module.exports = class Searcher {
  /**
   * @doc
   * starting for example with simbol { and finishing with symbol }
   * then will read until the end of the synbol
   * if between there is other { symbol , then it will add +1
   * and finish on the 2nd time it find };
   */
  static startEnd(startS, endS, text) {
    text = text.trim();
    const found_items = new Array();
    // ! how many times need to find the end symbol;
    let required_times = 1;
    let current_string = "";
    let running_item = false;
    let index = 0;
    while (index < text.length) {
      if (running_item) {
        if (required_times === 1 && text[index] === endS) {
          found_items.push(current_string);
          current_string = "";
          running_item = false;
        } else if (required_times > 1 && text[index] === endS) {
          current_string = current_string + text[index];
          required_times--;
        } else if (text[index] === startS) {
          current_string = current_string + text[index];
          required_times++;
        } else {
          current_string = current_string + text[index];
        }
      } else {
        // ! ean o twrinos xaraktiras einai idios me to arxiko symbolo kai dn exoume
        // ! running item, settaroume running item true;
        if (text[index] === startS) {
          running_item = true;
        }
      }
      index++;
    }
    return found_items;
  }

  /**
   * @doc
   * starting for example with simbol { and finishing with symbol }
   * then will read until the end of the synbol
   * if between there is other { symbol , then it will add +1
   * and finish on the 2nd time it find };
   */
  static startEndMultyCharacters(startS, endS, text) {
    text = text.trim();
    const found_items = new Array();
    // ! how many times need to find the end symbol;
    let required_times = 1;
    let current_string = "";
    let running_item = false;
    let index = 0;
    while (index < text.length) {
      if (running_item) {
        if (required_times === 1 && current_string.endsWith(endS)) {
          found_items.push(current_string);
          current_string = "";
          running_item = false;
        } else if (required_times > 1 && current_string.endsWith(endS)) {
          current_string = current_string + text[index];
          required_times--;
        } else if (
          current_string.endsWith(startS) &&
          current_string !== startS
        ) {
          current_string = current_string + text[index];
          required_times++;
        } else {
          current_string = current_string + text[index];
        }
      } else {
        current_string = current_string + text[index];
        // ! ean to twrino string teleiwnei me tous start_charactires
        // ! running item, settaroume running item true;
        if (current_string.endsWith(startS)) {
          current_string = startS;
          running_item = true;
        }
      }
      index++;
    }
    if (
      current_string.length > 1 &&
      running_item == true &&
      required_times === 1
    ) {
      found_items.push(current_string);
    }
    return found_items;
  }

  static startEndRegex(startS, endS, text) {
    text = text.trim();
    const found_items = new Array();
    // ! how many times need to find the end symbol;
    let required_times = 1;
    let current_string = "";
    let running_item = false;
    let index = 0;
    while (index < text.length) {
      if (running_item) {
        if (required_times === 1 && current_string.endsWith(endS)) {
          found_items.push(current_string);
          current_string = "";
          running_item = false;
        } else if (required_times > 1 && current_string.endsWith(endS)) {
          current_string = current_string + text[index];
          required_times--;
        } else if (
          current_string.endsWith(startS) &&
          current_string !== startS
        ) {
          current_string = current_string + text[index];
          required_times++;
        } else {
          current_string = current_string + text[index];
        }
      } else {
        current_string = current_string + text[index];
        // ! ean to twrino string teleiwnei me tous start_charactires
        // ! running item, settaroume running item true;
        const { matching, final } = match_end(current_string, startS);
        if (matching) {
          current_string = final;
          running_item = true;
        }
      }
      index++;
    }
    if (
      current_string.length > 1 &&
      running_item == true &&
      required_times === 1
    ) {
      found_items.push(current_string);
    }
    return found_items;
  }

  static simpleRegexReplace (script, regex, options)
  {
    let initial_local_script = script;
    let tokens = new Map();
    let i = 0;
    while(i < 1000) {
      let r = initial_local_script.match(regex);
      let regex_found = r ? r[0] : null;
      if(regex_found === null) { break; }
      let id = (options.idName || "") + makeid(23);
      if(options.store !== false) {
        tokens.set(id, new Token("string", regex_found));
      }
      if(options.log) {
        console.log(id, regex_found)
      }
      initial_local_script = initial_local_script.replace( regex_found, (options.replaceWith || id) )
      i++;
    }
    return { codeblock: initial_local_script, tokens: tokens };
  }

};
