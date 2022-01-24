const path = require("path")
const glob = require("glob")

function resolve(dir) {
  return path.join(__dirname, dir)
}

const pages = handleEntry("./src/pages/**/main.ts")

module.exports = {
  publicPath: process.env.BASE_URL,
  outputDir: "dist/jcxm-vue",
  assetsDir: "static",
  productionSourceMap: false,
  devServer: {
    // 它支持webPack-dev-server的所有选项
    host: "localhost", // 也可以直接写IP地址这样方便真机测试
    port: 2003, // 端口号
    https: false, // https:{type:Boolean}
    open: true // 配置自动启动浏览器
  },
  filenameHashing: false,
  pages,
  chainWebpack: (config) => {
    config.resolve.alias.set("@mars", resolve("src"))
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
}

function handleEntry(entry) {
  const entries = {}

  glob.sync(entry).forEach((item) => {
    const entryBaseName = item.replace(/\.\/src\/pages\/(\S*)\/main\.ts/g, "$1")
    entries[entryBaseName] = {
      entry: `src/pages/${entryBaseName}/main.ts`,
      template: "public/index.html",
      filename: `${entryBaseName}.html`,
      title: "Mars3D",
      chunks: ["chunk-vendors", "chunk-common", entryBaseName]
    }
  })

  return entries
}
