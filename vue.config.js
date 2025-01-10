const { defineConfig } = require("@vue/cli-service");
const fs = require("fs")
const packageJson = fs.readFileSync('./package.json')
const version = JSON.parse(packageJson).version || 0

module.exports = defineConfig({
  //publicPath:
  //  process.env.NODE_ENV === "production" ? "/metronic8/vue/demo1/" : "/",
  transpileDependencies: true,
  chainWebpack: (config) => {
    config.resolve.alias.set("vue-i18n", "vue-i18n/dist/vue-i18n.cjs.js");
    config.plugin('define').tap((definitions) => {
      definitions[0]['process.env']['APP_VERSION'] = '"' + version + '"';
      return definitions;
    });
  },
});
