import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import qs from 'qs'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Root',
    redirect: '/allview'
  },
  {
    path: '/login',
    name: 'Login',
    component: Home
  },
  {
    path: '/allview',
    name: 'allview',
    component: () => import('@/views/provider.all.view.vue')
  },
  {
    path: '/keypointview',
    name: 'keypointview',
    component: () => import('@/views/provider.keypoint.view.vue')
  },
  {
    path: '/detailview',
    name: 'detailview',
    component: () => import('@/views/provider.detail.view.vue')
  }
]

const router = new VueRouter({
  routes
})
router.beforeEach(async (to, from, next) => {
  if (process.env.NODE_ENV === 'development' && to.name === 'Login') {
    try {
      const a = await Vue.prototype.$http.post('/login', qs.stringify({ account: 10000, sct: 'c4ca4238a0b923820dcc509a6f75849b', yzm: '' }))
      alert('获取用户权限成功！')
    } catch (error) {
      console.log(error)
    }
  }
  //   store.commit('setCurrentPage', to.name)
  next()
})
export default router
