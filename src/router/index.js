import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const Home = r => require.ensure([], () => r(require("@/views/home.vue")), "Home");
const Scan = r => require.ensure([], () => r(require("@/views/scan.vue")), "Scan");
const New = r => require.ensure([], () => r(require("@/views/new.vue")), "New");

export default new Router({
  routes: [
    {
      path: "/",
      name: "Index",
      component: Home,
    },
    {
      path: "/scan",
      name: "Scan",
      component: Scan
    },
    {
      path: "/new",
      name: "New",
      component: New
    }
  ]
});
