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
      <template #createTimeSlot="{ record }">
        {{ formatDateToHour(record.createTime) }}
      </template>
      <template #containerIdSlot="{ record }">
        {{ record.containerId.slice(0, 12) }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="handleClick(record)"> 运行详情</a-button>

<!--          <a-modal v-model:visible="visible" title="运行容器" @cancel="handleCancel" @before-ok="handleBeforeOk">
            <a-form :model="runCtrForm"
                    auto-label-width
                    label-align="left"
                    style="max-width: 420px; margin: 0 auto">
              <a-form-item field="" label="容器端口">
                <a-input v-model="runCtrForm.containerPort"/>
              </a-form-item>
              <a-form-item field="name" label="宿主机端口">
                <a-input v-model="runCtrForm.hostPort"/>
              </a-form-item>
              <a-form-item field="imageId" label="镜像id">
                <a-input v-model="runCtrForm.imageId" disabled/>
              </a-form-item>
              <a-form-item field="name" label="别名">
                <a-input v-model="runCtrForm.name"/>
              </a-form-item>
            </a-form>
          </a-modal>-->

          <a-button type="primary" @click="doRestart(record)">重启</a-button>
          <a-button type="primary" @click="doStart(record)">启动</a-button>
          <a-button status="warning" @click="doStop(record)">停止</a-button>
          <a-button status="danger" @click="doDelete(record)">删除</a-button>

        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watchEffect} from "vue";
import {
  ImageControllerService, Page_YunImage_, UserLoginRequest, YunImage,
  ContainerControllerService, CtrRunRequest, ContainerVO,


} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import * as querystring from "querystring";
import {useRouter} from "vue-router";
import {reactive} from "vue";

const visible = ref(false);

/*const runCtrForm = reactive({
  containerPort: 0,
  hostPort: 0,
  imageId: "",
  name: "",
} as CtrRunRequest);*/

const handleClick = (record:ContainerVO) => {
  visible.value = true;
  //runCtrForm.imageId = record.imageId;
};

const handleBeforeOk = (done) => {
  window.setTimeout(() => {

  }, 3000)
};

const handleCancel = () => {
  visible.value = false;
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
    dataIndex: "status",
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
