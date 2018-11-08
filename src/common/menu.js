const menuData = [{
  name: '数据源',
  icon: 'book',
  path: 'ds',
}, {
  name: '数据集',
  icon: 'book',
  path: 'dl',
}, {
  name: '仪表板',
  icon: 'book',
  path: 'Dashboard',
}];

function formatter(data, parentPath = '') {
  const list = [];
  data.forEach((item) => {
    if (item.children) {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
        children: formatter(item.children, `${parentPath}${item.path}/`),
      });
    } else {
      list.push({
        ...item,
        path: `${parentPath}${item.path}`,
      });
    }
  });
  return list;
}

export const getMenuData = () => formatter(menuData);
