/**
 * utils for app
 */

export function getLocQueryByLabel (label) {
  var searchstr = window.location.search.slice(1);
  var qsArr = searchstr.split('&');
  var qsJson = {};

  var len = qsArr.length,
      i = 0,
      item = [];

  for (i; i<len; i++) {
    item = qsArr[i].split('=');
    qsJson[item[0]] = item[1]; 
  }

  return qsJson[label];
}

/**
 * Toast
 */
export function MyToast (info, timeout=1000) {
  var toast = document.createElement('div');
  toast.setAttribute('class', 'yzy-toast');

  var p = document.createElement('p');
  p.setAttribute('class', 'yzy-toast-info');

  var text = document.createTextNode(info);

  p.appendChild(text);
  toast.appendChild(p);

  document.body.appendChild(toast);

  setTimeout(function () {
    toast.remove();
  }, timeout)

}


/**
 * 数据字段转换
 * @param [object Array]
 *     tableId  =>  value
 *     theName  =>  label
 * @return [object Array]
 */
export function convertObjectLabel(source, valueProp='tableId', labelProp='theName') {
  var dest = [];

  if (!source || source.length === 0) {
    return dest;
  }

  var len = source.length,
      i;
  for (i=0; i<len; i++) {
    let newItem = {
      value: source[i][valueProp] + '',
      label: source[i][labelProp] + ''
    };

    dest.push(newItem);
  }

  return dest;
}

/**
 * @props value
 * @props options 
 * @return label
 */
export function getLabelFromOptions(value, options) {
  var label = '';

  for (var i=0, len=options.length; i<len; i++) {
    if (options[i].value === value) {
      label = options[i].label;
      break;
    }
  }

  return label;  
}

/**
 * 数组切割
 * @props arr      [{id: '001'}, {id: '002'}]
 * @props rowKey   id
 * @props key      001
 * @return newArr  [{id: '002'}]
 */
export function getSlicedObjectArray(arr, rowKey, key) {
  var newArr = [];

  arr.map(item => {
    if (item[rowKey] !== key) {
      newArr.push(item)
    }
  });

  return newArr;
}