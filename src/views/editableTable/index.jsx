/**
 * 可编辑表格
 * 可处理 input select datepicker fileupload
 * 可配置 disabled
 */
import React from 'react';
import ReactDOM from 'react-dom';

import {
  Button
} from 'antd';

import moment from 'moment';


import '../../theme/index.less';

import EditableTableSection, { EditableTable } from '../../components/editableTable';

const fileDownloadPath = 'http://oyc0y0ksm.bkt.clouddn.com/';
const dateFormat = 'YYYY-MM-DD';

// table head
const columns = [
  {
    title: '文字',
    dataIndex: 'poem',
  }, {
    title: '数字',
    dataIndex: 'money',
    validateType: 'number'
  }, {
    title: '选择',
    dataIndex: 'choice'
  }, {
    title: '日期',
    dataIndex: 'day',
  }, {
    title: '文件',
    dataIndex: 'file',
    width: 120,
  }, {
    title: '操作',
    dataIndex: 'operation',
    width: 160
  }
];

const dataSource = [
  {
    tableId: 100,
    poem: 'my poem1',
    money: 100000,
    choice: true,
    day: new Date(),  // or 2017-11-11 00:00:00
    file: 'http://i.qiniu.com/x.png'
  }, {
    tableId: 101,
    poem: 'my poem2',
    money: 1000000,
    choice: false,
    day: '2017-11-11 00:00:00',
    // file: 'http://i.qiniu.com/y.txt'
  }
];

const options = [{
  value: '0',
  label: '否'
}, {
  value: '1',
  label: '是'
}];

/**
 * 格式化的数据模型
 */
const itemDataModel = {
  tableId: '',
  editable: true,  // 初始默认值
  poem: {
    cellType: 'text',
    value: '',
    disabled: false,  // 初始默认值
  },
  money: {
    cellType: 'number',
    value: '',
  }, 
  choice: {
    cellType: 'select',
    value: '0',  // 必须为字符串
    options: options 
  }, 
  day: {
    cellType: 'datepicker',
    value: new Date(),
  },
  file: {
    cellType: 'file',
    value: []
  }
}

/**
 * 
 */
class EditableTableDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      dataSource: [], //
    }

    this.getData = this.getData.bind(this);
  }

  componentDidMount() {
    // load dataSource
    this.getData().then(res => {
      this.setState({
        loading: false,
        dataSource: res.data
      })
    })
  }

  /**
   * 接口数据标准化
   */
  formateDataSource(dataSource) {

  }

  /**
   * 提交数据前进行数据序列化还原
   */
  serializeData(data) {

  }

  /**
   * fetch data from api and formateDataSource
   */
  getData() {
    // 处理接口数据，转化成组件标准
    var _dataSource = dataSource.map(data => {
      return {
        tableId: data.tableId,
        poem: {
          cellType: 'text',
          value: data.poem || '',
        },
        money: {
          cellType: 'number',
          value: data.money || '',
        }, 
        choice: {
          cellType: 'select',
          value: data.choice === true ? '1' : '0',  // 必须为字符串
          options: options 
        }, 
        day: {
          cellType: 'datepicker',
          value: (data.day && moment(data.day).format(dateFormat)) || moment(new Date()).format(dateFormat),
        },
        file: {
          cellType: 'file',
          value: data.file ? [{
            uid: -1,
            name: 'file',
            url: data.file,
          }] : []
        }
      }
    });

    return Promise.resolve({
      data: _dataSource
    });
  }

  /**
   * before save or update, serializeData
   * process result and return to EditableTable Component
   */
  saveAdd(record) {
    // 处理record数据，转化成接口标准
    return Promise.resolve({
      code: 0,
      tableId: '1000',
      msg: 'success'
    })
  }

  /**
   * before save or update, serializeData
   * process result and return to EditableTable Component
   */
  saveUpdate(record) {
    // 处理record数据，转化成接口标准
    return Promise.resolve({
      code: 0,
      msg: 'success'
    });
  }

  deleteItem(tableId) {
    return Promise.resolve({
      code: 0,
      msg: 'success'
    });
  }

  // 添加查看功能，逻辑
  openThirdEye(record) {
    console.log('openThirdEye-------', record)
  }

  /**
   * CustomerBtn
   * 添加自定义配置
   */

  render() {
    return (
      <EditableTableSection
        title="测试"
        columns={columns}
        dataSource={this.state.dataSource}
        onDelete={this.deleteItem.bind(this)}
        onSaveAdd={this.saveAdd.bind(this)}
        onSaveUpdate={this.saveUpdate.bind(this)}
        onThirdEye={this.openThirdEye.bind(this)}
        CustomerBtn={(record) => <a>link</a>}
        itemDataModel={itemDataModel}
        pagination={true}
        loading={this.state.loading} />
    )
  }
}

ReactDOM.render(<EditableTableDemo />, document.getElementById('root'));