/**
 * 数据校验规则
 */
const rules = {
  number: {
    reg: /^[0-9]+\.{0,1}[0-9]{0,6}$/, // 1.999999
    msg: '请输入正确的数字'
  },
  onlyNum: {
    reg: /^[0-9]*$/,
    msg: '请输入纯数字'
  }
}


export default rules;