module.exports = class Token {
  /**
   * @type {String} type Enum(string | codeblock | parenthesis);
   */
  type;

  /**
   * @type {String} codeblock
   */
  codeblock;

  /**
   * @param {string} type Enum(string | function | class); 
   * @param {string} codeblock 
   */
  constructor(type, codeblock) {
    this.type = type;
    this.codeblock = codeblock;
  }


};
