import { stringify } from 'qs';
import request from '../utils/request';

// 获取chart数据
export async function findChartDate(params) {
  return request(`http://localhost:8088/api/edit/findChartDate?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}

// 获取仪表板类型
export async function findMcharts(params) {
  return request(`http://localhost:8088/api/edit/findMcharts?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}

// 获取table数据
export async function findTableDate(params) {
  return request(`http://localhost:8088/api/edit/findTableDate?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}

// 所有t_dashbaord的Mcharts数据
export async function getMchartsList(params) {
  return request(`http://localhost:8088/api/edit/getMchartsList?${stringify(params)}`, {
    method: 'POST',
    mode: 'cors',
  });
}

// 保存config
export async function saveConfig(params) {
  const formData = new FormData();
  formData.append('id', params.id);
  formData.append('config', params.config);
  return request('http://localhost:8088/api/edit/update', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  });
}

// 新建图表
export async function newCharts(params) {
  const formData = new FormData();
  formData.append('id', params.id);
  formData.append('config', params.config);
  return request('http://localhost:8088/api/edit/newCharts', {
    method: 'POST',
    mode: 'cors',
    body: formData,
  });
}
