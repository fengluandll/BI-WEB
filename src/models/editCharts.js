import { findChartDate, findMcharts, findTableDate } from '../services/editCharts';

export default {
  // model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间。
  namespace: 'editCharts',
  // 初始值，优先级低于传给 dva() 的 opts.initialState。
  state: {
    mCharts: {},  // m_charts 表
  },
  // 以 key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，
  // 可以和服务器交互，可以获取全局 state 的数据等等。
  effects: {
    *findMcharts({ payload: { chartId, callback } }, { call, put }) {
      const response = yield call(findMcharts, { chartId });
      const { mCharts } = response.data;
      yield put({ type: 'save', payload: { mCharts } });
      callback();
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
