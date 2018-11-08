import { searchTable, columnList, updateTable, searchTableByDisplay, sync, refreshData } from '../services/dl';
import D from '../utils/objectUtils';

export default {
  // model 的命名空间，同时也是他在全局 state 上的属性，只能用字符串，不支持通过 . 的方式创建多层命名空间。
  namespace: 'dlColumn',
  // 初始值，优先级低于传给 dva() 的 opts.initialState。
  state: {
    list: [],
    table: null,
    refreshList: [],
  },
  // 以 key/value 格式定义 effect。用于处理异步操作和业务逻辑，不直接修改 state。由 action 触发，可以触发 action，
  // 可以和服务器交互，可以获取全局 state 的数据等等。
  effects: {
    *fetchColumn({ payload: { id } }, { call, put }) {
      const response = yield call(columnList, { id });
      const rest = yield call(searchTable, { id });
      const table = rest.data.entity;
      const data = response.data;
      const list = data.list;
      yield put({ type: 'save', payload: { list, table } });
    },
    *updateColumn({ payload: { o } }, { put }) {
      yield put({ type: 'update', payload: { o } });
    },
    *saveColumn({ payload: { id, name, type, onSuccess } }, { select, call, put }) {
      /** 1 - repeat name 2 - save success */
      const response = yield call(searchTableByDisplay, { id, name });
      const searchList = response.data.result;
      const repeatNum = searchList === null ? 0 : searchList.filter((ele) => {
        return ele.dsDisplay === name;
      }).length;
      if ((type === 'save' && repeatNum > 1) || (type === 'saveAs' && repeatNum > 0)) {
        // 有重复数据集名称
        onSuccess(1);
      } else {
        // 无重复数据集名称
        const list = yield select(state => state.dlColumn.list);
        const table = yield select(state => state.dlColumn.table);
        table.createDate = new Date(table.createDate);
        table.modifyDate = new Date();
        // deep clone
        const listBak = D.deepClone(list);
        // for (const o of listBak) {
        //   delete o.id;
        // }
        table.dsDisplay = type === 'save' ? name : table.dsDisplay;
        // save
        yield call(updateTable, {
          table,
          column: listBak,
        });
        table.dsDisplay = name;
        if (type === 'saveAs') {
          delete table.id;
        }
        // saveAs
        yield call(updateTable, {
          table,
          column: list,
        });
        const rest = yield call(columnList, { id: list[0].rsTId });
        onSuccess(2);
        const data = rest.data;
        yield put({ type: 'save', payload: { list: data.list } });
      }
    },
    *deleteColumn({ payload: { id } }, { select, put }) {
      const list = yield select(state => state.dlColumn.list);
      const rest = list.filter((o) => {
        return o.id !== id;
      });
      yield put({ type: 'save', payload: { list: rest } });
    },
    *sync({ payload: { onSuccess } }, { select, call, put }) {
      const table = yield select(state => state.dlColumn.table);
      yield call(sync, { id: table.id });
      onSuccess();
      const rest = yield call(columnList, { id: table.id });
      const data = rest.data;
      yield put({ type: 'save', payload: { list: data.list } });
    },
    *refreshData(args, { select, call, put }) {
      const columns = yield select(state => state.dlColumn.list);
      const table = yield select(state => state.dlColumn.table);
      const rest = yield call(refreshData, { table, columns });
      const data = rest.data;
      yield put({ type: 'save', payload: { refreshList: data.list } });
    },
  },
  // 以 key/value 格式定义 reducer。用于处理同步操作，唯一可以修改 state 的地方。由 action 触发。
  reducers: {
    /** 保存查询结果到props */
    save(state, { payload }) {
      const obj = {
        ...state,
        ...payload,
      };
      return obj;
    },
    /** 更新查询list */
    update(state, { payload }) {
      const obj = payload.o;
      const index = state.list.findIndex((o) => {
        return o.id === obj.id;
      });
      if (index === -1) {
        state.list.push(obj);
      } else {
        const list = state.list;
        list[index] = obj;
      }
      return state;
    },
  },

};
