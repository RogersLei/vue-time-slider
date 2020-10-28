import Vue from 'vue'
import App from './App.vue'
import timeline from "./components/timeline_slider/index.js"

import htimeline from "./components/horizontal_timeline/index.js"

Vue.use(timeline)
Vue.use(htimeline)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
