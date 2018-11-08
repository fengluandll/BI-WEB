import { stringify } from 'qs';
import request from '../utils/request';

// 初始化时获取全部数据
export async function fetch(params) {
  return request(`http://localhost:8088/api/reportBoard/fetch?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}

// 点击编辑获取编辑数据
export async function fetchEdit(params) {
  return request(`http://localhost:8088/api/reportBoard/fetchEdit?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}

// 请求关联数据
export async function searchDate(params) {
  const formData = new FormData();
  formData.append('params', JSON.stringify(params));
  return request('http://localhost:8088/api/reportBoard/searchDate', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  });
}


// 保存dashboard
export async function saveDashBoard(params) {
  const formData = new FormData();
  formData.append('mDashboard', JSON.stringify(params));
  return request('http://localhost:8088/api/reportBoard/saveBoard', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  });
}

// 查询 搜索栏 子项 str 的下拉列表数据
export async function searchItemData(params) {
  return request(`http://localhost:8088/api/reportBoard/searchItemData?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}
