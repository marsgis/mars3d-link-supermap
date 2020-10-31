(function (window, mars3d) {
    //创建widget类，需要继承BaseWidget
    class MyWidget extends mars3d.widget.BaseWidget {
        //弹窗配置
        get view() {
            return {
                type: "window",
                url: "view.html",
                windowOptions: {
                    width: 310,
                    height: 530
                }
            }
        }


        //初始化[仅执行1次]
        create() {
            this.measure = new mars3d.analysi.Measure({
                viewer: this.viewer,
                label: {//可设置文本样式 
                    "background": false,
                }
            })
            this.measure.on(mars3d.analysi.Measure.event.change, (e) => {
                this.viewWindow.onMeasureChange(e);
            });
            this.measure.on(mars3d.analysi.Measure.event.start, (e) => {//开始分析前回调(异步)
                haoutil.loading.show();
            });
            this.measure.on(mars3d.analysi.Measure.event.end, (e) => {//分析完成后回调(异步)
                haoutil.loading.hide();
                if (e.mtype == "section") {
                    this.showSectionChars(e);
                }
                this.viewWindow.onMeasureEnd(e);
            });
        }
        //每个窗口创建完成后调用
        winCreateOK(opt, result) {
            this.viewWindow = result;
        }
        //激活插件
        activate() {

        }
        //释放插件
        disable() {
            this.viewWindow = null;
            this.clearDraw();
        }
        clearDraw() {
            this.measure.clear();
            mars3d.widget.disable('widgets/measureChars/widget.js');
        }
        showSectionChars(data) {
            mars3d.widget.activate({
                uri: 'widgets/measureChars/widget.js',
                data: data
            });
        }
        changeOnlyPickModel(value) {
            //控制鼠标只取模型上的点，忽略地形上的点的拾取
            viewer.mars.onlyPickModelPosition = value
        }


    }


    //注册到widget管理器中。
    mars3d.widget.bindClass(MyWidget);

    //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)

