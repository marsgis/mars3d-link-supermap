(function (window, mars3d) {
    //创建widget类，需要继承BaseWidget
    class MyWidget extends mars3d.widget.BaseWidget {
        //弹窗配置
        get view() {
            return {
                type: "append",
                url: "view.html",
                parent: ".cesium-viewer-toolbar"
            }
        }


        //初始化[仅执行1次]
        create() {

        }
        //每个窗口创建完成后调用
        winCreateOK(opt, result) {
            //此处可以绑定页面dom事件

            //修改当前插件中按钮顺序到home按钮后面
            $(".cesium-home-button").after($(opt._dom));

            //修改导航球
            var height = $(".cesium-viewer-toolbar").height() + 40;
            $(".compass").css({ "bottom": height + "px" });

            //工具按钮菜单事件 
            var zoomIn = new mars3d.ZoomNavigation(this.viewer, true);
            $("#btn-zommIn").click(function () {
                zoomIn.activate();
            });

            var zoomOut = new mars3d.ZoomNavigation(this.viewer, false);
            $("#btn-ZoomOut").click(function () {
                zoomOut.activate();
            });

        }
        //激活插件
        activate() {

        }
        //释放插件
        disable() {

        }
 
    }


    //注册到widget管理器中。
    mars3d.widget.bindClass(MyWidget);

    //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d) 