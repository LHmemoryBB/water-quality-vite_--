import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  { path: "/:pathMatch(.*)", redirect: "/404" },
  //默认登录到首页
  {
    path: "/login",
    name: "登录",
    component: () => import("@/views/login.vue"),
    hidden: true,
    meta: { requireAuth: false },
  },
  {
    path: "/",
    name: "",
    redirect: "/login",
    hidden: true,
    meta: { requireAuth: false },
  },
  {
    path: "/index",
    name: "首页",
    component: () => import("@/views/index.vue"),
    iconCls: "el-icon-tickets",
    children: [
      {
        path: "/view/waterTable",
        name: "水质调研",
        component: () => import("@/views/waterTable.vue"),
        meta: { requireAuth: true, show: true },
      },
      {
        path: "/view/waterDetail",
        name: "水质详情",
        component: () => import("@/views/waterDetail.vue"),
        meta: { requireAuth: true, show: false },
      },
      {
        path: "/view/station",
        name: "水质分布",
        component: () => import("@/views/stationChart.vue"),
        meta: { requireAuth: true, show: true },
      },
    ],
  },
];


const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

router.beforeEach((to, from, next) => {
  console.log(to, from);
  if (to.path === '/login' && from.path !== '/login' && from.path !== '/') {
    // 如果目标路由是首页且当前路由不是首页，则刷新页面
    localStorage.setItem('refreshOnLogin', 'true');
    next(); // 取消当前导航
    // window.location.reload();
  } else {
    next(); // 继续导航
  }
});
export { router, routes };
