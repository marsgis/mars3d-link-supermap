(function (window, mars3d) {
  //创建widget类，需要继承BaseWidget
  class MyWidget extends mars3d.widget.BaseWidget {
    //初始化[仅执行1次]
    create() {
      this.zommControl = new mars3d.control.ToolButton({
        title: "图层控制",
        icon: "fa fa-tasks",
        insertIndex: 1, //插入的位置顺序, 1是home按钮后面
        click: (event) => {
          mars3d.widget.activate({
            name: event.title,
            uri: "widgets/manageLayers/widget.js",
          });
        },
      });
      this.map.addControl(this.zommControl);
    }
    //激活插件
    activate() {}
    //释放插件
    disable() {}
  }

  //注册到widget管理器中。
  mars3d.widget.bindClass(MyWidget);

  //每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d);
