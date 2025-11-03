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
        <a-tag :color="record.status === 'running' ? 'green' : 'red'" bordered>
          <template #icon>
            <icon-check-circle-fill v-if="record.status === 'running'"/>
            <icon-close-circle-fill v-else/>
          </template>
          {{ record.status === 'running' ? '运行中' : '已停止' }}
        </a-tag>
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

          <a-button type="primary" @click="doRestart(record)" title="重启">
            <template #icon><icon-refresh /></template>
          </a-button>
          <a-button
            :type="record.status === 'running' ? 'warning' : 'primary'"
            @click="record.status === 'running' ? doStop(record) : doStart(record)"
            :title="record.status === 'running' ? '停止' : '启动'"
          >
            <template #icon>
              <icon-pause v-if="record.status === 'running'"/>
              <icon-play-arrow v-else/>
            </template>
          </a-button>
          <a-button type="primary" @click="downloadLog(record)" title="查看日志">
            <template #icon><icon-file /></template>
          </a-button>
          <a-button status="danger" @click="doDelete(record)" title="删除">
            <template #icon><icon-delete /></template>
          </a-button>

        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watchEffect} from "vue";
import {ContainerControllerService, ContainerVO,} from "../../../generated";
import {
  IconRefresh,
  IconPlayArrow,
  IconFile,
  IconPause,
  IconDelete
} from '@arco-design/web-vue/es/icon';
import message from "@arco-design/web-vue/es/message";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

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

  // 创建新的WebSocket连接，url填后端服务地址
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
  try {
    const res = await ContainerControllerService.logCtrUsingGet(containerVO.containerId as string);

    // 创建Blob对象，指定内容类型为纯文本
    const blob = new Blob([res], { type: 'text/plain' });

    // 创建一个临时URL
    const fileURL = window.URL.createObjectURL(blob);

    // 生成文件名（使用容器ID的前12位作为文件名的一部分）
    const fileName = `container_${containerVO.containerId.slice(0, 12)}_log.txt`;

    // 创建一个a标签用于下载
    const fileLink = document.createElement('a');
    fileLink.href = fileURL;
    fileLink.setAttribute('download', fileName);

    // 将链接添加到文档中并模拟点击
    document.body.appendChild(fileLink);
    fileLink.click();

    // 下载完成后清理
    setTimeout(() => {
      document.body.removeChild(fileLink);
      window.URL.revokeObjectURL(fileURL); // 释放URL对象
    }, 100);

    message.success("日志文件下载成功");
  } catch (error) {
    message.error("下载日志失败：" + (error as Error).message);
    console.error('下载日志失败:', error);
  }
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
