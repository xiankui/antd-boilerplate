/**
 * rcsearchform
 */
import React from 'react';
import ReactDOM from 'react-dom';

import RcSearchForm from '../../components/rcsearchform';


// RcSearchForm datablob
const rcsearchformData = {
  colspan: 2,
  fields: [{
    type: 'input',
    label: '关键字',
    name: 'keyword',
    placeholder: '会员姓名或电话'
  }, {
    type: 'select',
    label: '所属部门',
    name: 'departmentId',
    options: [{
      label: '大部门',
      value: '0'  // 必须为字符串
    }, {
      label: '小部门',
      value: '1'
    }],
    placeholder: '请选择会员所属部门'
  }]
};

class RcSearchFormDemo extends React.Component {
  constructor(props) {
    super(props);
  }

  handleFormSearch(values) {
    // values: {keyword: '', departmentId: ''}
  }

  render() {
    return (
      <div>
        <RcSearchForm {...rcsearchformData} 
          handleSearch={this.handleFormSearch.bind(this)} />
      </div>
    )
  }
}

ReactDOM.render(<RcSearchFormDemo />, document.getElementById('root'));