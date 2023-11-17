import { createWebHistory, createRouter } from "vue-router";

import Home from "../views/Home.vue";
import Form from "../views/FormView.vue";
import NotFound from "../views/NotFoundView.vue";
import { useAuthStore } from "../store/auth.store.ts";
import Swal from "sweetalert2";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
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
  const token = !!authStore.token;

  if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
    const valid = await authStore.validTokenRefresh();
    if (!valid) {
      await Swal.fire({
        icon: "warning",
        title: "Es necesario que inicies sesión primero",
        timer: 2000,
        showConfirmButton: false,
        showCloseButton: false,
      });
      next({ path: "/" });
    }
  }
  next();
});

export default router;
