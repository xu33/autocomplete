const $ = require('jquery')
const ejs = require('ejs')
const DEFULAT_TEMPLATE = `<ul>
	<% for (var i = 0; i < items.length; i++) { %>
		<li data-index="<%=i%>" class="<%=index == i ? 'active' : ''%>"><%=items[i]%></li>
	<%}%>
</ul>`

const AutoComplete = function(el, options) {
	if (!options.template) {
		options.template = DEFULAT_TEMPLATE
	}

	this.index = -1
	this.el = el
	this.options = $.extend({}, options)

	this._handleDocumentKeyup = this.handleDocumentKeyup.bind(this)
	this._clear = this.clear.bind(this) 
	this.init()
}

AutoComplete.prototype = {
	init: function() {
		this.el.on('input', (e) => {
			var value = e.target.value

			if (value === '') {
				this.clear()
				return
			}

			$.ajax({
				url: this.options.url + value,
        cache: false
			}).done(response => {
				this.showResult(response)
			})
		})
	},
	clear: function() {
		if (this.resultWrap) {
			this.resultWrap.hide().html('').off('mouseover').remove()
			this.resultWrap = null
		}
		
		$(document).unbind('keyup', this._handleDocumentKeyup)
		$(document).unbind('click', this._clear)
	},
	showResult: function(items) {
		this.index = -1	
		this.items = items

		if (!this.resultWrap) {
			console.log('enter here')

			var offset = this.el.offset()
			var wrap = $('<div>').css({
				position:'absolute',
				left: offset.left - 1, // 减去border宽度
				top: offset.top + this.el.outerHeight(),
				display: 'none'
			})

      if (this.options.wrapClass) {
        wrap.addClass(this.options.wrapClass)
      }

			$(document.body).append(wrap)

			this.resultWrap = wrap


			this.resultWrap.on('mouseenter', 'li', (e) => {
				var index = $(e.currentTarget).data('index')
				if (index !== this.index) {
					this.index = index
					this.updateHtml()
				}
			}).on('click', 'li', (e) => {
				this.index = $(e.currentTarget).data('index')
				this.options.onselect(this.items[this.index])
			})

			$(document).bind('keyup', this._handleDocumentKeyup)
			$(document).bind('click', this._clear)
		}

		this.updateHtml()
		this.resultWrap.css('display', '')
	},
	updateHtml: function() {
		this.resultWrap.html(
			ejs.render(this.options.template, {
				items: this.items,
				index: this.index
			}, {
        delimiter: this.options.ejs.delimiter || '%'
      })
		)
	},
	handleDocumentKeyup: function(e) {
		switch (e.keyCode) {
			case 40: // down
				this.index++
				if (this.index >= this.items.length) {
					this.index = 0
				} else if (this.index < 0) {
					this.index = this.items.length - 1
				}


				this.updateHtml()
				break
			case 38: // up
				this.index--
				if (this.index >= this.items.length) {
					this.index = 0
				} else if (this.index < 0) {
					this.index = this.items.length - 1
				}
				this.updateHtml()
				break
			case 13:
				if (this.index > -1 && this.index < this.items.length) {
					this.options.onselect(this.items[this.index])
				}
		}
	}
}

module.exports = AutoComplete