<template>
  <div id="imageForm">
    <a-form
        :model="form"
        auto-label-width
        label-align="left"
        style="max-width: 480px; margin: 0 auto"
        @submit="handleSubmit"
    >
      <a-form-item field="image"
                   tooltip="输入repository:tag，如果只输入repository，那么tag默认为latest" label="镜像">
        <a-input v-model="form.image" placeholder="请输入镜像"/>

        <a-button html-type="submit" style="width: 120px;margin-left: 10px" type="primary">
          拉取
        </a-button>
      </a-form-item>
      <!--      <a-form-item>
              <a href="https://hub.docker.com/" class="custom-link">
                前往dockerhub查看可用的镜像
              </a>
            </a-form-item>-->
    </a-form>
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
      <template #typeSlot="{ record }">
        {{ record.imageType === 0 ? '公共' : '私有' }}
      </template>
      <template #createTimeSlot="{ record }">
        {{ formatDateToHour(record.createTime) }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="handleClick(record)"> 运行</a-button>

          <div :class="{'modal-open-background': visible}">
            <a-modal v-model:visible="visible" title="运行容器" @cancel="handleCancel" @before-ok="handleBeforeOk">
              <a-form :model="runCtrForm"
                      auto-label-width
                      label-align="left"
                      style="max-width: 420px; margin: 0 auto"
              >
                <a-form-item tooltip="如果您的容器需要网络服务，请填写容器端口。公共镜像可以不填写" field="containerPort"
                             label="容器端口">
                  <a-input v-model="runCtrForm.containerPort"/>
                </a-form-item>
                <a-form-item tooltip="不填写则默认使用系统分配的端口" field="name" label="宿主机端口">
                  <a-input v-model="runCtrForm.hostPort"/>
                </a-form-item>
                <a-form-item field="imageId" label="镜像id">
                  <a-input v-model="runCtrForm.imageId" disabled/>
                </a-form-item>
                <a-form-item tooltip="不填写则系统随机生成别名" field="name" label="别名">
                  <a-input v-model="runCtrForm.name"/>
                </a-form-item>
                <!--                <a-form-item>
                                  <a-button html-type="submit" style="width: 120px" type="primary">
                                    运行
                                  </a-button>
                                </a-form-item>-->
              </a-form>
            </a-modal>
          </div>


          <a-button status="danger" @click="doDelete(record)" :disabled="record.imageType === 0">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref, watchEffect} from "vue";
import {ContainerControllerService, CtrRunRequest, ImageControllerService, YunImage,} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import {useRouter} from "vue-router";

const visible = ref(false);

const runCtrForm = reactive({
  containerPort: 0,
  hostPort: 0,
  imageId: "",
  name: "",
} as CtrRunRequest);

const handleClick = (record) => {
  visible.value = true;
  runCtrForm.imageId = record.imageId;
  runCtrForm.containerPort = record.port;
};

const handleBeforeOk = (done) => {
  window.setTimeout(() => {
    doRunCtr()
  }, 1500)
};

const handleCancel = () => {
  visible.value = false;
}

const router = useRouter();

/**
 * 表单信息
 */
const form = reactive({
  image: "",
});

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
  const res = await ImageControllerService.listImageByPageUsingPost(
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
const handleSubmit = async () => {
  const res = await ImageControllerService.pullUsingGet(form.image);
  if (res.code === 0) {
    message.success("拉取镜像成功");
    loadData();
  } else {
    message.error("拉取镜像失败");
  }
};

// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "repository",
    dataIndex: "repository",
  },
  {
    title: "tag",
    dataIndex: "tag",
  },
  {
    title: "大小（MB）",
    dataIndex: "imageSize",
  },
  {
    title: "暴露端口",
    dataIndex: "port",
  },
  {
    title: "类型",
    slotName: "typeSlot",
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

const doDelete = async (yunImage: YunImage) => {
  const res = await ImageControllerService.removeUsingGet1(yunImage.id as number
  );
  if (res.code === 0) {
    message.success("删除成功");
    loadData();
  } else {
    message.error("删除失败" + res.message);
  }
};


const doRunCtr = async () => {
  const res = await ContainerControllerService.runUsingPost(runCtrForm);
  if (res.code === 0) {
    message.success("启动容器成功");
    router.push({
      path: "/containerList",
    });
  } else {
    message.error("启动容器失败" + res.message);
  }
};


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

.modal-open-background {
  background-color: rgba(255, 255, 255, 0.5); /* 半透明白色背景 */
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
