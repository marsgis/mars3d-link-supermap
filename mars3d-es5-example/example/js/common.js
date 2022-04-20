"use script"; //开发环境建议开启严格模式

//判断webgl支持
if (!mars3d.Util.webglreport()) {
  mars3d.Util.webglerror();
}
//读取 config.json 配置文件
let configUrl = "../config/config.json";
mars3d.Util.fetchJson({ url: configUrl })
  .then(function (json) {
    //构建地图
    window.initMap(json.map3d);

    if (mars3d.widget && window.map) {
      initWidget(window.map);
    }

    //移除遮罩
    setTimeout(removeMask, 3000);
  })
  .catch(function (error) {
    console.log("加载JSON出错", error);
    removeMask();
    haoutil.alert(error && error.message, "出错了");
  });

//移除遮罩
function removeMask() {
  $("#mask").remove();
}

function openTipView(content, title) {
  window.layer.open({
    type: 1,
    title: title || "功能 和 已知问题 提示",
    offset: "rb",
    shade: false,
    skin: "layer-mars-dialog animation-scale-up",
    content: content,
  });
}

if ($("#tipView").length > 0) {
  openTipView($("#tipView"));
}

//初始化widget相关
function initWidget(map) {
  //初始化widget管理器
  mars3d.widget.init(map, {
    defaultOptions: {
      style: "dark",
      windowOptions: { skin: "layer-mars-dialog animation-scale-up", position: { bottom: 50, left: 10 } },
    },
    openAtStart: [
      {
        name: "右上角工具栏",
        uri: "widgets/toolButton/menuBtn.js",
      },
    ],
    widgets: [
      {
        name: "图层管理",
        uri: "widgets/manageLayers/widget.js",
        group: "forlayer",
        autoCenter: true,
        windowOptions: {
          position: { top: 10, bottom: 40, left: 50 },
        },
        autoDisable: false,
        disableOther: false,
      },
    ],
  });
}
