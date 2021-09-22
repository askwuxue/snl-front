<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="add-role">
          <el-button @click="createRole">添加角色</el-button>
          <el-dialog :title="isEdit ? '编辑角色' : '添加角色'" :visible.sync="dialogFormVisible">
            <!-- TODO 多个不同组件之间的切换的话create、mounted等方法每次都会执行，如果是同一种组件多个页面那种切换就只会开始执行一次 为组件指定唯一key值 同一个组件多次加载只有第一次才会执行created生命周期函数-->
              <create-or-edit
                :is-edit="isEdit"
                :role-id="roleId"
                :key="roleId"
                @success="handleSuccess"
                @cancel="handleCancel"
              ></create-or-edit>
          </el-dialog>
      </div>
      <el-table
        :data="roleData"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="编号"
          width="180">
        </el-table-column>
        <el-table-column
          prop="name"
          label="角色名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>
        <el-table-column
          prop="createdTime"
          label="添加时间">
        </el-table-column>
        <el-table-column
          label="操作"
          min-width="200">
          <template slot-scope="scope">
            <div>
             <el-button
              size="small"
              @click="$router.push({
                name: 'alloc-menu',
                params: {
                  roleId: scope.row.id
                }
              })"
            >分配菜单</el-button>
             <el-button
              size="small"
             >分配资源</el-button>
          <!-- </div> -->
            <!-- <div> -->
              <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button size="small" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
</el-card>

</template>

<script>
import { getAll, deleteRole } from '@/interface/role'
import createOrEdit from './createOrEdit.vue'
import { Message, MessageBox } from 'element-ui'
export default {
  components: { createOrEdit },
  name: 'roleList',
  data () {
    return {
      form: {
        name: ''
      },
      // 角色数据
      roleData: [],
      // Dialog 显示
      dialogFormVisible: false,
      // 是否正在删除
      isDeleting: false,
      // 是否为编辑状态
      isEdit: false,
      // 当前角色ID
      roleId: ''
    }
  },
  created () {
    this.loadingGetAll()
  },
  methods: {

    // 加载角色信息
    async loadingGetAll () {
      const { data: { data, code } } = await getAll()
      // 数据请求成功
      if (code === '000000') {
        this.roleData = data
      } else {
        alert('数据请求失败')
      }
    },

    // 添加角色
    createRole () {
      this.dialogFormVisible = true
      this.isEdit = false
    },

    // 删除角色信息
    handleDelete ({ id }) {
      MessageBox('此操作将删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: { code, data } } = await deleteRole(id)
        // 数据删除成功
        if (code === '000000' && data === true) {
          // 如果正在加载则不弹框
          if (!this.isDeleting) {
            Message({
              type: 'success',
              message: '删除成功!',
              onClose: () => {
                this.isDeleting = false
              }
            })
          }
          // 正在删除
          this.isDeleting = true
          // 重新加载页面数据
          this.loadingGetAll()
          // 数据删除失败
        } else {
          alert('角色删除失败')
        }
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 编辑角色信息
    handleEdit ({ id }) {
      this.dialogFormVisible = true
      this.isEdit = true
      this.roleId = id
    },

    // 添加角色成功 父子组件通信
    handleSuccess () {
      // 关闭dialog弹窗
      this.dialogFormVisible = false
      // 重新加载页面数据
      this.loadingGetAll()
    },

    // dialog 取消
    handleCancel () {
      this.dialogFormVisible = false
    },

    onSubmit () {},

    onReset () {}
  }
}
</script>

<style lang="scss" scoped>
  // 自定义
  .add-role {
    line-height: 50px;
    text-align: left;
  }
</style>
