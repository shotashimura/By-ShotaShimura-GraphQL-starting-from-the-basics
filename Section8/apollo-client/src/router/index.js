import Vue from 'vue'
import VueRouter from 'vue-router'

// compornent
import Home from '../views/Home.vue'
import createUser from '../views/createUser.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

// ルート定義
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    name: 'createUser',
    path: '/createUser',
    component: createUser
  },
  {
    name: 'Login',
    path: '/login',
    component: Login
  },
]

const router = new VueRouter({
  routes
})

export default router