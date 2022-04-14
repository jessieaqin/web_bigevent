$.ajaxPrefilter(function (options) {
    console.log(options.url) // 获取出请求的地址
    //发起真正的Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://www.liulongbin.top:3007' + options.url
    console.log(options.url);
});
