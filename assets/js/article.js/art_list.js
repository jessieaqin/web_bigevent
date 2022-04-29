$(function () {
    let layer = layui.layer
    let form = layui.form
    var laypage = layui.laypage;


    // 定义美化时间的过滤器

    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        let y = dt.getFullYear()
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss


    }

    // 定义补零的函数 padZero
    function padZero(n) {
        return n < 10 ? '0' + n : n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    initTable()
    initCate()


    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }


    //定义 initCate函数   初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // console.log(res);
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }
    //为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 获取表单中选中项的值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })
    //定义渲染分页的 renderPage 方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox'  // 分页容器的 Id
            , count: total // 总数据条数
            , limit: q.pagesize // 每页显示几条数据
            , curr: q.pagenum // 设置默认被选中的分页
            , layout: ['count', 'limit', 'prev', 'page', 'next', 'skip']
            , limits: [2, 3, 5, 10]
            //分页切换的时候，触发jump回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            , jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                //console.log(first)
                //console.log(obj.curr)
                //--------------------------------------------
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // 为查询参数对象 q 中对应的属性赋值
                q.pagenum = obj.curr
                // console.log(obj.limit); //得到每页显示的条数
                q.pagesize = obj.limit

                if (!first) {
                    initTable()
                }

                // initTable()
            }
        });
    }

    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        let len = $('.btn-delete').length
        let id = $(this).attr('data-id')
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status != 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    //如果没有剩余的数据 就让页码值 -1 之后再调用 initTable方法
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    }
                    initTable()

                }
            })
            layer.close(index);
        });

    })
    $('tbody').on('click', '#btn-edit', function () {
        let id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章详情失败')
                }
                // console.log(res.data);
                window.parent.cateId = res.data
                location.href = "/article/art_rev.html"
            }

        })

    })



})

