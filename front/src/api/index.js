// 常用前端防重放逻辑

import axios from 'axios';
import { getQueryString } from '../utils/common';

const HEADER_ROUTER = '';

export function contractRouterUrl(url) {
  return `${HEADER_ROUTER}${url}`;
}

function extendRequestObj(obj) {
  return {
    ...obj
  };
}

// 获取后端时间戳
const TIME_STAMP = '/api/timestamp';

export async function commonHttpRequest(url, obj, type) {
  let gTimeOffset = sessionStorage.getItem('currentDiffTime') || 0;
  const clientTime = +new Date();
  if (sessionStorage.getItem('currentServerTime')) {
    return useCommonHeader(url, obj, type, parseInt(gTimeOffset));
  }
  let res = await axios.get(contractRouterUrl(TIME_STAMP));
  if (res.status === 200) {
    let data = res.data;
    let serverTime = parseInt(data);
    if (isFinite(serverTime)) {
      gTimeOffset = +serverTime - clientTime;
    }
    sessionStorage.setItem('currentServerTime', serverTime);
    sessionStorage.setItem('currentDiffTime', gTimeOffset);
    return useCommonHeader(url, obj, type, gTimeOffset);
  }
}

function useCommonHeader(url, obj, type, pastTime) {
  const commonHeader = {
    'cmu-timestamp': '' + (+new Date() + pastTime),
    'cmu-nonce': ('' + Math.random()).slice(2)
  };
  const userCode = getQueryString('user_code');
  obj = {
		...obj,
		userCode
	};
  const http = type.toLocaleLowerCase() === 'get' ? axios.get(url, {params: extendRequestObj(obj)}) :
		axios.post(url, extendRequestObj(obj), {headers: commonHeader});
  return http.then(
    result => {
      return result;
    },
    err => {
      if (!navigator.onLine) {
        return {
          data: {
            retcode: -2,
            code: -2,
            message: '网络异常',
            result: {
              retcode: -2,
              code: -2,
              message: '网络异常'
            }
          }
        };
      }
    }
  );
}

