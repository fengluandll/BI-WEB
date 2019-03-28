import { findChartDate, findType, findTableDate, getMchartsList, saveConfig, newCharts } from '../services/editCharts';

export default {
  // model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间。
  namespace: 'editBoard',
  // 初始值，优先级低于传给 dva() 的 opts.initialState。
  state: {
    mCharts: {},  // m_charts 表
    mChartsList: {}, // m_charts对象
    tDashboard: {}, // tDashboard对象
    dataSetList: {}, // 数据集对象
    tableIdColumns: {}, // 数据集字段对象
    tableConfig: {}, // key:数据集名称,value:table对象
  },
  // 以 key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，
  // 可以和服务器交互，可以获取全局 state 的数据等等。
  effects: {
    *fetch({ payload: { chartId, callback } }, { call, put }) {
      let response = yield call(findType, { chartId });
      const { type } = response.data;
      if (type == "3" || type == "4" || type == "5") {
        response = yield call(findTableDate, { chartId });
      } else if (type == "11") {

      } else if (type == "0" || type == "1" || type == "2") {
        response = yield call(findChartDate, { chartId });
      }
      const { list, mCharts } = response.data;
      yield put({ type: 'save', payload: { list, mCharts } });
      callback();
    },
    *getMchartsList({ payload: { t_dashboard_id, callback } }, { call, put }) {
      const response = yield call(getMchartsList, { t_dashboard_id });
      const { mChartsList, idColumns, tDashboard, dataSetList, tableIdColumns, tableConfig } = response.data;
      yield put({ type: 'save', payload: { mChartsList, idColumns, tDashboard, dataSetList, tableIdColumns, tableConfig } });
      callback();
    },
    *saveConfig({ payload: { id, config, callback } }, { call, put }) {
      const response = yield call(saveConfig, { id, config });
      const data = response.data;
      const { success } = data;
      callback(success);
    },
    *newCharts({ payload: { id, config, callback } }, { call, put }) {
      const response = yield call(newCharts, { id, config });
      const data = response.data;
      const { success } = data;
      callback(success);
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
