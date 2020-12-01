export function getUrlParam(name, url) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)'),
    rTxt = url || window.location.search;
  let r = rTxt.substr(1).match(reg);
  return r ? decodeURIComponent(r[2]) : null;
}
