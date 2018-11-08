import { stringify } from 'qs';
import fetch from 'dva/fetch';
import request from '../utils/request';

// 获取仪表板列表
export async function list(params) {
  return request(`http://localhost:8080/dashboard/list?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}

// 获取仪表板
export async function findByPageId(params) {
  return request(`http://localhost:8080/dashboard/findByPageId?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}

// 根据名称查询仪表板
export async function searchByName(params) {
  return request(`http://localhost:8080/dashboard/searchByName?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}

// 删除
export async function del(params) {
  return request(`http://localhost:8080/dashboard/delete?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}

// 保存
export async function save(params) {
  const formData = new FormData();
  formData.append('jsonStr', JSON.stringify(params));
  return request('http://localhost:8080/dashboard/save', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  });
}

// 加载数据
export async function load(params) {
  const formData = new FormData();
  formData.append('jsonStr', JSON.stringify(params));
  return request('http://localhost:8080/dashboard/load', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  });
}

// 加载明细数据-交叉表
export async function detail(params) {
  const formData = new FormData();
  formData.append('jsonStr', JSON.stringify(params));
  return request('http://localhost:8080/dashboard/detail', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  });
}

// 加载查询所需的枚举数据
export async function loadSearchEnum(params) {
  const formData = new FormData();
  formData.append('jsonStr', JSON.stringify(params));
  return request('http://localhost:8080/dashboard/loadSearchEnum', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  });
}

export async function exportExcel(params) {
  const formData = new FormData();
  formData.append('jsonStr', JSON.stringify(params));
  return fetch('http://localhost:8080/dashboard/exportDetail', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  })
    .then(response => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'export.xls';
      a.click();
      return 1;
    });
}
