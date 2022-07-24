module.exports = class Searcher {
  tokens = new Map();


  tokenize ()
  {
    const local_tokens = [...this.tokens];

    local_tokens.map(i => {
      this.tokenize_in(i);
    })


  }

  /**
   * 
   * var something = 5;
   * 
   */

  tokenize_in (token, insert_current)
  {
    const { new_string_updated, tokens } = somesearchingfunc(token.value);

    if(tokens.length > 0) {
      this.tokenize_in(i, true)
    }

    if(insert_current) {
      this.tokens.set(token);
    }

  }

}