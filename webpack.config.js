const path = require('path')

module.exports = {
  mode: 'none',
  entry: './src',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build')
  }
}
