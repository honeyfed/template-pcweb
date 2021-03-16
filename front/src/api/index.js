import { NetV3 as Net, ApiError } from 'honey-net';
export { ApiError } from 'honey-net';
const api = new Net();

// just for test
const API_TEST = 'test'

api.init({
  baseUrl: '/',
  suspendSyncTime: true,
  customHeaderHandler: (headersToModify) => {
    const headers = headersToModify;
    const token = sessionStorage.getItem('Token');
    headers['x-jwt-token'] = token;
  },
});

export const net = api;

export async function test(data) {
  try {
    const res = await api.easyPost(API_TEST, data);
    // name, link, uuid, icon
    return res;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error(error.message);
  }
  return null;
}
