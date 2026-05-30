/* eslint-disable */

/**
 * 第3方公共类库配置文件
 *
 * @copyright mars3d.cn
 * @author 木遥 2021-11-26
 */
window.configLibs = {
  /// ///////////////////////Mars3D及其插件////////////////////////
  mars3d: [
    // // 三维地球“主库”
    // "https://registry.npmmirror.com/mars3d-cesium/1.133.0/files/Build/Cesium/Widgets/widgets.css", //cdn
    // "https://registry.npmmirror.com/mars3d-cesium/1.133.0/files/Build/Cesium/Cesium.js",
    "Cesium/Widgets/widgets.css", // cesium
    "Cesium/Cesium.js",
    // "https://unpkg.com/@turf/turf@7.1.0/turf.min.js",
    "turf/turf.min.js",
    "mars3d/mars3d.css", // mars3d
    "mars3d/mars3d.js"
  ],
  "cesium-comp": [
    //cesium版本间兼容处理
    "mars3d/plugins/compatible/cesium-version.js",
    // "mars3d/plugins/compatible/cesium-when.js"
  ],
  "mars3d-space": [
    // 卫星插件
    "mars3d/plugins/space/mars3d-space.js"
  ],
  "mars3d-echarts": [
    // echarts支持插件
    "echarts/echarts.min.js",
    "echarts/echarts-gl/echarts-gl.min.js",
    "mars3d/plugins/echarts/mars3d-echarts.js"
  ],
  "mars3d-mapv": [
    // mapv支持插件
    "mapV/mapv.min.js",
    "mars3d/plugins/mapv/mars3d-mapv.js"
  ],
  "mars3d-heatmap": [
    // heatmap热力图支持插件
    "mars3d/plugins/heatmap/heatmap.js",
    "mars3d/plugins/heatmap/mars3d-heatmap.js"
  ],
  "mars3d-wind": [
    // 风场图层插件
    "mars3d/plugins/wind/netcdfjs.js", // m10_windLayer解析nc
    "mars3d/plugins/wind/mars3d-wind.js"
  ],
  "mars3d-tdt": [
    // 天地图三维
    "mars3d/plugins/tdt/mars3d-tdt.js"
  ],
  "mars3d-supermap": [
    // 超图S3M服务
    "mars3d/plugins/supermap/SuperMap3D.js", // s3m支持原生cesium的独立插件
    "mars3d/plugins/supermap/mars3d-supermap.js" // mars3d-supermap简化调用封装
  ],
  "mars3d-plot": [
    "mars3d/plugins/plot/constant.js",
    "mars3d/plugins/plot/mars3d-plot.js"
  ],

  "mars3d-next": ["mars3d/plugins/next/mars3d-next.js"],

  //////////////////////////cesium相关第3方插件////////////////////////
  "cesium-pbf-ol": [
    // pbf矢量瓦片支持（基于openlayer渲染）
    "mars3d/thirdParty/pbf-ol/ol.js",
    "mars3d/thirdParty/pbf-ol/olms.js",
    "mars3d/thirdParty/pbf-ol/style/MapboxStreetsV6.js",
    "mars3d/thirdParty/pbf-ol/PbfolLayer.js"
  ],
  "cesium-pbf-mapbox": [
    // pbf矢量瓦片支持（基于mapbox渲染）
    "mars3d/thirdParty/pbf-mapbox/mapbox-gl.js",
    "mars3d/thirdParty/pbf-mapbox/PbfLayer.js"
  ],
  "cesium-pbf-protomaps": [
    // pbf矢量瓦片支持（基于protomaps解析）
    "mars3d/thirdParty/pbf-protomaps/protomaps.min.js",
    "mars3d/thirdParty/pbf-protomaps/ArcGISPbfLayer.js"
  ],
  "cesium-weiVectorTile": [
    // 项目矢量瓦片方式加载GeoJson插件
    "mars3d/thirdParty/weiVectorTile/CesiumVectorTile.js",
    "mars3d/thirdParty/weiVectorTile/WeiVectorTileLayer.js"
  ],
  "cesium-sensorVolumes": [
    // 支持agi_conicSensor，agi_customPatternSensor和agi_rectangularSensor展示的czml插件
    "mars3d/thirdParty/sensorVolumes/cesium-sensor-volumes.js"
  ],
  olcesium: [
    "ol/ol.css",
    "ol/ol.js",
    "ol/ol-cesium/olcesium.js"
  ],

  //////////////////////////mars2d及其插件////////////////////////
  'mars2d': [//地图 主库
    "http://mars2d.cn/lib/leaflet/leaflet.css", //leaflet
    "http://mars2d.cn/lib/leaflet/leaflet.js",
    "http://mars2d.cn/lib/mars2d/mars2d.css", //mars2d
    "http://mars2d.cn/lib/mars2d/mars2d.js",
    "http://mars2d.cn/lib/mars2d/plugins/esri/mars2d-esri.js"
  ],

  //////////////////////////其他地图渲染相关库////////////////////////
  'echarts': [
    "echarts/echarts.min.js",
    "echarts/dark.js"
  ],
  'echarts-gl': [
    "echarts/echarts.min.js",
    "echarts/echarts-gl/echarts-gl.min.js"
  ],
  'echarts-liquidfill': [
    "echarts/echarts.min.js",
    "echarts/echarts-liquidfill/echarts-liquidfill.js"
  ],
  'terraformer': [
    "terraformer/terraformer-1.0.9.min.js",
    "terraformer/terraformer-wkt-parser-1.2.0.min.js",
  ],
  'kriging': [
    "kriging/kriging.min.js"
  ],
  'three': [
    "three/three.js"
  ],
  'kmlGeojson': [
    "geojson/kml-geojson.js"  // KML/KMZ解析加载GeoJson插件
  ],
  'shpGeojson': [
    "geojson/shp-geojson.js"  // shp解析加载GeoJson插件
  ],
  'iserverGeojson': [
    "geojson/iserver-geojson.js"  // shp解析加载GeoJson插件
  ],

  geotiff:["geotiff/geotiff.js","geotiff/plotty.js"],

  kriging: ["kriging/kriging.min.js"],
  three: ["three/three.js"],
  'hls': ["video/hls/hls.js"],
  'flv': ["video/flv/flv.min.js"],
  'mpegts': ["video/mpegts/mpegts.js"],
  tween: ["tween/Tween.js"],
  localforage: ["localforage/localforage.min.js"],
  xlsx: ["xlsx/xlsx.full.min.js"],
}
