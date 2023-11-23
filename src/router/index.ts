import { createWebHistory, createRouter } from "vue-router";
import { jwtDecode, JwtPayload } from "jwt-decode";

import Form from "../views/FormView.vue";
import NotFound from "../views/NotFoundView.vue";
import { useAuthStore } from "../store/auth.store.ts";
import Login from "../views/Login.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/form",
      name: "Form",
      component: Form,
      meta: { requiresAuth: true },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
  ],
});

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const token = authStore.token
      ? authStore.token
      : (localStorage.getItem("token-inventas") as string);
    if (!token) next({ path: "/" });

    const decoded: JwtPayload | any = jwtDecode(token);
    if (!decoded) next({ path: "/" });

    if (!(decoded.exp < Date.now() / 1000)) return next();

    const valid = await authStore.validTokenRefresh();
    if (!valid) next({ path: "/" });
  }
  next();
});

export default router;
