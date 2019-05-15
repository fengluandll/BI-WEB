import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Drawer, message, Tree, Button, Input, Modal, Radio, Icon } from 'antd';



const { TreeNode } = Tree;
const InputSearch = Input.Search;

// let treeData = [{
//     title: '0-0',
//     key: '0-0',
//     children: [{
//         title: '0-0-0',
//         key: '0-0-0',
//         children: [
//             { title: '0-0-0-0', key: '0-0-0-0' },
//             { title: '0-0-0-1', key: '0-0-0-1' },
//             { title: '0-0-0-2', key: '0-0-0-2' },
//         ],
//     }]
// }];

let dataOrigin = []; // 原始数据
let treeData = []; // 组织树数据

let dataList = []; //所有节点的数据,由组织树数据算出来的,给搜索框用的。

/***
 * 
 * 报表左侧的搜索组件,
 * 目前一个是组织树,一个是通用搜索时间控件。
 * 
 * @author:wangliu
 * 
 * ***/
class Search extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false, // 是否显示

            expandedKeys: [], // 展开指定的树节点
            autoExpandParent: true, // 是否自动展开父节点
            checkedKeys: [], // 选中复选框的树节点
            selectedKeys: [], // 设置选中的树节点

            searchValue: '', // 搜索框的值
        };
    }

    componentWillReceiveProps(nextProps) {
        const { visible } = nextProps;
        this.initData(nextProps);
        this.setState({
            visible,
        });
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    /******************************************函数*********************************************/
    /***
     * @name: 初始化制造数据
     * 
     * ***/
    initData = (nextProps) => {
        dataOrigin = nextProps.data;
        if (treeData.length == 0) {
            this.getTreeData(dataOrigin, treeData);
            this.getDataList(treeData);
        }
    }
    /***
     * @name: 组织树的数据
     * @param: data_a:数据库中查出的原始数据;data_b:要拼接成的数据
     * ***/
    getTreeData = (data_a, data_b) => {
        for (let i = 0; i < data_a.length; i++) {
            const node = data_a[i];
            const { id, array_id, parent_id, name, code_column, depth, children } = node;
            const obj = { title: name, key: array_id, column: code_column };
            data_b.push(obj);
            if (children) {
                obj.children = [];
                this.getTreeData(children, obj.children);
            }
        }
    }
    /***
     * @name: 组织树搜索要用到的数据
     * @param: data: 组织树数据
     * 
     * ***/
    getDataList = (data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { key, title, children } = node;
            dataList.push({ key, title });
            if (node.children) {
                this.getDataList(node.children);
            }
        }
    }
    /***
     * @name: 关闭函数
     * ***/
    onClose = () => {
        const { changeSearchPro } = this.props;
        changeSearchPro();
    }
    /***
     * @name: 选择组织回调事件
     * @description:将选中的id循环,然后找到最高等级的那个id,拿去做参数
     * 第一步: 根据字段的最大长度找到有多少层。
     * 第二步: 循环所有层级,逐级匹配depth字段,找到本层级的参数,到下一层的时候要去除掉上一层包含的字段。
     * 
     * ***/
    changeParam = (checkedKeys) => {
        const { changeSearchProParam } = this.props;
        // 1.找到最大多少层
        let length = 0;
        let param = []; // 参数数组
        for (let item of checkedKeys) {
            const arr = item.split(",");
            length = arr.length > length ? arr.length : length;
        }
        // 2.循环所有层级
        for (let i = 0; i < length; i++) {
            const dep = i; // 层级
            for (let item of checkedKeys) {
                let break_flag = false;
                const obj = { id: "", code_column: "", array_id: "", name: "", depth: "" };
                this.getParam(item, obj, dataOrigin);
                if (dep == obj.depth) {
                    if (param.length != 0) {
                        for (let item_child of param) {
                            if (obj.array_id.indexOf(item_child.id) != -1) { //不是之前存在param里的子项
                                break_flag = true;
                            }
                        }
                    }
                    if (break_flag) {
                        continue;
                    }
                    const o = { id: obj.id, code_column: obj.code_column, array_id: obj.array_id };
                    param.push(o);
                }
            }
        }
        // 制造返回值
        const params_pro = {};
        for (let item of param) {
            const keys = Object.keys(params_pro);
            if (keys.indexOf(item.code_column) != -1) { // 如果是同级数据
                params_pro[item.code_column].push(item.id);
            } else {
                const arr = [];
                arr.push(item.id);
                params_pro[item.code_column] = arr;
            }
        }
        changeSearchProParam(params_pro);
    }
    /***
     * @name: 根据选择的id,找到原始数据中的对象。
     * 
     * @param: key:字段id,obj:返回的json
     * ***/
    getParam = (key, obj, data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const { id, code_column, array_id, name, depth, children } = node;
            if (key == array_id) {
                obj.id = id;
                obj.code_column = code_column;
                obj.array_id = array_id;
                obj.name = name;
                obj.depth = depth;
            } else {
                if (null != children && children.length > 0) {
                    this.getParam(key, obj, children);
                }
            }
        }
    }



    /**************************************org-tree*********************************************/
    /***
     * 组织树
     * 
     * ***/
    renderOrgTree = () => {
        return (
            <div>
                <InputSearch style={{ marginBottom: 8 }} placeholder="Search" onChange={this.onChange} />
                <Tree
                    checkable={true}
                    onExpand={this.onExpand}
                    expandedKeys={this.state.expandedKeys}
                    autoExpandParent={this.state.autoExpandParent}
                    onCheck={this.onCheck}
                    checkedKeys={this.state.checkedKeys}
                    onSelect={this.onSelect}
                    selectedKeys={this.state.selectedKeys}
                >
                    {this.loop(treeData)}
                </Tree>
            </div>
        );
    }
    /***
     * 
     * 循环节点数据
     * 
     * ***/
    loop = data => data.map((item) => {
        const { searchValue, expandedKeys, autoExpandParent } = this.state;
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title = index > -1 ? (
            <span>
                {beforeStr}
                <span style={{ color: '#f50' }}>{searchValue}</span>
                {afterStr}
            </span>
        ) : <span>{item.title}</span>;
        if (item.children) {
            return (
                <TreeNode key={item.key} title={title}>
                    {this.loop(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode key={item.key} title={title} />;
    });
    /***
     * @name: 找到父节点的id,为了找到要展开的节点。
     * 
     * ***/
    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };
    /***
     * @name: 搜索框事件
     * 
     * ***/
    onChange = (e) => {
        const value = e.target.value;
        const expandedKeys = dataList.map((item) => {
            if (item.title.indexOf(value) > -1) {
                return this.getParentKey(item.key, treeData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    }

    // 展开收起节点触发事件
    onExpand = (expandedKeys) => {
        //console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    // 点击复选框触发事件
    onCheck = (checkedKeys) => {
        //console.log('onCheck', checkedKeys);
        this.changeParam(checkedKeys);
        this.setState({ checkedKeys });
    }

    // 点击树节点触发
    onSelect = (selectedKeys, info) => {
        //console.log('onSelect', info + "--" + selectedKeys);
        this.setState({ selectedKeys });
    }

    /***************************************************************************************/

    render() {
        return (
            <div>
                <Drawer
                    title="组织选择"
                    placement="left"
                    width={720}
                    onClose={this.onClose}
                    visible={this.state.visible}
                >
                    {this.renderOrgTree()}
                </Drawer>
            </div>
        );
    }
}

export default Search;