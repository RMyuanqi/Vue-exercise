import Vue from 'vue';
import Router from 'vue-router';
import Goods from 'components/goods/goods.vue';
import Ratings from 'components/ratings/ratings.vue';
import Seller from 'components/seller/seller.vue';
Vue.use(Router);

let routes = [
  {path: '/goods', component: Goods},
  {path: '/ratings/:page', component: Ratings},
  {path: '/seller', component: Seller},
  {path: '*', redirect: '/goods'}
];

export default new Router({
  routes,
  linkActiveClass: 'active'
});
