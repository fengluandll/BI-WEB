import { findAllTable, columnList } from '../services/dl';
import { load, detail, loadSearchEnum, exportExcel } from '../services/dashboard';
import { findByReportId } from '../services/report';

export default {
  // model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间。
  namespace: 'report',
  // 初始值，优先级低于传给 dva() 的 opts.initialState。
  state: {
    dashBoard: null,
    report: null,
    list: [],
    dsList: [],
    dsColumnMap: {}, // 存储数据集列表
    searchEnum: {}, // 查询组件枚举数据
    columnList: [], // 当前选择数据集
    chart: {},
    loading: {},  // 加载状态
  },
  // 以 key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，
  // 可以和服务器交互，可以获取全局 state 的数据等等。
  effects: {
    * fetch({ payload: { reportId, callback } }, { call, put }) {
      const o = {};
      let response = yield call(findAllTable);
      let data = response.data;
      o.dsList = data.list;
      response = yield call(findByReportId, { reportId });
      data = response.data;
      const { dashBoard } = data;
      if (dashBoard) {
        dashBoard.config = JSON.parse(dashBoard.config);
        o.dashBoard = dashBoard;
      }
      yield put({ type: 'save', payload: o });
      callback();
    },
    * fetchColumn({ payload: { id } }, { select, call, put }) {
      const dsColumnMap = yield select(state => state.report.dsColumnMap);
      const response = yield call(columnList, { id });
      const data = response.data;
      const list = data.list;
      dsColumnMap[id] = list;
      yield put({ type: 'save', payload: { columnList: list, dsColumnMap } });
    },
    * fetchColumns({ payload: { ids, onLoaded } }, { select, call, put }) {
      for (let i = 0; i < ids.length; i += 1) {
        const id = ids[i];
        const dsColumnMap = yield select(state => state.report.dsColumnMap);
        const response = yield call(columnList, { id });
        const data = response.data;
        const list = data.list;
        dsColumnMap[id] = list;
        yield put({ type: 'save', payload: { columnList: list, dsColumnMap } });
      }
      onLoaded();
    },
    * exportData({ payload: { condition, reportId } },
                 { select, call, put }) {
      const { dimension, measure, table, params, name } = condition;
      const { loading } = yield select(state => state.report);
      loading[name] = true;
      yield put({
        type: 'save',
        payload: { loading },
      });
      yield call(exportExcel, { dimension, measure, table, params, reportId });
      loading[name] = false;
      yield put({
        type: 'save',
        payload: { loading },
      });
    },
    * fetchData({ payload: { condition } },
                    { select, call, put }) {
      const { type, dimension, measure, legend, table, name, params, reportId } = condition;
      const { chart, loading } = yield select(state => state.report);
      loading[name] = true;
      yield put({
        type: 'save',
        payload: { loading },
      });
      if (type === 'table') {
        const response = yield call(detail, { dimension, measure, table, params, reportId });
        const data = response.data;
        chart[name] = data.data;
        loading[name] = false;
        yield put({
          type: 'save',
          payload: { chart, loading },
        });
      } else {
        const response = yield call(load, {
          dimension, measure, legend, table, params, reportId, type
        });
        const data = response.data;
        chart[name] = data.list;
        loading[name] = false;
        yield put({
          type: 'save',
          payload: { chart, loading },
        });
      }
    },
    * loadSearchEnum({ payload: { name, table, field, params, reportId } },
                     { select, call, put }) {
      const response = yield call(loadSearchEnum, { table, field, params, reportId });
      const data = response.data;
      const searchEnum = yield select(state => state.report.searchEnum);
      if (!searchEnum[name]) {
        searchEnum[name] = {};
      }
      searchEnum[name][field] = data.list;
      yield put({
        type: 'save',
        payload: { searchEnum },
      });
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
