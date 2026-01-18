import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import New from '../pages/New.vue'
import Edit from '../pages/Edit.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/new',
    name: 'New',
    component: New
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: Edit
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
