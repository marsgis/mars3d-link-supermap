import { App } from 'vue'

import 'mars3d/dist/mars3d.css'
import * as mars3d from 'mars3d'

// 导入插件(其他插件类似，插件清单访问：http://mars3d.cn/dev/guide/start/architecture.html)
// supermap插件
import 'mars3d-supermap'

export default {
  install: (app: App) => {
    app.config.globalProperties.mars3d = mars3d
    app.config.globalProperties.Cesium = mars3d.Cesium
  }
}
