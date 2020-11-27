import Vue from 'vue'
import App from './App.vue'
import { createProvider } from './vue-apollo'
import vuetify from './plugins/vuetify';
// Vue CLIによって追加
import router from './router'
import store from './store'

Vue.config.productionTip = false

const createApp = async () => {
  await store.dispatch('currentUser')

  new Vue({
    apolloProvider: createProvider(),
    vuetify,
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}

createApp()