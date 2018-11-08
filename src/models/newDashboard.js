import { findAllTable, columnList } from '../services/dl';
import { load, detail, loadSearchEnum, save, findByPageId, searchByName, exportExcel } from '../services/dashboard';

export default {
  // model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间。
  namespace: 'newDashboard',
  // 初始值，优先级低于传给 dva() 的 opts.initialState。
  state: {
    dashBoard: null,
    list: [],
    dsList: [],
    dsColumnMap: {}, // 存储数据集列表
    searchEnum: {}, // 查询组件枚举数据
    columnList: [], // 当前选择数据集
    chart: {},
  },
  // 以 key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，
  // 可以和服务器交互，可以获取全局 state 的数据等等。
  effects: {
    * fetch({ payload: { pageId, callback } }, { call, put }) {
      const o = {};
      let response = yield call(findAllTable);
      let data = response.data;
      o.dsList = data.list;
      response = yield call(findByPageId, { pageId });
      data = response.data;
      const dashBoard = data.entity;
      if (dashBoard) {
        dashBoard.config = JSON.parse(dashBoard.config);
        o.dashBoard = dashBoard;
      }
      yield put({ type: 'save', payload: o });
      callback();
    },
    * fetchColumn({ payload: { id } }, { select, call, put }) {
      const dsColumnMap = yield select(state => state.newDashboard.dsColumnMap);
      const response = yield call(columnList, { id });
      const data = response.data;
      const list = data.list;
      dsColumnMap[id] = list;
      yield put({ type: 'save', payload: { columnList: list, dsColumnMap } });
    },
    * fetchColumns({ payload: { ids, callback } }, { select, call, put }) {
      for (let i = 0; i < ids.length; i += 1) {
        const id = ids[i];
        const dsColumnMap = yield select(state => state.newDashboard.dsColumnMap);
        const response = yield call(columnList, { id });
        const data = response.data;
        const list = data.list;
        dsColumnMap[id] = list;
        yield put({ type: 'save', payload: { columnList: list, dsColumnMap } });
      }
      callback();
    },
    * fetchData({ payload: { condition } },
                    { select, call, put }) {
      const { type, dimension, measure, legend, table, name, params } = condition;
      const chart = yield select(state => state.newDashboard.chart);
      if (type === 'table') {
        const response = yield call(detail, { dimension, measure, table, params });
        const data = response.data;
        chart[name] = data.data;
        yield put({
          type: 'save',
          payload: { chart },
        });
      } else {
        const response = yield call(load, { dimension, measure, legend, table, params });
        const data = response.data;
        chart[name] = data.list;
        yield put({
          type: 'save',
          payload: { chart },
        });
      }
    },
    * exportData({ payload: { condition } },
                { call }) {
      const { dimension, measure, table, params } = condition;
      yield call(exportExcel, { dimension, measure, table, params });
    },
    * loadSearchEnum({ payload: { name, table, field, params } },
                     { select, call, put }) {
      const response = yield call(loadSearchEnum, { table, field, params });
      const data = response.data;
      const searchEnum = yield select(state => state.newDashboard.searchEnum);
      if (!searchEnum[name]) {
        searchEnum[name] = {};
      }
      searchEnum[name][field] = data.list;
      yield put({
        type: 'save',
        payload: { searchEnum },
      });
    },
    // 保存仪表板
    * saveDashBoard({ payload: { dashboard, type, onSuccess } }, { call }) {
      // 根据名称查询仪表板
      let response = yield call(searchByName, { name: dashboard.name });
      const result = response.data.result;
      if (type === 'save') {
        // 保存
        const id = result[0] ? result[0].id : null;
        if (!id || id === dashboard.id) {
          response = yield call(save, { params: dashboard });
          const { data } = response;
          if (data && data.result === 'success') {
            onSuccess(1, data.pageId);
          } else {
            onSuccess(2);
          }
        } else {
          onSuccess(0);
        }
      } else if (result.length === 0) {
        // 另存为
        dashboard.id = null;
        response = yield call(save, { params: dashboard });
        const { data } = response;
        if (data && data.result === 'success') {
          onSuccess(1, data.pageId);
        } else {
          onSuccess(2);
        }
      } else {
        // 另存为
        onSuccess(0);
      }
    },
  },
  // 以 key/value 格式定义 reducer。用于处理同步操作，唯一可以修改 state 的地方。由 action 触发。
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
