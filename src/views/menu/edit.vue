<template>
  <div>
    <!-- 使用子组件并且传递数据给子组件，子组件根据数据进行渲染 -->
    <create-or-edit :isEdit="true"></create-or-edit>
  </div>
</template>

<script>
import CreateOrEdit from './components/createOrEdit'
export default {
  name: 'EditMenu',
  components: {
    CreateOrEdit
  }
}
</script>

<style lang="scss" scoped>

</style>
