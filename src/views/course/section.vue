<template>
  <div class="course-section">
    <el-card>
      <el-tree
      :data="data"
      :props="defaultProps"
      draggable>
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span v-if="data.sectionName">
          <el-button
            type="primary"
            size="mini"
            @click="() => append(data)">
            编辑
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="() => remove(node, data)">
            添加课时
          </el-button>
          <el-button
            type="primary"
            size="mini">
            状态
          </el-button>
        </span>
        <span v-else>
          <el-button
            type="primary"
            size="mini"
            @click="() => append(data)">
            编辑
          </el-button>
          <el-button
            type="primary"
            size="mini"
            @click="() => remove(node, data)">
            上传视频
          </el-button>
          <el-button
            type="primary"
            size="mini">
            状态
          </el-button>
        </span>
      </span>
      </el-tree>
    </el-card>
  </div>
</template>

<script>
import { getSectionAndLesson } from '@/interface/course'
export default {
  name: 'courseSection',
  props: {
    courseId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      data: [],
      defaultProps: {
        children: 'lessonDTOS',
        // TODO 根据label标签动态的处理嵌套层级name不一致的问题
        label: (label) => {
          return label.sectionName || label.theme
        }
      }
    }
  },

  created () {
    this.loadingSectionAndLesson()
  },

  methods: {
    // 加载课程管理
    async loadingSectionAndLesson () {
      const { data: { code, data } } = await getSectionAndLesson(this.courseId)
      if (code === '000000') {
        this.data = data
        // TODO 加载失败F
      } else {}
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
::v-deep .el-tree-node__content {
  height: auto;
}
</style>
