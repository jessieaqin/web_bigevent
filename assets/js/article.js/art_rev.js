$(function () {

    let layer = layui.layer
    let form = layui.form



    var rdata = JSON.parse(JSON.stringify(window.parent.cateId));
    // console.log(data);

    // form.val('form-revise', data)
    let data = window.parent.cateId
    let id = data.Id
    // console.log(id);

    //获取编辑文章的id数据
    $.ajax({
        method: 'GET',
        url: '/my/article/' + id,
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('获取文章信息失败')
            }
            form.val('form-revise', rdata)
            console.log(res);
            $('#image').attr('src', 'http://www.liulongbin.top:3007' + res.data.cover_img)

        }
    })


    //    // console.log(data);
    //     initCate()
    // 初始化富文本编辑器
    initEditor()


    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                //console.log(res);
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-table', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()

            }
        })
    }
    // 1. 初始化图片裁剪器
    let $image = $('#image')
    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件，获取用户选择的文件列表
    $('#coverFile').on('change', function (e) {
        //console.log(e.target.flies);
        // 获取到文件的列表数组
        let filelist = e.target.files

        // 判断用户是否选择了文件
        if (filelist.length === 0) {
            return layer.msg('请选择一张照片！')
        }
        // 根据文件，创建对应的 URL 地址
        let newImageURL = URL.createObjectURL(filelist[0])

        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy')// 销毁旧的裁剪区域
            .attr('src', newImageURL)// 重新设置图片路径
            .cropper(options)// 重新初始化裁剪区域
    })

    let art_state = '已发布'

    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    //为表单绑定 submit 提交事件
    $('#form-pub').on('submit', function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault()


        //2. 基于 form 表单，快速创建一个 FormData 对象
        let fd = new FormData($(this)[0])
        // 3. 将文章的发布状态，存到 fd 中
        fd.append('state', art_state)

        // fd.forEach(function (v, k) {
        //     console.log(v, k);

        // })

        // 4. 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                publishArticle(fd)

                //定义一个修改文章的方法： 
                function publishArticle(fd) {
                    $.ajax({
                        method: 'POST',
                        url: '/my/article/add',
                        data: fd,
                        // 注意：如果向服务器提交的是 FormData 格式的数据，
                        // 必须添加以下两个配置项
                        contentType: false,
                        processData: false,
                        success: function (res) {
                            if (res.status !== 0) {
                                return layer.msg('发布文章失败！')
                            }
                            layer.msg('发布文章成功！')
                            // console.log(res);
                            location.href = '/article/art_list.html'
                        }
                    })
                }
            })
    })



})