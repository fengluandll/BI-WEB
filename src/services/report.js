import { stringify } from 'qs';
import request from '../utils/request';

// 获取仪表板
export async function findByReportId(params) {
  return request(`http://localhost:8080/dashboard/findByReportId?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}
