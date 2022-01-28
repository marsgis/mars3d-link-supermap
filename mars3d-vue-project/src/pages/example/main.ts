import "mars3d-cesium/Build/Cesium/Widgets/widgets.css"
import "mars3d/dist/mars3d.css"

import { createApp } from "vue"
import Application from "./App.vue"
import { injectState, key } from "@mars/common/store/widget"
import { store as testStore, key as testKey } from "@mars/common/store/test"
import store from "./widget-store"
import { install as iconInstall } from "@icon-park/vue-next/es/all"
import MarsUI from "@mars/components/mars-ui"

import * as mars3d from "mars3d"

// 导入插件(其他插件类似，插件清单访问：http://mars3d.cn/dev/guide/start/architecture.html)
// supermap插件
import "mars3d-supermap"

const app = createApp(Application)

app.use(MarsUI)

iconInstall(app)

app.use(injectState(store), key)
app.use(testStore, testKey)

// mars3d sdk的挂载
app.config.globalProperties.mars3d = mars3d
app.config.globalProperties.Cesium = mars3d.Cesium

app.mount("#app")
