<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
          <el-button
          @click="handleCreate">添加菜单</el-button>
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  methods: {
    // 跳转跳转到create-menu
    handleCreate () {
      this.$router.push({
        name: 'menu-create'
      })
    }
  }
}
</script>

<style lang="sass" scoped>

</style>
