/************************
 * 接口
 ************************/
import axios from 'axios';


const instance = axios.create({

    //`baseURL`如果`url`不是绝对地址，那么将会加在其前面。
    //当axios使用相对地址时这个设置非常方便
    //在其实例中的方法
    baseURL:'http://some-domain.com/api/',


    //`headers`是自定义的要被发送的头信息
    headers:{'X-Requested-with':'XMLHttpRequest'},

    //`timeout`定义请求的时间，单位是毫秒。
    //如果请求的时间超过这个设定时间，请求将会停止。
    timeout:1000,
    
    //`withCredentials`表明是否跨网站访问协议，
    //应该使用证书
    withCredentials:false //默认值

    //`responsetype`表明服务器返回的数据类型，这些类型的设置应该是
    //'arraybuffer','blob','document','json','text',stream'
    responsetype:'json',
});

/**
 * 统一过滤重复请求
 * http://www.jianshu.com/p/4445595488e2
 */
let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken;

let removePending = (config) => {
  for(let p in pending){
    if(pending[p].u === config.url + '&' + config.method + '&' + JSON.stringify(config.params || {})) { //当当前请求在数组中存在时执行函数体
      pending[p].f(); //执行取消操作
      pending.splice(p, 1); //把这条记录从数组中移除
    }
  }
}

// 重复的请求进行拦截
let checkDuplicate = (config) => {
  let duplicate = false;

  for(let p in pending){
    if(pending[p].u === config.url + '&' + config.method + '&' + JSON.stringify(config.params || {})) { //当当前请求在数组中存在时执行函数体
      duplicate = true;
      break;
    } 
  }

  return duplicate;
}

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // console.log('interceptors config----', config)
  // Do something before request is sent
  // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
  let duplicate = checkDuplicate(config);

  if (duplicate === true) return null;

  config.cancelToken = new cancelToken((c)=>{
    // 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
    // pending.push({ u: config.url + '&' + config.method, f: c });  
    pending.push({ u: config.url + '&' + config.method + '&' + JSON.stringify(config.params || {}), f: c }); 
  });

  return config;
}, function (error) {
  // Do something with request error
  // return Promise.reject(error);
  return {
    data: {
      result: 'fail',
      info: '请求繁忙，请重新尝试！'
    }
  }
});

//添加响应拦截器
instance.interceptors.response.use(response=>{
    removePending(response.config);  //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
    return response;
 }, error => {
  // return { data: { } }; 返回一个空对象，主要是防止控制台报错
  // return Promise.reject(error);
  console.log('interceptors error----', error)
  return {
    data: {
      result: 'fail',
      info: '服务器繁忙，请重新尝试！'
    }
  }
});

export default instance;