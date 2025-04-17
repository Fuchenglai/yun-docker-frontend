<template>
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
      <template #statusSlot="{ record }">
        {{ record.status === 'running' ? '运行中' : '已停止' }}
      </template>
      <template #createTimeSlot="{ record }">
        {{ formatDateToHour(record.createTime) }}
      </template>
      <template #containerIdSlot="{ record }">
        {{ record.containerId.slice(0, 12) }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="handleClick(record)" :disabled="record.status === 'exited'"> 运行详情
          </a-button>

          <a-modal v-model:visible="visible" title="运行详情" @cancel="handleCancel" @before-ok="handleCancel">
            <div>
              <p>CPU总使用时间(秒): {{ containerStats.cpuTotalUsage }}</p>
              <p>每个CPU使用率:
                <ul>
                  <li v-for="usage in containerStats.perCpuUsage" :key="usage">{{ usage }}</li>
                </ul>
              </p>
              <p>在线CPU数量: {{ containerStats.onlineCpus }}</p>
              <p>当前占用内存(KB): {{ containerStats.memoryUsage }}</p>
              <p>最大占用内存(KB): {{ containerStats.memoryMaxUsage }}</p>
              <p>内存使用限制(MB): {{ containerStats.memoryLimit }}</p>
              <p>当前运行进程数: {{ containerStats.numProcess }}</p>
              <p>网络入站流量(KB): {{ containerStats.rxBytes }}</p>
              <p>网络出站流量(KB): {{ containerStats.txBytes }}</p>
              <p>磁盘IO传输数据量(KB): {{ containerStats.ioValue }}</p>
            </div>
          </a-modal>

          <a-button type="primary" @click="doRestart(record)">重启</a-button>
          <a-button type="primary" @click="doStart(record)">启动</a-button>
          <a-button type="primary" @click="downloadLog(record)">查看日志</a-button>
          <a-button status="warning" @click="doStop(record)">停止</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>

        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watchEffect} from "vue";
import {ContainerControllerService, ContainerVO,} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import axios from "axios";

const store = useStore();
const visible = ref(false);

// 定义响应式变量存储后端数据
const containerStats = reactive({
  cpuTotalUsage: 0,
  perCpuUsage: [],
  onlineCpus: 0,
  memoryUsage: 0,
  memoryMaxUsage: 0,
  memoryLimit: 0,
  numProcess: 0,
  rxBytes: 0,
  txBytes: 0,
  ioValue: 0,
});

const userId = store.state.user?.loginUser?.id ?? 0;
let socket: WebSocket | null = null; // 用于存储实例化后websocket

const handleClick = (record: ContainerVO) => {
  // 如果已存在WebSocket连接，先关闭
  if (socket !== null) {
    socket.close();
  }

  // 创建新的WebSocket连接
  socket = new WebSocket('ws://localhost:8088/api/webSocket/' + userId);

  // 连接打开时的处理
  socket.onopen = () => {
    console.log('WebSocket连接已建立');
    // 可以发送消息给后端请求特定容器的数据
    socket.send(JSON.stringify({
      userId: userId,
      ctrId: record.containerId
    }));
  };

  // 接收到消息时的处理
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // 更新响应式变量
    containerStats.cpuTotalUsage = data.cpuTotalUsage;
    containerStats.perCpuUsage = data.perCpuUsage;
    containerStats.onlineCpus = data.onlineCpus;
    containerStats.memoryUsage = data.memoryUsage;
    containerStats.memoryMaxUsage = data.memoryMaxUsage;
    containerStats.memoryLimit = data.memoryLimit;
    containerStats.numProcess = data.numProcess;
    containerStats.rxBytes = data.rxBytes;
    containerStats.txBytes = data.txBytes;
    containerStats.ioValue = data.ioValue;
  };

  // 连接关闭时的处理
  socket.onclose = () => {
    console.log('WebSocket连接已关闭');
  };

  // 连接错误时的处理
  socket.onerror = (error) => {
    console.error('WebSocket连接错误', error);
  };
  visible.value = true;

};

const handleCancel = () => {
  console.log("客户端主动断开socket");
  visible.value = false;
  // 关闭WebSocket连接
  if (socket) {
    socket.close();
  }
}

/**
 * 表单信息
 */
/*const form = reactive({
  image: "",
});*/

const tableRef = ref();

//list空数组
const dataList = ref([]);

// 分页查询总条数
const total = ref(0);

// 分页查询参数
const searchParams = ref({
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  const res = await ContainerControllerService.listContainerByPageUsingPost(
      searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

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
});

const formatDateToHour = (dateString: string): string => {
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
/*const handleSubmit = async () => {
  const res = await ImageControllerService.pullUsingGet(form.image);
  if (res.code === 0) {
    message.success("拉取镜像成功");
    loadData();
  } else {
    message.error("拉取镜像失败");
  }
};*/

const columns = [
  {
    title: "容器id",
    slotName: "containerIdSlot",
  },
  {
    title: "容器名",
    dataIndex: "containerName",
  },
  {
    title: "镜像名",
    dataIndex: "image",
  },
  {
    title: "映射端口",
    dataIndex: "ports",
  },
  {
    title: "容器ip",
    dataIndex: "ip",
  },
  {
    title: "状态",
    slotName: "statusSlot",
  },
  {
    title: "创建时间",
    slotName: "createTimeSlot",
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

const doDelete = async (containerVO: ContainerVO) => {
  const res = await ContainerControllerService.removeUsingGet(containerVO.containerId as string);
  if (res.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败" + res.message);
  }
};

const doRestart = async (containerVO: ContainerVO) => {
  const res = await ContainerControllerService.restartUsingGet(containerVO.containerId as string);
  if (res.code === 0) {
    message.success("重启成功");
    loadData();
  } else {
    message.error("重启失败" + res.message);
  }
};

const doStart = async (containerVO: ContainerVO) => {
  const res = await ContainerControllerService.startOrStopUsingGet(containerVO.containerId as string);
  if (res.code === 0) {
    message.success("启动成功");
    loadData();
  } else {
    message.error("启动失败" + res.message);
  }
};

const doStop = async (containerVO: ContainerVO) => {
  const res = await ContainerControllerService.startOrStopUsingGet(containerVO.containerId as string);
  if (res.code === 0) {
    message.success("停止容器成功");
    loadData();
  } else {
    message.error("停止容器失败" + res.message);
  }
};

const downloadLog = async (containerVO: ContainerVO) => {

  // 发送Ajax请求获取文件二进制数据
    axios({
      url: '/api/container/downloadLog',
      method: 'GET',
      responseType: 'blob',
      params: { containerId: containerVO.containerId } // 修改为对象形式传递参数
    }).then((response) => {
      console.log('!!!---res',response)
      // 此处返回的blob对象，response已经是Blob类型，无需再包装成Blob
      var fileURL = window.URL.createObjectURL(response.data); // 修改为直接使用response
      console.log(fileURL, 'fileURL');
      var fileName = 'log.txt'; // 假设日志文件名称为log.txt，这里需要定义fileName变量
      var fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', fileName);
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink); // 下载完成后移除元素
      window.URL.revokeObjectURL(fileURL); // 释放URL对象
    }).catch(error => {
      console.error('下载日志失败:', error);
    });
};

const router = useRouter();

/*const doRunCtr = async () => {
  const res = await ContainerControllerService.runUsingPost(runCtrForm);
  if (res.code === 0) {
    message.success("运行成功");
    loadData();
  } else {
    message.error("运行失败" + res.message);
  }
};*/

/*const doUpdate = (yunImage: YunImage) => {
  router.push({
    path: "/update/question",
    query: {
      id: yunImage.id,
    },
  });
};*/
</script>

<style scoped>
#imageListView {
}

.custom-link {
  color: #007bff; /* 链接文本颜色 */
  text-decoration: none; /* 去除下划线 */
  border: 1px solid #007bff; /* 添加边框 */
  padding: 5px 10px; /* 内边距 */
  border-radius: 5px; /* 边框圆角 */
  transition: background-color 0.3s; /* 背景颜色过渡效果 */
}
</style>
