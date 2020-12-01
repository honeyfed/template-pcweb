export function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

export function formatMoney(cent) {
  const centInt = parseInt(cent);

  if (isFinite(centInt)) {
    const money = cent / 100;

    return money.toFixed(2);
  }
  return cent;
}

export function checkPhone(phone) {
  if (/^1\d{10}$/g.test(phone)) {
    return true;
  }
  return false;
}

// 禁输表情
export function inputEmoji(data) {
  var regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig;
  if (regStr.test(data)) {
    return data.replace(regStr, '');
  }
  return data;
}
