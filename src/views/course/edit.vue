<template>
  <div>
    <create-or-edit
    :isEdit="true"
    :courseId="courseId"></create-or-edit>
  </div>
</template>

<script>
import createOrEdit from './components/createOrEdit.vue'
export default {
  props: {
    courseId: {
      type: [String, Number]
    }
  },
  components: {
    createOrEdit
  }
}
</script>

<style lang="scss" scoped>

</style>
