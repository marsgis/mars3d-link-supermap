/* 2017-11-30 16:56:24 | 修改 muyao */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
	options: {
		//弹窗
		view: {
			type: "window",
			url: "view.html",
			windowOptions: {
				width: 280,
				height: 130
			}
		},
	},
	measureControl: null,
	//初始化[仅执行1次]
	create: function () {
        
		//初始化测量距离
		handlerDis = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Distance, 0);
		//注册测距功能事件
		handlerDis.measureEvt.addEventListener(function(result) {
			var distance = result.distance > 1000 ? (result.distance / 1000) + 'km' : result.distance + 'm';
			handlerDis.disLabel.text = '距离:' + distance;
			handlerDis.disLabel.outlineColor = new Cesium.Color(0, 0, 1);
			handlerDis.disLabel.font = '100 20px sans-serif';
			handlerDis.disLabel.outlineWidth = 5;
		});
		handlerDis.activeEvt.addEventListener(function(isActive) {
			if(isActive == true) {
				viewer.enableCursorStyle = false;
				viewer._element.style.cursor = '';
				$('body').removeClass('measureCur').addClass('measureCur');
			} else {
				viewer.enableCursorStyle = true;
				$('body').removeClass('measureCur');
			}
		});

		//初始化测量面积
		handlerArea = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Area, 0);
		handlerArea.measureEvt.addEventListener(function(result) {
			var area = result.area > 1000000 ? result.area / 1000000 + 'km²' : result.area + '㎡'
			handlerArea.areaLabel.text = '面积:' + area;
			handlerArea.areaLabel.outlineColor = new Cesium.Color(0, 0, 1);
			handlerArea.areaLabel.font = '100 20px sans-serif';
			handlerArea.areaLabel.outlineWidth = 5.0;
		});
		handlerArea.activeEvt.addEventListener(function(isActive) {
			if(isActive == true) {
				viewer.enableCursorStyle = false;
				viewer._element.style.cursor = '';
				$('body').removeClass('measureCur').addClass('measureCur');
			} else {
				viewer.enableCursorStyle = true;
				$('body').removeClass('measureCur');
			}
		});

		//初始化测量高度
		handlerHeight = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.DVH);
		handlerHeight.measureEvt.addEventListener(function(result) {
			var distance = result.distance > 1000 ? (result.distance / 1000).toFixed(2) + 'km' : result.distance + 'm';
			var vHeight = result.verticalHeight > 1000 ? (result.verticalHeight / 1000).toFixed(2) + 'km' : result.verticalHeight + 'm';
			var hDistance = result.horizontalDistance > 1000 ? (result.horizontalDistance / 1000).toFixed(2) + 'km' : result.horizontalDistance + 'm';
			handlerHeight.disLabel.text = '空间距离:' + distance;
			handlerHeight.disLabel.outlineColor = new Cesium.Color(0, 0, 1);
			handlerHeight.disLabel.font = '100 20px sans-serif';
			handlerHeight.disLabel.outlineWidth = 5.0;
			handlerHeight.vLabel.text = '垂直高度:' + vHeight;
			handlerHeight.vLabel.outlineColor = new Cesium.Color(0, 0, 1);
			handlerHeight.vLabel.font = '100 20px sans-serif';
			handlerHeight.vLabel.outlineWidth = 5.0;
			handlerHeight.hLabel.text = '水平距离:' + hDistance;
			handlerHeight.hLabel.outlineColor = new Cesium.Color(0, 0, 1);
			handlerHeight.hLabel.font = '100 20px sans-serif';
			handlerHeight.hLabel.outlineWidth = 5.0;
		});
		handlerHeight.activeEvt.addEventListener(function(isActive) {
			if(isActive == true) {
				viewer.enableCursorStyle = false;
				viewer._element.style.cursor = '';
				$('body').removeClass('measureCur').addClass('measureCur');
			} else {
				viewer.enableCursorStyle = true;
				$('body').removeClass('measureCur');
			}
		});
	},
	viewWindow: null,
	//每个窗口创建完成后调用
	winCreateOK: function (opt, result) {
	    this.viewWindow = result;
	},
	//激活插件
	activate: function() {

	},
	//释放插件
	disable: function() {
		this.clearDraw();
	},
	drawPolyline: function(options) {
		this.clearAll();
		this.deactiveAll();
		handlerDis && handlerDis.activate();
	},
	drawPolygon: function(options) {
		this.clearAll();
		this.deactiveAll();
		handlerArea && handlerArea.activate();
	},
	drawHeight: function(options) {
		this.clearAll();
		this.deactiveAll();
		handlerHeight && handlerHeight.activate();
	},
	updateUnit: function(thisType, danwei) {
		this.measureControl.updateUnit(thisType, danwei);
	},
	clearDraw: function() {
		handlerDis && handlerDis.clear();
		handlerArea && handlerArea.clear();
		handlerHeight && handlerHeight.clear();
	},
	formatArea: function(val, unit) {
		return this.measureControl.formatArea(val, unit);
	},
	formatLength: function(val, unit) {
		return this.measureControl.formatLength(val, unit);
	},
	clearAll: function() {
		handlerDis && handlerDis.clear();
		handlerArea && handlerArea.clear();
		handlerHeight && handlerHeight.clear();
	},
	deactiveAll: function() {
		handlerDis && handlerDis.deactivate();
		handlerArea && handlerArea.deactivate();
		handlerHeight && handlerHeight.deactivate();
	}
}));