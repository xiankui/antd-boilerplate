/**
 * RcSearchForm
 */

import React, { Component } from 'react';
import {
  Button,
  Icon,
  Row, 
  Col, 
  Input,
  Select,
  DatePicker,
  Form,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;


/**
 * @params colspan
 * @params fields
 * @params handleSearch
 */
class SearchForm extends Component {
  constructor(props) {
    super(props)
  }

  onFormSubmit(e) {
    e.preventDefault();
    const {
      form,
      handleSearch
    } = this.props;

    form.validateFields((err, values) => {
      if (err) return;

      handleSearch(values);
    })
  }

  render() {
    const {
      colspan=2,
      fields,
      handleSearch,
      form,
    } = this.props;

    const {
      getFieldDecorator,
      resetFields
    } = form;

    let labelColWidth = 24 / (colspan * 2);
    const formItemLayout =  {
      labelCol: { span: labelColWidth },
      wrapperCol: { span: (24 - labelColWidth) },
    };

    let itemWidth = parseInt(24 / colspan)
    var items = fields.map((item, i) => {
      if (item.type === 'input') {
        return (
          <Col span={itemWidth} key={i}>
            <FormItem label={item.label} {...formItemLayout}>
              {getFieldDecorator(item.name)(
                <Input placeholder={item.placeholder || item.label} />
              )}
            </FormItem>
          </Col>
        )
      }

      if (item.type === 'select') {
        return (
          <Col span={itemWidth} key={i}>
            <FormItem label={item.label} {...formItemLayout}>
              {getFieldDecorator(item.name, {
                initialValue: item.defaultValue || ''
              })(
                <Select placeholder={item.placeholder || item.label}>
                  {
                    item.options.map((opt, i) => (
                      <Option key={i} value={opt.value}>{opt.label}</Option>
                    ))
                  }
                </Select>
              )}
            </FormItem>
          </Col>
        )
      }

      if (item.type === 'picker') {
        return (
          <Col span={itemWidth} key={i}>
            <FormItem label={item.label} {...formItemLayout}>
              {getFieldDecorator(item.name)(
                <DatePicker style={{width: '100%'}}/>
              )}
            </FormItem>
          </Col>
        )
      }
      
    });


    return (
      <Form
        className="ant-advanced-search-form"
        onSubmit={this.onFormSubmit.bind(this)}>
        <Row gutter={40} style={{textAlign: 'right'}}>{items}</Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" htmlType="submit">搜索</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => resetFields()}>
              清除
            </Button>
          </Col>
        </Row>
      </Form>
    )

  }
}

const RcSearchForm = Form.create()(SearchForm);

export default RcSearchForm;