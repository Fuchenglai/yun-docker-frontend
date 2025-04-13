<template>
  <a-row id="globalHeader" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          @menu-item-click="doMenuClick"
      >
        <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/docker-logo.png"/>
            <div class="title">云 Docker</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="auto" class="right-content">
      <div class="user-info">
        <a-avatar :style="{ backgroundColor: '#3370ff', marginBottom: '4px' }">
          <IconUser/>
        </a-avatar>
        <div class="user-name">
          <a-popover title="用户详情">
            {{ store.state.user?.loginUser?.userName ?? "未登录" }}
            <template #content>
              <p>昵称：{{ store.state.user?.loginUser?.userName ?? 0 }}<p/>
                <p>余额：{{ store.state.user?.loginUser?.balance ?? 0 }}<p/>
            </template>
          </a-popover>

        </div>
      </div>
      <a-button
          v-if="!isLoggedIn"
          type="primary"
          class="login-button"
          @click="router.push('/user/login')"
      >
        登录
      </a-button>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import {routes} from "../router/routes";
import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";
import {useStore} from "vuex";
import checkAccess from "@/access/checkAccess";
import ACCESS_ENUM from "@/access/accessEnum";
import {IconUser} from '@arco-design/web-vue/es/icon';

const router = useRouter();
const store = useStore();

// 判断用户是否已登录
const isLoggedIn = computed(() => {
  return store.state.user?.loginUser?.userRole !== ACCESS_ENUM.NOT_LOGIN
      && store.state.user?.loginUser?.userName !== "未登录";
});

// 展示在菜单的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (
        !checkAccess(store.state.user.loginUser, item?.meta?.access as string)
    ) {
      return false;
    }
    return true;
  });
});

// 默认主页
const selectedKeys = ref(["/"]);

// 路由跳转后，更新选中的菜单项
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

console.log();

setTimeout(() => {
  store.dispatch("user/getLoginUser", {
    userName: "鱼皮管理员",
    userRole: ACCESS_ENUM.ADMIN,
  });
}, 3000);

const doMenuClick = (key: string) => {
  router.push({
    path: key,
  });
};
</script>

<style scoped>
.title-bar {
  display: flex;
  align-items: center;
}

.title {
  color: #444;
  margin-left: 16px;
}

.logo {
  height: 48px;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.user-name {
  font-size: 12px;
  margin-top: 4px;
  text-align: center;
}

.right-content {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 16px;
  gap: 16px;
}

.login-button {
  margin-right: 16px;
}
</style>
