import { stringify } from 'qs';
import request from '../utils/request';

// 查询table List - 分页
export async function list(params) {
  return request(`http://localhost:8080/dl/list?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}
// 查询table List - 所有
export async function findAllTable() {
  return request('http://localhost:8080/dl/findAll', {
    method: 'POST',
    mode: 'cors',
  });
}

// 搜索 table
export async function searchTable(params) {
  return request(`http://localhost:8080/dl/searchTable?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}
// 根据DsDisplay查询table
export async function searchTableByDisplay(params) {
  return request(`http://localhost:8080/dl/searchTableByDisplay?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}
// 获取 column List
export async function columnList(params) {
  return request(`http://localhost:8080/dl/columnList?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}
// 保存/更新 table & column
export async function updateTable(params) {
  const formData = new FormData();
  formData.append('jsonStr', JSON.stringify(params));
  return request('http://localhost:8080/dl/updateTable', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  });
}
// 保存/更新 column
export async function updateColumn(params) {
  // 提交列表数据
  const formData = new FormData();
  formData.append('jsonStr', JSON.stringify(params));
  return request('http://localhost:8080/dl/updateColumn', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  });
}
// 删除 table & column
export async function deleteTable(params) {
  return request(`http://localhost:8080/dl/deleteTable?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}
// 删除column
export async function deleteColumn(params) {
  return request(`http://localhost:8080/dl/deleteColumn?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}
// 新增数据集
export async function add(params) {
  return request(`http://localhost:8080/dl/add?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}
// 同步表结构
export async function sync(params) {
  return request(`http://localhost:8080/dl/sync?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}
// 刷新预览数据
export async function refreshData(params) {
  // 提交列表数据
  const formData = new FormData();
  formData.append('jsonStr', JSON.stringify(params));
  return request('http://localhost:8080/dl/refreshData', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  });
}
