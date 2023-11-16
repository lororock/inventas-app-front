import { createWebHistory, createRouter } from "vue-router";

import Home from "../views/Home.vue";
import Form from "../views/FormView.vue";
import NotFound from "../views/NotFoundView.vue";

const requireAuth = (to: any, from: any, next: any) => {
  try {
    var datos = localStorage.getItem("token-inventas");
    if (datos !== null) {
      next();
    } else {
      next("/");
    }
  } catch (error) {
    console.error("Error al acceder a localStorage:", error);
    next();
  }
};

const noRequireAuth = (to: any, from: any, next: any) => {
  try {
    var token = localStorage.getItem("token-inventas");
    if (token === null || token === "") {
      next();
    } else {
      next("/form");
    }
  } catch (error) {
    console.error("Error al acceder a localStorage:", error);
    next();
  }
};

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
      beforeEnter: noRequireAuth,
    },
    {
      path: "/form",
      name: "Form",
      component: Form,
      beforeEnter: requireAuth,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
  ],
});

export default router;
