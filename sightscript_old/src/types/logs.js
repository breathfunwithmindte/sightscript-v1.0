module.exports = {
  logc: function (color, message) {
    console.log(`\x1b[${color}m`, message ,'\x1b[0m');
  }
}