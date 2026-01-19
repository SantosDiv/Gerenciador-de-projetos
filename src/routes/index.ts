import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import New from '@/pages/New.vue'
import Edit from '@/pages/Edit.vue'
import Search from '@/pages/Search.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { showHeader: true, showSearchIcon: true }
  },
  {
    path: '/new',
    name: 'New',
    component: New,
    meta: { showHeader: true, showSearchIcon: false }
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: Edit,
    meta: { showHeader: true, showSearchIcon: false }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: { showHeader: false, showSearchIcon: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
