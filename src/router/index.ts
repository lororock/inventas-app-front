import { createWebHistory, createRouter } from "vue-router";
import { jwtDecode, JwtPayload } from "jwt-decode";

import Form from "../views/FormView.vue";
import NotFound from "../views/NotFoundView.vue";
import { useAuthStore } from "../store/auth.store.ts";
import Login from "../views/Login.vue";
import HomeDashboard from "../views/Dashboard/HomeDashboard.vue";
import Employee from "../views/Dashboard/Employee.vue";
import CategoryView from "../views/Dashboard/CategoryView.vue";
import Forbidden from "../views/Forbidden.vue";
import ProductsView from "../views/Dashboard/ProductsView.vue";
import InventoriesView from "../views/Dashboard/InventoriesView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/home",
      name: "Home",
      component: HomeDashboard,
      meta: { requiresAuth: true, roles: [0, 1, 2, 3] },
    },
    {
      path: "/employees",
      name: "Employee",
      component: Employee,
      meta: { requiresAuth: true, roles: [1] },
    },
    {
      path: "/categories",
      name: "Category",
      component: CategoryView,
      meta: { requiresAuth: true, roles: [1, 2, 3] },
    },
    {
      path: "/products",
      name: "Product",
      component: ProductsView,
      meta: { requiresAuth: true, roles: [1, 2, 3] },
    },
    {
      path: "/inventories",
      name: "Inventory",
      component: InventoriesView,
      meta: { requiresAuth: true, roles: [1, 2, 3] },
    },
    {
      path: "/form",
      name: "Form",
      component: Form,
      meta: { requiresAuth: true, roles: [0] },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound,
    },
    {
      path: "/forbidden",
      name: "Forbidden",
      component: Forbidden,
    },
  ],
});

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore();

  const requiredRoles: any = to.meta.roles;
  const token = authStore.token
    ? authStore.token
    : (localStorage.getItem("token-inventas") as string);
  if (requiredRoles) {
    const decoded: JwtPayload | any = jwtDecode(token);
    if (!requiredRoles.includes(decoded.roles[0]))
      return next({ path: "/forbidden" });
  }

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) next({ path: "/" });

    const decoded: JwtPayload | any = jwtDecode(token);
    if (!decoded) next({ path: "/" });

    if (!(decoded.exp < Date.now() / 1000)) {
      authStore.setToken(localStorage.getItem("token-inventas") as string);
      return next();
    }

    const valid = await authStore.validTokenRefresh();
    if (!valid) return next({ path: "/" });
    authStore.setToken(localStorage.getItem("token-inventas") as string);
  }
  next();
});

export default router;
