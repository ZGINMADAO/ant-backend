import request from '@/utils/request';

export async function requestData(params: any) {
  return request('/api/demo/form', {
    method: 'POST',
    data: params,
  });
}
