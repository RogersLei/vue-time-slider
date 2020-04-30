import Vue from 'vue'
import App from './App.vue'
import timeline from "./components/index.js"

Vue.use(timeline)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
