//调用函数getUserInfo获取用户信息
$(function () {
    //调用函数getUserInfo获取用户信息
    getUserInfo();
    let layer = layui.layer

    //点击按钮，实现退出功能 btnLogout
    //提示用户是否确认退出
    $('#btnLogout').on('click', function () {
        // var layer = layui.layer
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {
            // console.log('ok');
            //1.情况本地存储中的token
            localStorage.removeItem('token')
            //2.重新跳转到登录页面
            location.href = '/home/login.html'
            //关闭confirm询问框
            layer.close(index);
        });
    })
})


// var layer = layui.layer
function getUserInfo() {
    //获取用户的基本信息
    $.ajax({
        method: 'get',
        url: '/my/userinfo',
        // //headers就是请求头
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }
            // console.log(res);
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
    })
}
function renderAvatar(user) {
    // 1.获取用户的名称
    var name = user.nickname || user.username
    //console.log(name);
    //2.设置欢迎的文本
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
    //3.按需渲染用户的头像
    if (user.user_pic !== null) {
        //3.1 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //3.2渲染文字头像
        $('.text-avatar').html(name[0].toUpperCase()).show()
        $('.layui-nav-img').hide()


    }

}


