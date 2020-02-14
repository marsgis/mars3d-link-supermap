//系统 主入口

var viewer; //地球对象

var request; //url传入的参数

//地图
$(document).ready(function () {
    if (!mars3d.util.webglreport()) {
        toastr.error('系统检测到您当前使用的浏览器WebGL功能无效');
        layer.open({
            type: 1,
            title: "当前浏览器WebGL功能无效",
            skin: "layer-mars-dialog animation-scale-up",
            resize: false,
            area: ['600px', '200px'], //宽高
            content: '<div style="margin: 20px;"><h3>系统检测到您使用的浏览器WebGL功能无效！</h3>  <p>1、请您检查浏览器版本，安装使用最新版chrome、火狐或IE11以上浏览器！</p> <p>2、WebGL支持取决于GPU支持，请保证客户端电脑已安装最新显卡驱动程序！</p><p>3、如果上两步骤没有解决问题，说明您的电脑需要更换了！</p></div>'
        });
    }

    //记录url传入参数
    request = haoutil.system.getRequest();
    if(window.top){//有父级
        request = haoutil.system.getRequest(window.top);
    }


    initUI();
    initMap()
});

function removeMask() {
    $("#mask").remove();
}


//初始化地图
function initMap(Cesium) {
    request = haoutil.system.getRequest();

    var configfile = "config/config.json"; //默认地址
    if (request.config)//url传入地址
        configfile = request.config;

    haoutil.loading.show();

    $.ajax({
        type: "get",
        dataType: "json",
        url: configfile,
        timeout: 0,
        success: function (data) {
            haoutil.loading.hide();
            setTimeout(removeMask, 3000);      //欢迎UI关闭处理


            //构造地球
            viewer = mars3d.createMap({
                id: 'cesiumContainer',
                data: data.map3d,
                serverURL: data.serverURL,
                //infoBox: false,     //是否显示点击要素之后显示的信息  【也可以在config.json中配置】  
                //sceneMode: Cesium.SceneMode.SCENE2D,  
            });


            //如果有xyz传参，进行定位 
            if (haoutil.isutil.isNotNull(request.x)
                && haoutil.isutil.isNotNull(request.y)) {
                viewer.mars.centerAt(request, { duration: 0, isWgs84: true });
            }

            //开场动画[超图版本不能开启这行代码]
            // viewer.mars.openFlyAnimation();

            initWidget(viewer); //构造widget

            initWork(viewer); //项目的其他事项

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            haoutil.loading.hide();
            haoutil.alert(configfile + "文件加载失败！");
        }
    });

}


//初始化widget相关
function initWidget(viewer) {
    haoutil.loading.show();

    $.ajax({
        type: "get",
        dataType: "json",
        url: "config/widget.json",
        timeout: 0,
        success: function (widgetCfg) {
            haoutil.loading.hide();

            //url如果有传参时的处理
            if (haoutil.isutil.isNotNull(request.widget)) {
                if (request.onlyStart) widgetCfg.widgetsAtStart = [];
                widgetCfg.widgetsAtStart.push({
                    uri: request.widget,
                    name: request.name || "",
                    windowOptions: {
                        closeBtn: !request.onlyStart,
                    },
                    request: request
                });
            }

            //初始化widget管理器
            mars3d.widget.init(viewer, widgetCfg); //tip: 此方法有第3个参数支持定义父目录。

            if(lastWidgetItem){
                activateWidget(lastWidgetItem);
                lastWidgetItem = null;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            haoutil.loading.hide();
            haoutil.alert("config/widget.json文件加载失败！");
        }
    });
}




//UI界面相关
function initUI() {
    haoutil.oneMsg('首次访问系统无缓存会略慢，请耐心等待！', 'load3d_tip');


}


//当前页面业务相关
function initWork(viewer) {
    haoutil.oneMsg('如果未出现地球，是因为地形加载失败，请刷新重新加载！', 'terrain_tip');




    // 禁用默认的实体双击动作。
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //鼠标滚轮放大的步长参数
    viewer.scene.screenSpaceCameraController._zoomFactor = 1.5;

    //webgl渲染失败后，刷新页面
    //viewer.scene.renderError.addEventListener(function (scene, error) {
    //    window.location.reload();
    //});


    //移动设备上禁掉以下几个选项，可以相对更加流畅
    if (!haoutil.system.isPCBroswer()) {
        viewer.targetFrameRate = 20;        //限制帧率
        viewer.requestRenderMode = true;    //取消实时渲染
        viewer.scene.fog.enable = false;
        viewer.scene.skyAtmosphere.show = false;
        viewer.scene.fxaa = false;
    }

    //IE浏览器优化
    if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 0) {
        viewer.targetFrameRate = 20;        //限制帧率
        viewer.requestRenderMode = true;    //取消实时渲染
    }


    //二三维切换不用动画
    if (viewer.sceneModePicker)
        viewer.sceneModePicker.viewModel.duration = 0.0;

    //设置操作习惯,更换中键和右键 
    //viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    //    Cesium.CameraEventType.RIGHT_DRAG, Cesium.CameraEventType.PINCH,
    //    { eventType: Cesium.CameraEventType.LEFT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL },
    //    { eventType: Cesium.CameraEventType.RIGHT_DRAG, modifier: Cesium.KeyboardEventModifier.CTRL }
    //];
    //viewer.scene.screenSpaceCameraController.zoomEventTypes = [Cesium.CameraEventType.MIDDLE_DRAG, Cesium.CameraEventType.WHEEL, Cesium.CameraEventType.PINCH];


    bindShowTilesParts();
    navigationHelpButtonCHE()
}



//bim构件的处理
function bindShowTilesParts() {
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (event) {
        var pickedObject = viewer.scene.pick(event.position);
        if (pickedObject && Cesium.defined(pickedObject.primitive) &&
            pickedObject.primitive._config && pickedObject.primitive._config.scenetree) {
            var tilesParts = 'widgetsTS/tilesParts/widget.js';

            if (mars3d.widget.isActivate(tilesParts)) {
                var parts = mars3d.widget.getClass(tilesParts);
                if (parts.config.layerCfg == pickedObject.primitive._config)
                    return;//当前已激活,并且单击了相同模型时跳出
            }

            mars3d.widget.activate({
                name: pickedObject.primitive._config.name + " 构件",
                uri: tilesParts,
                layerCfg: pickedObject.primitive._config,
                disableOther: false
            });
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}


//绑定图层管理有2种添加方式
/**
    第1种是框架支持的配置信息的，按照下面方式添加
    var json = {
        "name": "自定义绑定图层",
        "type": "wms",
        "url": "http://data.marsgis.cn/geoserver/mars/wms",
        "layers": "mars:hfjy",
        "crs": "EPSG:4326",
        "parameters": {
            "transparent": "true",
            "format": "image/png"
        },
        "showClickFeature": true,
        "center": { "y": 31.743214, "x": 117.277097, "z": 47197.7, "heading": 0.3, "pitch": -78.8, "roll": 360 },
        "popup": "名称：{项目名称}<br />类型：{设施类型}<br />面积：{用地面积}亩<br />位置：{具体位置}",
        "visible": true,
        "flyTo": true
    };
    var layer = mars3d.layer.createLayer(json, viewer);
    bindToLayerControl(layer);
**/

/** 第2种是完全自定义的，在回调方法中写自己相关代码，可参考widgetsTS\qyPoint\widgts.js代码
bindToLayerControl({
    pid: 30,
    name: '企业',
    mydata:null, //自行赋值
    visible: true,
    onAdd: function () {//显示回调
        //这里把数据this.mydata添加到地图上  
    },
    onRemove: function () {//隐藏回调
        //这里把数据this.mydata从地图上移除 
       
    },
    onCenterAt: function (duration) {//定位回调
      
    },
});
**/

//绑定图层管理
function bindToLayerControl(options) {
    var layer = viewer.mars.addOperationalLayer(options);

    var manageLayersWidget = mars3d.widget.getClass('widgets/manageLayers/widget.js');
    if (manageLayersWidget) {
        manageLayersWidget.addOverlay(options);
    }
    return layer;
}

//取消绑定图层管理 ， 参数为bindToLayerControl返回的图层
function unbindLayerControl(layer) {
    viewer.mars.removeOperationalLayer(layer.config.id);

    var manageLayersWidget = mars3d.widget.getClass('widgets/manageLayers/widget.js');
    if (manageLayersWidget) {
        manageLayersWidget.removeLayer(layer.config.name);
    }
}

//外部页面调用
var lastWidgetItem
function activateWidget(item) { 
    if(!viewer){ 
        lastWidgetItem = item;
        return;
    }
    mars3d.widget.activate(item);
}
function disableWidget(item) {
    mars3d.widget.disable(item);
}
function activateFunByMenu(fun) {
    eval(fun);
}


function goHome() {
    mars3d.widget.disableAll()
    viewer.mars.centerAt();
}




//
function navigationHelpButtonCHE() {
    //汉化帮助信息
    if (viewer.sceneModePicker) {
        viewer.sceneModePicker.viewModel.tooltip3D = "三维";
        viewer.sceneModePicker.viewModel.tooltip2D = "二维";
        viewer.sceneModePicker.viewModel.tooltipColumbusView = "哥伦布视图";
    }
    if (viewer.navigationHelpButton) {
        viewer.navigationHelpButton.viewModel.tooltip = "操作指南";
        var clickHelper = viewer.navigationHelpButton.container.getElementsByClassName("cesium-click-navigation-help")[0];
        var touchHelper = viewer.navigationHelpButton.container.getElementsByClassName("cesium-touch-navigation-help")[0];

        var button = viewer.navigationHelpButton.container.getElementsByClassName("cesium-navigation-button-right")[0];
        button.innerHTML = button.innerHTML.replace(">Touch", ">触摸");
        button = viewer.navigationHelpButton.container.getElementsByClassName("cesium-navigation-button-left")[0];
        button.innerHTML = button.innerHTML.replace(">Mouse", ">鼠标");

        var click_help_pan = clickHelper.getElementsByClassName("cesium-navigation-help-pan")[0];
        click_help_pan.innerHTML = "平移";
        var click_help_pan_details = click_help_pan.parentNode.getElementsByClassName("cesium-navigation-help-details")[0];
        click_help_pan_details.innerHTML = "按下左键 + 拖动";

        var click_help_zoom = clickHelper.getElementsByClassName("cesium-navigation-help-zoom")[0];
        click_help_zoom.innerHTML = "旋转";
        click_help_zoom.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "按下右键+拖动";
        click_help_zoom.parentNode.getElementsByClassName("cesium-navigation-help-details")[1].innerHTML = "";

        var click_help_rotate = clickHelper.getElementsByClassName("cesium-navigation-help-rotate")[0];
        click_help_rotate.innerHTML = "缩放";
        click_help_rotate.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "滚动鼠标滚轮";
        click_help_rotate.parentNode.getElementsByClassName("cesium-navigation-help-details")[1].innerHTML = "";
        //触屏操作
        var touch_help_pan = touchHelper.getElementsByClassName("cesium-navigation-help-pan")[0];
        touch_help_pan.innerHTML = "平移";
        touch_help_pan.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "单指拖动";

        var touch_help_zoom = touchHelper.getElementsByClassName("cesium-navigation-help-zoom")[0];
        touch_help_zoom.innerHTML = "缩放";
        touch_help_zoom.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "双指捏合";

        var touch_help_tilt = touchHelper.getElementsByClassName("cesium-navigation-help-rotate")[0];
        touch_help_tilt.innerHTML = "俯仰";
        touch_help_tilt.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "双指同向拖动";

        var touch_help_rotate = touchHelper.getElementsByClassName("cesium-navigation-help-tilt")[0];
        touch_help_rotate.innerHTML = "旋转";
        touch_help_rotate.parentNode.getElementsByClassName("cesium-navigation-help-details")[0].innerHTML = "双指反向拖动";
    }

}
