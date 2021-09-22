<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
          <el-button
          @click="handleCreate">添加菜单</el-button>
      </div>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="菜单名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="level"
          label="菜单级数">
        </el-table-column>
        <el-table-column
          prop="icon"
          label="前端图标"
          width="180">
        </el-table-column>
        <el-table-column
          prop="orderNum"
          label="排序"
          width="180">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-link type="primary" @click="handleEdit($event, scope.$index, scope.row)" style="margin-right: 10px">编辑</el-link>
            <el-link type="danger"  @click="handleDelete($event, scope.$index, scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getAllMenu, deleteMenu } from '@/interface/menu'
import { Message, MessageBox } from 'element-ui'
export default {
  data () {
    return {
      tableData: []
    }
  },
  created () {
    this.loadingMenuNodeList()
  },
  methods: {
    // 跳转跳转到create-menu
    handleCreate () {
      this.$router.push({
        path: '/menu/create'
      })
    },

    // 获取所有菜单列表
    async loadingMenuNodeList () {
      const { data: { code }, data: { data } } = await getAllMenu()
      // 请求数据成功
      if (code === '000000') {
        this.tableData = data
        // console.log('this.tableData: ', this.tableData)
        // console.log('code: ', code)
        // console.log('data: ', data)
      }
    },

    // 编辑菜单项
    handleEdit (e, index, row) {
      const { id } = row
      this.$router.push({ path: `/menu/edit/${id}` })
      e.preventDefault()
    },

    // 删除菜单项
    handleDelete (e, index, row) {
      MessageBox('此操作将永久删除该菜单项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        // 确认删除
      }).then(async () => {
        try {
          const { data: { code } } = await deleteMenu(row.id)
          // 删除成功
          if (code === '000000') {
            Message({
              type: 'success',
              message: '删除成功!'
            })
            // 更新数据
            this.loadingMenuNodeList()
          // 删除失败
          } else {

          }
          // TODO 发送请求出错 如果不捕获错误，错误会传递给catch方法，调用catch中的提示方法
        } catch (e) {
          console.log('e: ', e)
        }
        // 取消删除
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
      e.preventDefault()
    }
  }
}
</script>

<style lang="scss" scoped>
// 自定时式样
::v-deep .cell {
  text-align: center;
}
// TODO element-ui的link颜色不太对
.el-link.el-link--primary {
  color: #409eff;
}
</style>
