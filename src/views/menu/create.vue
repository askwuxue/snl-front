<template>
  <div>
    <!-- 使用子组件并且传递数据给子组件，子组件根据数据进行渲染 -->
    <create-or-edit></create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './components/createOrEdit.vue'
export default {
  name: 'CreateMenu',
  components: {
    CreateOrEdit
  }
}
</script>

<style lang="scss" scoped>
</style>
