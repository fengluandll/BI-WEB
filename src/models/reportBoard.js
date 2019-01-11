import { fetch, fetchData, fetchEdit, saveDashBoard, searchItemData, searchDate, search, pullSynchronizationTab } from '../services/reportBoard';

export default {
  // model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间。
  namespace: 'reportBoard',
  // 初始值，优先级低于传给 dva() 的 opts.initialState。
  state: {
    mDashboard: {}, // m_dashboard 表
    tDashboard: {}, // t_dashboard 表
    mCharts: {},  // m_charts 表
    idColumns: {},  //  每个 图表 的维度 度量 图例 和 搜索框子组件 的 字段 对应的 相应的 表数据
    tableIdColumns: {},  // 每个图表 所有拥有的 数据集 的  所有字段
    dataList: {},   //  查询后 每个图表的数据 (带着 参数查询  参数存放在 m_dashboard 表中)

    searchEnum: {}, // 查询组件枚举数据
  },
  // 以 key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，
  // 可以和服务器交互，可以获取全局 state 的数据等等。
  effects: {
    *fetch({ payload: { boardId, callback } }, { call, put }) {
      const response = yield call(fetch, { boardId });
      const data = response.data;
      const { mDashboard, tDashboard, mCharts, idColumns, user_type, user_auth } = data;
      yield put({ type: 'save', payload: { mDashboard_old: mDashboard, tDashboard, mCharts, idColumns, user_type, user_auth } });
      callback();
    },
    *fetchData({ payload: { boardId, mDashboard, callback } }, { call, put }) {
      const response = yield call(fetchData, { boardId, mDashboard });
      const data = response.data;
      const { dataList } = data;
      yield put({ type: 'save', payload: { dataList } });
      callback();
    },
    *fetchEdit({ payload: { boardId, callback } }, { call, put }) {
      const response = yield call(fetchEdit, { boardId });
      const data = response.data;
      const { tableIdColumns } = data;
      yield put({ type: 'save', payload: { tableIdColumns } });
      callback();
    },
    *searchData({ payload: { mDashboard, boardId, value, callback } }, { call, put }) {
      const response = yield call(searchDate, { mDashboard, boardId, value });
      const data = response.data;
      const { dataList } = data;
      yield put({ type: 'save', payload: { dataList } });
      callback();
    },
    *search({ payload: { params, callback } }, { call, put }) {
      const response = yield call(search, { params });
      const data = response.data;
      const { dataList } = data;
      yield put({ type: 'save', payload: { dataList } });
      callback();
    },
    *saveDashBoard({ payload: { mDashboard_porp, dashboard_type, callback } }, { call, put }) {
      const response = yield call(saveDashBoard, { mDashboard_porp, dashboard_type });
      const data = response.data;
      const { success } = data;
      callback(success);
    },
    *searchItemData({ payload: { id, boardId, callback } }, { select, call, put }) {
      const { searchEnum } = yield select(state => state.reportBoard);
      if (null == searchEnum[id.toString()]) { // 如果没有数据就去后端请求
        const response = yield call(searchItemData, { id, boardId });
        const data = response.data;
        searchEnum[id.toString()] = data[id];
        yield put({ type: 'save', payload: { searchEnum: searchEnum } });
      }
      callback();
    },
    *pullSynchronizationTab({ payload: { id, callback } }, { call, put }) {
      const response = yield call(pullSynchronizationTab, { id });
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
