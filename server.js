var path = require('path')
var webpack = require('webpack')
var express = require('express')
var config = require('./webpack.config')
var app = express()
var compiler = webpack(config)

app.use(express.static('dist'))

app.use(require('webpack-dev-middleware')(compiler, {
  publicPath: config.output.publicPath
}))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.get('/search', function(req, res) {
	var a = [
		'万科A',
		'尤夫股份',
		'东湖高新'
	]

	var b = [
		'bbb',
		'ccc',
		'ddd',
		'eee'
	]

	res.send(Date.now() % 3 > 0 ? a : b)
})

app.listen(3000, function(err) {
  if (err) {
    return console.error(err)
  }

  console.log('Listening at http://localhost:3000/')
})