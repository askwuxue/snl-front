<template>
  <el-container>
  <el-aside width="200px">
    <app-aside></app-aside>
  </el-aside>
  <el-container>
    <el-header>
      <app-header></app-header>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
// 引入侧边栏组件
import AppAside from './component/AppAside'
// 引入头部组件
import AppHeader from './component/AppHeader.vue'

// import request from '@/utils/request'

export default {
  name: 'Layout',
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="scss" scoped>
  .el-container {
    height: 100vh;
  }

  .el-header {
      background-color: #fff;
      color: #333;
      text-align: center;
      line-height: 60px;
  }

  .el-aside {
    height: 100%;
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    // text-align: center;
    // line-height: 160px;
  }

</style>
