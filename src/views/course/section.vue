<template>
  <div class="course-section">
    <el-card>
      <el-tree
      :data="data"
      :props="defaultProps"
      draggable
      :allow-drop="handleAllowDrop"
      @node-drop="handleNodeDrop">
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
import { getSectionAndLesson, saveOrUpdate, saveOrUpdateSection } from '@/interface/course'
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
    },

    // 拖拽判断 只允许在同一个父极下兄弟位置间拖动
    handleAllowDrop (draggingNode, dropNode, type) {
      const draggingId = draggingNode.data.sectionId
      const dropingId = dropNode.data.sectionId
      return type !== 'inner' && (draggingId === dropingId)
    },

    // 拖拽成功完成时触发的事件
    async handleNodeDrop (draggNode, dropNode) {
      try {
        await Promise.all(dropNode.parent.childNodes.map(async (item, index) => {
        // 当前拖动的是课时
          if (draggNode.data.sectionId) {
            // 返回Promise对象
            return saveOrUpdate({
              id: item.data.id,
              orderNum: index
            })
          // 当前拖动的是章节
          } else {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      } catch (error) {
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      }
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
