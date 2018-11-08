import browserHistory from 'history/createBrowserHistory';
import dva from 'dva';
import { routerRedux } from 'dva/router';
import './g2';
import './index.less';

// 1. Initialize
// debugger;
const his = browserHistory({
  basename: '/smart_report',
});
const app = dva({
  history: his,
  onReducer: r => (state, action) => {
    const newState = r(state, action);
    if (action.type === 'newDashboard/cleanUp') {
      return {
        ...newState,
        ...{ newDashboard: {
          dashBoard: null,
          list: [],
          dsList: [],
          columnList: [],
          dsColumnMap: {},
          chart: {},
          searchEnum: {},
        } },
      };
    } else if (action.type === 'report/cleanUp') {
      return {
        ...newState,
        ...{ report: {
          dashBoard: null,
          report: null,
          list: [],
          dsList: [],
          dsColumnMap: {},
          searchEnum: {},
          columnList: [],
          chart: {},
        } },
      };
    } else if (action.type === 'dlColumn/cleanUp') {
      return {
        ...newState,
        ...{ dlColumn: { list: [], table: null, refreshList: [] } },
      };
    }
    return newState;
  },
  onError: (e, dispatch) => {
    if (e.name === 401 || e.name === 403) {
      dispatch(routerRedux.push('/exception/403'));
      return;
    }
    if (e.name <= 504 && e.name >= 500) {
      dispatch(routerRedux.push('/exception/500'));
      return;
    }
    if (e.name >= 404 && e.name < 422) {
      dispatch(routerRedux.push('/exception/404'));
    }
  },
});

// 2. Plugins
RegExp.quote = (str) => {
  return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
};

// app.use({});

// 3. Model   用来接受发送的action
// app.model(require('./models/example'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
