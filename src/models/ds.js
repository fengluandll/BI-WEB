import { routerRedux } from 'dva/router';
import { list as dsList } from '../services/ds';
import { add as dlAdd } from '../services/dl';

export default {
  // model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间。
  namespace: 'ds',
  // 初始值，优先级低于传给 dva() 的 opts.initialState。
  state: {
    loading: false,
    list: [],
  },
  // 以 key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，
  // 可以和服务器交互，可以获取全局 state 的数据等等。
  effects: {
    *fetch({ payload: { name, page, pageSize } }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(dsList, { name, page, pageSize });
      const data = response.data;
      yield put({ type: 'save', payload: { data } });
    },
    *addDl({ payload: { id } }, { call, put }) {
      yield call(dlAdd, { id });    // 执行新增数据集
      yield put((routerRedux.push('/dl')));  // 跳转数据集列表
    },
  },
  // 以 key/value 格式定义 reducer。用于处理同步操作，唯一可以修改 state 的地方。由 action 触发。
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
        loading: false,
      };
    },
    changeLoading(state, { payload }) {
      return {
        ...state,
        loading: payload,
      };
    },
  },

};
