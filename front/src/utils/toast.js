import { Loading } from 'honey-ui'
function replaceAll (target, search, replacement) {
  return target.replace(new RegExp(search, 'g'), replacement)
}
function escapeHtml (html) {
  if (!html) {
    return ''
  }
  let arr = [
    [ '<', '&amp;' ],
    [ '>', '&lt;' ],
    [ '&', '&gt;' ],
    ['"', '&quot;'],
    [ "'", '&#39;' ]
  ]

  let result = html
  arr.forEach(item => {
    result = replaceAll(result, item[0], item[1])
  })

  return result
}

export default {
  id: 'toast' + Date.now(),
  duration: 2000,
  animationTime: 200,

  _template: function (message, state) {
    return [
      `<div id=${this.id} style="${this._style(state)}">`,
      `<span style="color: inherit; font-size:inherit;height:20px;line-height:20px">`,
      escapeHtml(message),
      `</span>`,
      `</div>`
    ].join('')
  },

  _styleHelper: function (styleObject) {
    let style = Object.keys(styleObject).reduce((accumulator, key) => {
      return accumulator + key + ':' + styleObject[key] + ';'
    }, '')
    return style
  },

  _style: function (state) {
    let stateStyle = {
      'success': {
        background: '#e6f8ee',
        color: '#007e3b',
        'border-color': '#9ce4bc'
      },
      'warning': {
        background: '#fff4e3',
        color: '#c07400',
        'border-color': '#ffd18b'
      },
      'error': {
        background: '#fcecec',
        color: '#b43537',
        'border-color': '#f6b5b5'
      }
    }

    let commonStyle = {
      display: 'none',
      padding: '10px',
      width: '100%',
      position: 'absolute',
      top: '50px',
      left: '50%',
      transform: 'translate(-50%, -100%)',
      transition: `opacity ${this.animationTime}ms ease, transform ${this.animationTime}ms ease`,
      border: '1px solid #fff',
      'border-radius': '5xp',
      'text-align': 'center',
      'line-height': '12px',
      'min-height': '40px',
      'z-index': '99999999'
    }

    // inject common style
    console.log(this._styleHelper(commonStyle))
    return this._styleHelper(commonStyle) + this._styleHelper(stateStyle[state])
  },

  _show: function (message, state) {
    console.log('_show')
    // 先删除之前的toast dom
    let preToastElement = document.getElementById(this.id)
    if (preToastElement) {
      preToastElement.parentNode.remove()
    }
    let fragment = document.createDocumentFragment()
    let div = document.createElement('div')
    div.innerHTML = this._template(message, state)
    fragment.appendChild(div)
    document.body.appendChild(fragment)

    let element = document.getElementById(this.id)
    element.style.transform = 'translate(-50%, 0)'
    element.style.display = 'block'
    setTimeout(() => {
      if (element) {
        element.style.transition = `opacity ${this.animationTime}ms ease, transform ${this.animationTime}ms ease`
        element.style.opacity = 0
        element.style.transform = 'translate(-50%, -100%)'
      }
      setTimeout(() => {
        if (!element.remove) { // IE 不支持remove 方法
          let parentNode = element.parentNode
          parentNode && parentNode.parentNode.removeChild(parentNode)
        } else {
          element && element.parentNode.remove()
        }
      }, this.animationTime)
    }, this.duration)
  },

  success: function (message) {
    this._show(message, 'success')
  },

  warning: function (message) {
    this._show(message, 'warning')
  },

  error: function (message) {
    // debugger
    this._show(message, 'error')
  },
  loading (option) {
    return Loading.service(option)
  }
}
