<template>
  <div id="imageForm" class="form-container">
    <p class="balance-text">创建容器会消耗积分，您当前的积分余额是：<span class="balance-value">{{ balance }}</span></p>

    <a-form
        :model="form"
        auto-label-width
        label-align="left"
        class="recharge-form"
        @submit="handleSubmit"
    >
      <a-form-item field="rechargeCredit"
                   tooltip="1积分=0.01元" label="充值积分" label-col="{ span: 6 }" wrapper-col="{ span: 18 }">
        <a-input v-model="form.rechargeCredit" placeholder="请输入需要充值的积分" class="recharge-input"/>
        <a-button html-type="submit" class="recharge-button" type="primary">
          充值
        </a-button>
      </a-form-item>
    </a-form>
    <p class="payment-text">需要支付金额：<span class="payment-value">{{ calculateMoney }}</span> 元</p>
  </div>
  <div id="imageListView">
    <a-table
        :ref="tableRef"
        :columns="columns"
        :data="dataList"
        :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
        @page-change="onPageChange"
    >
      <!--      自定义列渲染 插槽-->
      <template #createTimeSlot="{ record }">
        {{ formatDateToHour(record.createTime) }}
      </template>

      <template #finishedTimeSlot="{ record }">
        {{ formatDateToHour(record.finishedTime) }}
      </template>

      <template #optional="{ record }">
        <a-space>

          <a-button type="primary" @click="handleClick(record)"> 订单详情</a-button>

          <a-modal v-model:visible="visible" title="订单详情" @cancel="handleCancel" @before-ok="handleCancel">
            <div>
              <p>用户id: {{ orderDetail.buyerId }}</p>
              <p>订单id: {{ orderDetail.orderId }}</p>
              <p>积分数量: {{ orderDetail.credit }}</p>
              <p>金额: {{ orderDetail.frontMoney }}</p>
              <p>交易号: {{ orderDetail.tradeNo }}</p>
              <p>订单创建时间: {{ formatDateToHour(orderDetail.createTime) }}</p>
              <p>订单完成时间: {{ formatDateToHour(orderDetail.finishedTime) }}</p>
              <p>订单取消时间: {{ formatDateToHour(orderDetail.cancelTime) }}</p>

            </div>
          </a-modal>

          <!--          <a-button status="danger" @click="doDelete(record)" :disabled="record.imageType === 0">删除</a-button>-->
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watchEffect} from "vue";
import {OrderControllerService, UserControllerService} from "../../generated";
import message from "@arco-design/web-vue/es/message";
import {useRouter} from "vue-router";

const visible = ref(false);


// 定义响应式变量存储后端数据
const orderDetail = reactive({
  buyerId: 0,
  orderId: "",
  credit: 0,
  frontMoney: "",
  frontStatus: "",
  tradeNo: "",
  createTime: "",
  finishedTime: "",
  cancelTime: ""
});

const handleBeforeOk = (done) => {
  window.setTimeout(() => {
  }, 1500)
};

const handleClick = async (record) => {
  visible.value = true;
  const res = await OrderControllerService.detailUsingGet(record.orderId);
  if (res.code === 0 && res.data) {
    orderDetail.buyerId = res.data.buyerId ?? 0;
    orderDetail.orderId = res.data.orderId ?? "";
    orderDetail.credit = res.data.credit ?? 0;
    orderDetail.frontMoney = res.data.frontMoney ?? "";
    orderDetail.frontStatus = res.data.frontStatus ?? "";
    orderDetail.tradeNo = res.data.tradeNo ?? "";
    orderDetail.createTime = res.data.createTime ?? "";
    orderDetail.finishedTime = res.data.finishedTime ?? "";
    orderDetail.cancelTime = res.data.cancelTime ?? "";
  }
}

const handleCancel = () => {
  visible.value = false;
}

const router = useRouter();

/**
 * 表单信息
 */
const form = reactive({
  rechargeCredit: 0,
});

// 计算金额
const calculateMoney = computed(() => {
  return (form.rechargeCredit * 0.01).toFixed(2);
});

const tableRef = ref();

//list空数组
const dataList = ref([]);

// 分页查询总条数
const total = ref(0);

// 用户积分余额
const balance = ref(0);


// 分页查询参数
const searchParams = ref({
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  /*  const res = await ImageControllerService.listImageByPageUsingPost(
        searchParams.value
    );*/
  const res = await OrderControllerService.listOrderByPageUsingPost(
      searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else if (res.message === "未登录") {
    message.error("未登录，请先登录！");
    router.push("/user/login");
  }
};

const loadBalance = async () => {
  const res = await UserControllerService.getCreditUsingGet();
  if (res.code === 0) {
    balance.value = res.data ?? 0;
  } else {
    console.log(res.message);
  }

}

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
  loadBalance();
});


const formatDateToHour = (dateString: string): string => {
  if (!dateString || dateString === '') {
    return '-';
  }
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要+1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

/**
 * 提交表单
 * @param data
 */
const handleSubmit = async () => {
  const res = await OrderControllerService.addOrderUsingGet(form.rechargeCredit);
  if (res.code === 0 && res.data) {
    message.success("订单创建成功");
    router.push({
      path: '/order/payment',
      query: {
        orderId: res.data,
        credit: form.rechargeCredit,
        amount: calculateMoney.value
      }
    });
  } else {
    message.error("订单创建失败");
  }
};


const columns = [
  {
    title: "订单ID",
    dataIndex: "orderId",
  },
  {
    title: "积分数量",
    dataIndex: "credit",
  },
  {
    title: "支付金额（元）",
    dataIndex: "money",
  },
  {
    title: "订单状态",
    dataIndex: "frontStatus",
  },
  {
    title: "创建时间",
    slotName: "createTimeSlot",
  },
  {
    title: "完成时间",
    slotName: "finishedTimeSlot",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

</script>

<style scoped>
.form-container {
  text-align: center;
  padding: 20px;
}

.balance-text {
  font-size: 18px;
  color: #333;
}

.balance-value {
  color: #f56c6c;
  font-weight: bold;
}

.recharge-form {
  max-width: 480px;
  margin: 20px auto;
  border: 1px solid #dcdcdc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.recharge-input {
  width: 100%;
}

.recharge-button {
  width: 120px;
  margin-left: 10px;
  background-color: #1890ff;
  border-color: #1890ff;
  color: #fff;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.payment-text {
  margin-top: 20px;
  color: #666;
  font-size: 18px;
}

.payment-value {
  color: #f56c6c;
  font-weight: bold;
}

#imageListView {
}

.modal-open-background {
  background-color: rgba(255, 255, 255, 0.5);
}

.custom-link {
  color: #007bff;
  text-decoration: none;
  border: 1px solid #007bff;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s;
}
</style>
