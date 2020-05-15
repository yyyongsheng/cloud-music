import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false


Vue.prototype.$musicID = '0'


Vue.prototype.$setmusicID = (val) => {
	Vue.prototype.$musicID = val
}



App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
