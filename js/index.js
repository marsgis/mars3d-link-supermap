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
    if (window.top) {//有父级
        request = $.extend(request, haoutil.system.getRequest(window.top));
    }


    initUI();
    initMap();
});

function removeMask() {
    $("#mask").remove();
}


//初始化地图
function initMap() {
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

            //汉化原生cesium
            mars3d.loadCesiumZH();

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
                viewer.mars.centerAtHome({ duration: 0 });
            }

            //初始化widget管理器
            mars3d.widget.init(viewer, widgetCfg); //tip: 此方法有第3个参数支持定义父目录。 
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            haoutil.loading.hide();
            haoutil.alert("config/widget.json文件加载失败！");
        }
    });

    //widget相关事件监听
    // mars3d.widget.on(mars3d.widget.event.load, function (event) {
    //     console.log("引入加载了widget的js", event);
    // })
    // mars3d.widget.on(mars3d.widget.event.created, function (event) {
    //     console.log("创建了widet", event);
    // })
    mars3d.widget.on(mars3d.widget.event.activated, function (event) {
        console.log("激活了widget", event);
    })
    // mars3d.widget.on(mars3d.widget.event.disabled, function (event) {
    //     console.log("释放了widget", event);
    // })

}




//UI界面相关
function initUI() {
    haoutil.oneMsg('首次访问系统无缓存会略慢，请耐心等待！', 'load3d_tip');


}


//当前页面业务相关
function initWork(viewer) {
    haoutil.oneMsg('如果未出现地球，是因为地形加载失败，请刷新重新加载！', 'terrain_tip');


    //针对不同终端的优化配置
    if (haoutil.system.isPCBroswer()) {
        // Cesium 1.61以后会默认关闭反走样，对于桌面端而言还是开启得好，
        viewer.scene.postProcessStages.fxaa.enabled = true;

        //鼠标滚轮放大的步长参数
        viewer.scene.screenSpaceCameraController._zoomFactor = 2.0;

        //IE浏览器优化
        if (window.navigator.userAgent.toLowerCase().indexOf("msie") >= 0) {
            viewer.targetFrameRate = 20;        //限制帧率
            viewer.requestRenderMode = true;    //取消实时渲染
        }

    }
    else {
        //鼠标滚轮放大的步长参数
        viewer.scene.screenSpaceCameraController._zoomFactor = 5.0;

        //移动设备上禁掉以下几个选项，可以相对更加流畅 
        viewer.requestRenderMode = true;    //取消实时渲染
        viewer.scene.fog.enable = false;
        viewer.scene.skyAtmosphere.show = false;
        viewer.scene.globe.showGroundAtmosphere = false;
    }

    // 禁用默认的实体双击动作。
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //二三维切换不用动画
    if (viewer.sceneModePicker)
        viewer.sceneModePicker.viewModel.duration = 0.0;

    //webgl渲染失败后，刷新页面
    //viewer.scene.renderError.addEventListener(function (scene, error) {
    //    window.location.reload();
    //});


    //测试拾取s3m模型
    // var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    // handler.setInputAction(event => {
    //     var pickedObject = viewer.scene.pick(event.position, 5, 5);
    //     if (pickedObject && pickedObject.primitive && pickedObject.primitive.isS3M) {
    //         var s3mLayer = pickedObject.primitive //拾取到的s3m图层
    //         debugger
    //     }
    // }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

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
    var layer = mars3d.layer.createLayer(viewer,json);
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
    if (!layer) return

    var manageLayersWidget = mars3d.widget.getClass('widgets/manageLayers/widget.js');
    if (manageLayersWidget) {
        manageLayersWidget.addOverlay(layer.config);
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
