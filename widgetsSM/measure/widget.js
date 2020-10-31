(function (window, mars3d) {
	//创建widget类，需要继承BaseWidget
	class MyWidget extends mars3d.widget.BaseWidget { 
		//弹窗配置
		get view() {
			return {
				type: "window",
				url: "view.html",
				windowOptions: {
					width: 280,
					height: 130
				}
			}
		}


		//初始化[仅执行1次]
		create() { 
			//初始化测量距离
			var handlerDis = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Distance, 0);
			//注册测距功能事件
			handlerDis.measureEvt.addEventListener(function (result) {
				var distance = result.distance > 1000 ? (result.distance / 1000) + 'km' : result.distance + 'm';
				handlerDis.disLabel.text = '距离:' + distance;
				handlerDis.disLabel.outlineColor = new Cesium.Color(0, 0, 1);
				handlerDis.disLabel.font = '100 20px sans-serif';
				handlerDis.disLabel.outlineWidth = 5;
			});
			handlerDis.activeEvt.addEventListener(function (isActive) {
				if (isActive == true) {
					viewer.enableCursorStyle = false;
					viewer._element.style.cursor = '';
					$('body').removeClass('measureCur').addClass('measureCur');
				} else {
					viewer.enableCursorStyle = true;
					$('body').removeClass('measureCur');
				}
			});
			this.handlerDis = handlerDis

			//初始化测量面积
			var handlerArea = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.Area, 0);
			handlerArea.measureEvt.addEventListener(function (result) {
				var area = result.area > 1000000 ? result.area / 1000000 + 'km²' : result.area + '㎡'
				handlerArea.areaLabel.text = '面积:' + area;
				handlerArea.areaLabel.outlineColor = new Cesium.Color(0, 0, 1);
				handlerArea.areaLabel.font = '100 20px sans-serif';
				handlerArea.areaLabel.outlineWidth = 5.0;
			});
			handlerArea.activeEvt.addEventListener(function (isActive) {
				if (isActive == true) {
					viewer.enableCursorStyle = false;
					viewer._element.style.cursor = '';
					$('body').removeClass('measureCur').addClass('measureCur');
				} else {
					viewer.enableCursorStyle = true;
					$('body').removeClass('measureCur');
				}
			});
			this.handlerArea =handlerArea

			//初始化测量高度
			var handlerHeight = new Cesium.MeasureHandler(viewer, Cesium.MeasureMode.DVH);
			handlerHeight.measureEvt.addEventListener(function (result) {
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
			handlerHeight.activeEvt.addEventListener(function (isActive) {
				if (isActive == true) {
					viewer.enableCursorStyle = false;
					viewer._element.style.cursor = '';
					$('body').removeClass('measureCur').addClass('measureCur');
				} else {
					viewer.enableCursorStyle = true;
					$('body').removeClass('measureCur');
				}
			});
			this.handlerHeight = handlerHeight
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
			this.clearDraw();
		}
		drawPolyline(options) {
			this.clearAll();
			this.deactiveAll();
			this.handlerDis && this.handlerDis.activate();
		}
		drawPolygon(options) {
			this.clearAll();
			this.deactiveAll();
			this.handlerArea && this.handlerArea.activate();
		}
		drawHeight(options) {
			this.clearAll();
			this.deactiveAll();
			this.handlerHeight && this.handlerHeight.activate();
		}
		updateUnit(thisType, danwei) {
			this.measureControl.updateUnit(thisType, danwei);
		}
		clearDraw() {
			this.handlerDis && this.handlerDis.clear();
			this.handlerArea && this.handlerArea.clear();
			this.handlerHeight && this.handlerHeight.clear();
		}
		formatArea(val, unit) {
			return this.measureControl.formatArea(val, unit);
		}
		formatLength(val, unit) {
			return this.measureControl.formatLength(val, unit);
		}
		clearAll() {
			this.handlerDis && this.handlerDis.clear();
			this.handlerArea && this.handlerArea.clear();
			this.handlerHeight && this.handlerHeight.clear();
		}
		deactiveAll() {
			this.handlerDis && this.handlerDis.deactivate();
			this.handlerArea && this.handlerArea.deactivate();
			this.handlerHeight && this.handlerHeight.deactivate();
		}

	}


	//注册到widget管理器中。
	mars3d.widget.bindClass(MyWidget);

	//每个widet之间都是直接引入到index.html中，会存在彼此命名冲突，所以闭包处理下。
})(window, mars3d)



