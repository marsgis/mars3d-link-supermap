import "mars3d/mars3d.css"
import "mars3d"
import "mars3d-supermap"

import { createApp } from "vue"
import Application from "./App.vue"
import { injectState, key } from "@mars/common/store/widget"
import store from "./widget-store"
import MarsUIInstall from "@mars/components/mars-ui"

const app = createApp(Application)

MarsUIInstall(app)

app.use(injectState(store), key)

app.mount("#app")
