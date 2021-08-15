<template>
  <div id="app-header">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>

  <!-- 下拉菜单 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      <!-- 用户头像 -->
      <el-avatar
      :size="size"
      :src="userInfo.portrait || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'"></el-avatar>
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>{{userInfo.userName}}</el-dropdown-item>
      <el-dropdown-item divided>退出</el-dropdown-item>
    </el-dropdown-menu>
</el-dropdown>
  </div>
</template>

<script>
import { getUserInfo } from '@/interface/user'
export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: null
    }
  },
  // 生命周期函数中不处理具体的业务逻辑
  created () {
    this.loadingUserInfo()
  },
  methods: {
    async loadingUserInfo () {
      // 错误处理
      try {
        // 获取数据成功
        const { data } = await getUserInfo()
        this.userInfo = data.content
      } catch (err) {
        console.log('res: ', err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #app-header {
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: space-between;
  }
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
</style>
