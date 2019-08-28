import request from '@/utils/request';

export async function requestData(params: any) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}
