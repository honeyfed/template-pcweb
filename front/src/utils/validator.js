export function validateMobile(rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入管理员手机号'));
  }

  if (!/\d{11}/.test(`${value}`)) {
    callback(new Error('请输入11位数字'));
  } else {
    callback();
  }
}

export function checkIsEmpty(str) {
  // eslint-disable-next-line eqeqeq
  if (str == '') return true;
  const regu = '^[ ]+$';
  const re = new RegExp(regu);
  return re.test(str);
}

export function validateVCode(rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入验证码'));
  }

  if (!/\d{6}/.test(`${value}`)) {
    callback(new Error('验证码格式错误'));
  } else {
    callback();
  }
}

export function CheckXSS(data) {
  if (typeof data === 'string' && data) {
    const reg = new RegExp(
      '\\b(document|onload|eval|script|expression|onerror|javascript|vbscript|alert|iframe|onclick|onfocus)\\b',
      'i'
    );
    return reg.test(data);
  }
  return false;
}

export function checkName(rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入角色名称'));
  }
  if (/^[_|-]\w+$/.test(`${value}`)) {
    return callback(new Error('开头请不要使用横杠/下划线'));
  }

  if (!/^[A-Za-z0-9-_\u4e00-\u9fa5]+$/.test(`${value}`)) {
    callback(new Error('请输入10个字以内的中英文/数字/横杠/下划线'));
  } else {
    callback();
  }
}

export function checkUserName(rule, value, callback) {
  if (!value) {
    return callback(new Error('请输入10个字以内的中英文'));
  }

  if (!/^[\u4e00-\u9fa5_a-zA-Z]+$/.test(`${value}`)) {
    callback(new Error('请输入10个字以内的中英文'));
  } else {
    callback();
  }
}

/**
 * 所占字节数
 *
 * UTF-8 一种可变长度的Unicode编码格式，使用一至四个字节为每个字符编码（Unicode在范围 D800-DFFF 中不存在任何字符）
 * 000000 - 00007F(128个代码)      0zzzzzzz(00-7F)                             一个字节
 * 000080 - 0007FF(1920个代码)     110yyyyy(C0-DF) 10zzzzzz(80-BF)             两个字节
 * 000800 - 00D7FF
 * 00E000 - 00FFFF(61440个代码)    1110xxxx(E0-EF) 10yyyyyy 10zzzzzz           三个字节
 * 010000 - 10FFFF(1048576个代码)  11110www(F0-F7) 10xxxxxx 10yyyyyy 10zzzzzz  四个字节
 * {@link https://zh.wikipedia.org/wiki/UTF-8}
 *
 * UTF-16 编码65535以内使用两个字节编码，超出65535的使用四个字节（JS内部，字符储存格式是：UCS-2——UTF-16的子级）
 * 000000 - 00FFFF  两个字节
 * 010000 - 10FFFF  四个字节
 * {@link https://zh.wikipedia.org/wiki/UTF-16}
 *
 * GBK(ASCII的中文扩展) 除了0~126编号是1个字节之外，其他都2个字节（超过65535会由2个字显示）
 * {@link https://zh.wikipedia.org/wiki/汉字内码扩展规范}
 *
 * @param  {String} str
 * @param  {String} [charset= 'gbk'] utf-8, utf-16
 * @return {Number}
 */

export function sizeofByte(str, charset = 'utf8') {
  let total = 0;
  let charCode;

  const charset2 = charset.toLowerCase();

  if (charset2 === 'utf-8' || charset2 === 'utf8') {
    for (let i = 0, len = str.length; i < len; i++) {
      charCode = str.codePointAt(i);

      if (charCode <= 0x007f) {
        total += 1;
      } else if (charCode <= 0x07ff) {
        total += 2;
      } else if (charCode <= 0xffff) {
        total += 3;
      } else {
        total += 4;
        i += 1;
      }
    }
  } else if (charset2 === 'utf-16' || charset2 === 'utf16') {
    for (let i = 0, len = str.length; i < len; i++) {
      charCode = str.codePointAt(i);

      if (charCode <= 0xffff) {
        total += 2;
      } else {
        total += 4;
        i += 1;
      }
    }
  } else {
    total = str.replace(/[^\x00-\xff]/g, 'aa').length;
  }

  return total;
}
