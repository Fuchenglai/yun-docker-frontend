<template>
  <div id="userLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <a-space>
          <img src="../assets/docker-logo.png" class="logo" />
          <div>云 Docker</div>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        <div class="footer-content">
          <a href="https://fuchenglai.github.io/" target="_blank">
            云Docker by 程序员赖富城
          </a>
          <span>电话: 193-0303-2510</span>
          <span>邮箱: fucheng_lai@163.com</span>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
#userLayout {
  text-align: center;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")
    0% 0% / 100% 100%;
}

#userLayout .logo {
  width: 64px;
  height: 64px;
}

#userLayout .header {
  margin-top: 16px;
}

#userLayout .content {
  margin-bottom: 16px;
  padding: 20px;
}

#userLayout .footer {
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

#userLayout .footer .footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

#userLayout .footer span {
  color: #666;
}
</style>
<script>
</script>
