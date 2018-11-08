import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`http://localhost:8080/ds/list?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}
