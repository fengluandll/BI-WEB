import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import { Drawer, message, Tree, Button, Input, Modal, Radio, Icon } from 'antd';



const { TreeNode } = Tree;
const InputSearch = Input.Search;

const treeData = [{
    title: '0-0',
    key: '0-0',
    children: [{
        title: '0-0-0',
        key: '0-0-0',
        children: [
            { title: '0-0-0-0', key: '0-0-0-0' },
            { title: '0-0-0-1', key: '0-0-0-1' },
            { title: '0-0-0-2', key: '0-0-0-2' },
        ],
    }, {
        title: '0-0-1',
        key: '0-0-1',
        children: [
            { title: '0-0-1-0', key: '0-0-1-0' },
            { title: '0-0-1-1', key: '0-0-1-1' },
            { title: '0-0-1-2', key: '0-0-1-2' },
        ],
    }, {
        title: '0-0-2',
        key: '0-0-2',
    }],
}, {
    title: '0-1',
    key: '0-1',
    children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
    ],
}, {
    title: '0-2',
    key: '0-2',
}];

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

            expandedKeys: ['0-0-0', '0-0-1'], // 展开指定的树节点
            autoExpandParent: true, // 是否自动展开父节点
            checkedKeys: ['0-0-0'], // 选中复选框的树节点
            selectedKeys: [], // 设置选中的树节点

            searchValue: '', // 搜索框的值
        };
    }

    componentWillReceiveProps(nextProps) {
        const { visible } = nextProps;
        this.setState({
            visible,
        });
    }

    componentDidMount() {

    }

    componentDidUpdate() {

    }

    /***************************************************************************************/
    // 关闭函数
    onClose = () => {
        const { visible } = this.state;
        this.setState({
            visible: visible ? false : true,
        });
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
    // 展开收起节点触发事件
    onExpand = (expandedKeys) => {
        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    // 点击复选框触发事件
    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    }

    // 点击树节点触发
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info + "--" + selectedKeys);
        this.setState({ selectedKeys });
    }

    // 展示每一个节点
    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} />;
    });

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

    onChange = (e) => {
        const value = e.target.value;
        const expandedKeys = treeData.map((item) => {
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