import Vue from 'vue'
import Router from 'vue-router'

import Home from './components/Home'
import TravelBook from './components/TravelBook'
import SettlePreview from './components/SettlePreview'
import Admin from './components/Admin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/t/:url',
      name: 'travelBook',
      component: TravelBook
    },
    {
      path: '/t/:url/settlePreview',
      name: 'settlePreview',
      component: SettlePreview
    },
    {
      path: '/t/:url/admin',
      name: 'admin',
      component: Admin
    }
    // {
    //   path: '/',
    //   name: 'home',
    //   component: Home
    // },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    // }
  ]
})
