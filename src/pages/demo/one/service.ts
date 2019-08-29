import request from '@/utils/request';

export async function requestData(params: any) {
  return request('/api/demo/one', {
    method: 'POST',
    data: params,
  });
}
