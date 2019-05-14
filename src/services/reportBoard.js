import { stringify } from 'qs';
import fetch from 'dva/fetch';
import request from '../utils/request';

// 初始化时获取结构数据
export async function initFetch(params) {
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

// 保存查询通用查询方法 add by wangliu 20190107
export async function search(params) {
  const formData = new FormData();
  formData.append('params', JSON.stringify(params));
  return request('http://localhost:8088/api/reportBoard/search', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  });
}

// 导出交叉表excel
export async function onTableExport(params) {
  const formData = new FormData();
  formData.append('params', JSON.stringify(params));
  return fetch('http://localhost:8088/api/reportBoard/exportTableExcel', {
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

// 保存dashboard
export async function saveDashBoard(params) {
  const formData = new FormData();
  formData.append('params', JSON.stringify(params));
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

// 查询 组织树的数据
export async function getSearchData(params) {
  return request(`http://localhost:8088/api/reportBoard/getSearchData?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}

// 拉取每个tab同步
export async function pullSynchronizationTab(params) {
  return request(`http://localhost:8088/api/reportBoard/pullSynchronizationTab?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}
