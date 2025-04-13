<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader/>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view/>
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
#basicLayout {
}

#basicLayout .header {
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 5px;
}

#basicLayout .content {
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 16px;
  padding: 20px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}

#basicLayout .footer .footer-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

#basicLayout .footer span {
  color: #666;
}
</style>
<script>
import GlobalHeader from "@/components/GlobalHeader";

export default {
  components: {GlobalHeader},
};
</script>
