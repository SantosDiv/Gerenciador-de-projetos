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
    meta: { showHeader: true, showSearchIcon: false, title: 'Criar Projeto' }
  },
  {
    path: '/edit/:id',
    name: 'Edit',
    component: Edit,
    meta: { showHeader: true, showSearchIcon: false, title: 'Editar Projeto' }
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: { showHeader: false, showSearchIcon: false, title: 'Resultados de busca' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = to.name === 'Home' ? 'Gerenciador de projetos' : `Gerenciador de projetos - ${to.meta.title || to.name}`;
  next();
});

export default router
