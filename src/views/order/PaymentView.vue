<template>
  <div class="payment-container">
    <h2>订单支付</h2>

    <a-alert type="warning" class="time-alert">
      请在15分钟内完成支付，超时订单将自动取消
    </a-alert>

    <div class="order-info">
      <p>订单ID: {{ orderId }}</p>
      <p>充值积分: {{ credit }}</p>
      <p>支付金额: ¥{{ amount }}</p>
    </div>

    <div class="payment-methods">
      <h3>选择支付方式</h3>
      <a-radio-group v-model="paymentMethod">
        <a-radio value="alipay">支付宝支付</a-radio>
        <a-radio value="wechat">（其他支付方式暂未开通）</a-radio>
      </a-radio-group>

      <a-alert type="info" class="test-account-alert" v-if="paymentMethod === 'alipay'">
        <template #title>请复制沙箱支付账号，支付时会用到</template>
        <div class="account-row">
          买家账号：whxskl8825@sandbox.com
          <a-button
            type="text"
            size="mini"
            @click.stop="copyBuyerAccount"
            class="copy-btn"
          >
            复制
          </a-button>
        </div>
        <div>登录密码：111111</div>
        <div>支付密码：111111</div>
      </a-alert>
    </div>

    <div class="action-buttons">
      <a-button type="outline" @click="handleCancel" class="cancel-btn">取消订单</a-button>
      <a-button type="primary" @click="handlePayment" class="pay-btn">立即支付</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import message from '@arco-design/web-vue/es/message';
import {AliPayControllerService, OrderControllerService} from "../../../generated";

// 复制买家账号
const copyBuyerAccount = () => {
  navigator.clipboard.writeText('whxskl8825@sandbox.com')
    .then(() => {
      message.success('买家账号已复制');
    })
    .catch(() => {
      message.error('复制失败，请手动复制');
    });
};

const route = useRoute();
const router = useRouter();

// 从路由参数获取订单信息
const orderId = ref(route.query.orderId as string || '');
const credit = ref(Number(route.query.credit) || 0);
const amount = ref(Number(route.query.amount) || 0);

// 支付方式
const paymentMethod = ref('alipay');

// 取消订单方法
const handleCancel = async () => {
  const res = await OrderControllerService.cancelOrderUsingGet(orderId.value);

  message.info('订单已取消');
  router.push('/myOrder');
};


// 支付方法
const handlePayment = async () => {
  try {
    if (paymentMethod.value === 'alipay') {
      const res = await AliPayControllerService.payUsingGet(orderId.value);

      // 处理支付宝返回的表单
      const div = document.createElement('div');
      div.innerHTML = res;
      document.body.appendChild(div);
      const form = div.querySelector('form[name="punchout_form"]');
      if (form) {
        (form as HTMLFormElement).submit();
      }
    } else {
      message.info('其他支付方式暂未开通');
    }
  } catch (e) {
    message.error('支付请求失败');
    console.error(e);
  }
};
</script>

<style scoped>
.payment-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.time-alert {
  margin-bottom: 20px;
}

.order-info {
  margin: 20px 0;
  padding: 15px;
  background-color: #f8f8f8;
  border-radius: 8px;
}

.order-info p {
  margin: 8px 0;
  font-size: 16px;
}

.payment-methods {
  margin: 30px 0;
}

.test-account-alert {
  margin-top: 15px;
}

.test-account-alert div {
  margin: 4px 0;
  font-size: 14px;
}

.account-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-btn {
  padding: 0 4px;
  height: auto;
  line-height: 1;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.cancel-btn {
  width: 48%;
}

.pay-btn {
  width: 48%;
}
</style>
