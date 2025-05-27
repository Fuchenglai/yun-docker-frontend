import {RouteRecordRaw} from "vue-router";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/user/UserLoginView.vue";
import UserRegisterView from "@/views/user/UserRegisterView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import ImageListView from "@/views/image/ImageListView.vue";
import ContainerListView from "@/views/container/ContainerListView.vue";
import AboutView from "@/views/AboutView.vue";
import OrderListView from "@/views/OrderListView.vue";

export const routes: Array<RouteRecordRaw> = [
    {
        path: "/user",
        name: "用户",
        component: UserLayout,
        children: [
            {
                path: "/user/login",
                name: "用户登录",
                component: UserLoginView,
            },
            {
                path: "/user/register",
                name: "用户注册",
                component: UserRegisterView,
            },
        ],
        meta: {
            hideInMenu: true,
        },
    },
    /*{
      path: "/questions",
      name: "浏览题目",
      component: QuestionsView,
    },
    {
      path: "/question_submit",
      name: "浏览题目提交",
      component: QuestionSubmitView,
    },
    {
      path: "/view/question/:id",
      name: "在线做题",
      component: ViewQuestionView,
      props: true,
      meta: {
        access: ACCESS_ENUM.USER,
        hideInMenu: true,
      },
    },*/
    /*  {
        path: "/add/question",
        name: "创建题目",
        component: AddQuestionView,
        meta: {
          access: ACCESS_ENUM.USER,
        },
      },
      {
        path: "/update/question",
        name: "更新题目",
        component: AddQuestionView,
        meta: {
          access: ACCESS_ENUM.USER,
          hideInMenu: true,
        },
      },*/


    {
        path: "/",
        name: "镜像",
        component: ImageListView,
    },
    {
        path: "/containerList",
        name: "我的容器",
        component: ContainerListView,
    },
    {
        path: "/about",
        name: "启动容器示例",
        component: AboutView,
    },
    {
        path: "/myOrder",
        name: "积分充值",
        component: OrderListView,
    },
    {
        path: "/order/payment",
        name: "订单支付",
        component: () => import("@/views/order/PaymentView.vue"),
        meta: {
            hideInMenu: true,
        },
    },
    // {
    //   path: "/hide",
    //   name: "隐藏页面",
    //   component: HomeView,
    //   meta: {
    //     hideInMenu: true,
    //   },
    // },
    {
        path: "/noAuth",
        name: "无权限",
        component: NoAuthView,
        meta: {
            hideInMenu: true,
        },
    },
    // {
    //   path: "/admin",
    //   name: "管理员可见",
    //   component: AdminView,
    //   meta: {
    //     access: ACCESS_ENUM.ADMIN,
    //   },
    // },
    // {
    //   path: "/about",
    //   name: "关于我的",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
    // },
];
