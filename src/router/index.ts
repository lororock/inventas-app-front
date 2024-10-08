import { createWebHistory, createRouter } from "vue-router";
import { jwtDecode, JwtPayload } from "jwt-decode";

import NotFound from "../views/NotFoundView.vue";
import { useAuthStore } from "../store/auth.store.ts";
import Login from "../views/Login.vue";
import HomeDashboard from "../views/Dashboard/HomeDashboard.vue";
import CategoryView from "../views/Dashboard/CategoryView.vue";
import Forbidden from "../views/Forbidden.vue";
import ProductsView from "../views/Dashboard/ProductsView.vue";
import InventoriesView from "../views/Dashboard/InventoriesView.vue";
import ClientsView from "../views/Dashboard/ClientsView.vue";
import SalesView from "../views/Dashboard/SalesView.vue";
import SettingsView from "../views/Dashboard/SettingsView.vue";
import SalesCreditsView from "../views/Dashboard/SalesCreditsView.vue";
import UsersView from "../views/Dashboard/UsersView.vue";
import EnterprisesView from "../views/Dashboard/EnterprisesView.vue";

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
      meta: { requiresAuth: true, roles: [0, 1, 2, 3, 4] },
    },
    {
      path: "/enterprises",
      name: "Enterprise",
      component: EnterprisesView,
      meta: { requiresAuth: true, roles: [0] },
    },
    {
      path: "/categories",
      name: "Category",
      component: CategoryView,
      meta: { requiresAuth: true, roles: [1, 2, 3, 4] },
    },
    {
      path: "/products",
      name: "Product",
      component: ProductsView,
      meta: { requiresAuth: true, roles: [1, 2, 3, 4] },
    },
    {
      path: "/inventories",
      name: "Inventory",
      component: InventoriesView,
      meta: { requiresAuth: true, roles: [1, 2, 3, 4] },
    },
    {
      path: "/clients",
      name: "Client",
      component: ClientsView,
      meta: { requiresAuth: true, roles: [1, 2, 4] },
    },
    {
      path: "/sales",
      name: "Sale",
      component: SalesView,
      meta: { requiresAuth: true, roles: [1, 2, 3, 4] },
    },
    {
      path: "/payments",
      name: "Payment",
      component: SalesCreditsView,
      meta: { requiresAuth: true, roles: [1, 2, 3, 4] },
    },
    {
      path: "/users",
      name: "User",
      component: UsersView,
      meta: { requiresAuth: true, roles: [1, 2, 3, 4] },
    },
    {
      path: "/settings",
      name: "Setting",
      component: SettingsView,
      meta: { requiresAuth: true, roles: [1, 2, 3, 4] },
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
