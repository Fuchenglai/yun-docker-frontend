<template>
  <div class="network-error-container">
    <div class="error-card">
      <h1 class="error-title">网络错误</h1>
      <div class="error-icon">
        <i class="el-icon-warning"></i>
      </div>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-details" v-if="showDetails">
        <pre>{{ errorDetails }}</pre>
      </div>
      <div class="action-buttons">
        <a-button type="primary" @click="goHome">返回首页</a-button>
        <a-button @click="retry">重试</a-button>
        <a-button @click="toggleDetails" v-if="errorDetails">
          {{ showDetails ? '隐藏详情' : '显示详情' }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import {useRouter} from 'vue-router';

export default defineComponent({
  name: 'NetworkErrorView',
  setup() {
    const router = useRouter();
    const errorMessage = ref('请求失败，无法连接到服务器');
    const errorDetails = ref('');
    const showDetails = ref(false);

    // 从路由中获取错误信息
    if (router.currentRoute.value.query.message) {
      errorMessage.value = router.currentRoute.value.query.message as string;
    }

    if (router.currentRoute.value.query.details) {
      errorDetails.value = router.currentRoute.value.query.details as string;
    }

    const goHome = () => {
      router.push('/');
    };

    const retry = () => {
      // 获取上一个路由
      const previousRoute = router.currentRoute.value.query.from as string || '/';
      router.push(previousRoute);
    };

    const toggleDetails = () => {
      showDetails.value = !showDetails.value;
    };

    return {
      errorMessage,
      errorDetails,
      showDetails,
      goHome,
      retry,
      toggleDetails
    };
  }
});
</script>

<style scoped>
.network-error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}

.error-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 30px;
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.error-title {
  color: #f56c6c;
  margin-bottom: 20px;
  font-size: 28px;
}

.error-icon {
  font-size: 64px;
  color: #f56c6c;
  margin: 20px 0;
}

.error-message {
  font-size: 18px;
  margin-bottom: 20px;
  color: #606266;
}

.error-details {
  background-color: #f8f8f8;
  border-radius: 4px;
  padding: 15px;
  margin: 20px 0;
  text-align: left;
  overflow-x: auto;
}

.error-details pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: monospace;
  font-size: 14px;
  color: #606266;
}

.action-buttons {
  margin-top: 30px;
}

.action-buttons button {
  margin: 0 10px;
}
</style>
