var AutoComplete = require('./AutoComplete')
var $ = require('jquery')

$(document).ready(function(e) {
	var ac = new AutoComplete($('#ipt'), {
		url: '/search',
		onselect: function(item) {
			console.log(item)
		}
	})
})