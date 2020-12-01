// 获取配置文件
import HainaTestEnv from './hainatest'

const HOST_FLAVOR_MAP = {
  'localhost': HainaTestEnv
}

function flavorResolver () {
  return HOST_FLAVOR_MAP.localhost
}

function appendFaviconLinkElement () {
  let headElement = document.getElementsByTagName('head')[0]
  let linkElement = document.createElement('link')
  linkElement.setAttribute('rel', 'shortcut icon')
  linkElement.setAttribute('type', 'image/x-icon')
  linkElement.setAttribute('href', flavorResolver().favicon)
  headElement.appendChild(linkElement)
}

function doOtherCustomization () {
  document.title = flavorResolver().title
  appendFaviconLinkElement()
}

doOtherCustomization()

export default { env: flavorResolver() }
