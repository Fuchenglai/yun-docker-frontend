<template>
  <div class="about">
    <h2 class="title">本页讲解如何启动一个服务器</h2>
    <p class="content-text">
      在镜像页面，系统已经提供了常用的镜像，如Redis等。您也可以将镜像上传到DockerHub，在这里拉取自己的镜像，它的类型将会是私有。</p>
    <p class="content-text">系统已为您准备了一个springboot项目的镜像：yun-docker-demo，它的暴露端口是8080，并且类型是公共。</p>
    <img src="@/assets/image-intro.jpg" class="guide-image"/>
    <p class="content-text">点击运行按钮，公共镜像可以一键傻瓜式启动，这些配置都不填也可以点击确定按钮。</p>
    <p class="content-text">每次运行都会消耗一定的积分，鼠标可悬浮右上角昵称，查看还剩余多少积分，容器删除后会返还积分。</p>
    <img src="@/assets/run-image.jpg" class="guide-image"/>
    <p class="content-text">成功运行的容器如下所示：</p>
    <img src="@/assets/container-intro.jpg" class="guide-image"/>
    <p class="content-text">在浏览器输入ip + 宿主机端口，就能访问。</p>
    <img src="@/assets/docker-run-success.jpg" class="guide-image"/>
  </div>
</template>

<style scoped>
.about {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.content-text {
  font-size: 18px;
  line-height: 1.6;
  color: #34495e;
  margin: 20px 0;
}

.guide-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin: 20px 0;
  display: block;
}
</style>
