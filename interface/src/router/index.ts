import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
// import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  //{
    //path: "/about",
    //name: "about",
    //// route level code-splitting
    //// this generates a separate chunk (about.[hash].js) for this route
    //// which is lazy-loaded when the route is visited.
    //component: () =>
      //import([> webpackChunkName: "about" <] "../views/AboutView.vue"),
  //},
];

const router = createRouter({
  history: createWebHistory('/apps/keep/'), // TODO: not sure this will work on urbit
  routes,
});

export default router;
