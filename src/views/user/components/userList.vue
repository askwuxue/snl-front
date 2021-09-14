<template>
  <div>
    <el-card>
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="form" class="demo-form-inline" ref="formRule">
          <el-form-item label="手机号">
            <el-input v-model="form.phone" placeholder="手机号"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <div class="block">
              <el-date-picker
                v-model="form.rangeData"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                onPick="dateOnPick">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleReset('formRule')">重置</el-button>
            <el-button type="primary" @click="handleQuery" :disabled="isLoading">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table
          :data="records"
          style="width: 100%"
          v-loading="isLoading">
          <el-table-column
            prop="id"
            label="用户ID"
            width="180">
          </el-table-column>
          <el-table-column
            prop="portrait"
            label="头像"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="用户名">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="注册时间">
          </el-table-column>
          <!-- TODO 封禁用户 -->
          <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
                :disabled="scope.row.isLoadingStatus"
                @change="changeState(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="showRoleDialog(scope.row)">分配角色</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分配角色Dialog -->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose">
          <el-select v-model="roleIdList" multiple placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="allocateUserRoles">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getUserPages } from '@/interface/user'
import { getAllRoles, allocateUserRoles, getUserRoles } from '@/interface/role'
export default {
  name: 'userList',
  data () {
    return {
      form: {
        currentPage: 0,
        pageSize: 0,
        phone: '',
        userId: '',
        startCreateTime: '',
        endCreateTime: '',
        rangeData: []
      },

      // 用户数据
      records: [],

      // 加载状态
      isLoading: false,

      // 分配角色Dialog显示
      dialogVisible: false,

      // 分配角色下拉菜单数据
      roles: [],
      // 下拉菜单选择数据
      roleIdList: [],
      // 选择分配角色的用户id
      userId: null
    }
  },
  created () {
    this.loadingUsers()
  },
  methods: {
    // 加载用户
    async loadingUsers () {
      const { rangeData } = this.form
      if (rangeData?.length) {
        this.form.startCreateTime = rangeData[0]
        this.form.endCreateTime = rangeData[1]
        // console.log('rangeData: ', this.form.rangeData)
      } else {
        this.form.startCreateTime = ''
        this.form.endCreateTime = ''
      }

      // 请求数据
      this.isLoading = true
      const { data: { code, data: { records } } } = await getUserPages(this.form)
      if (code === '000000') {
        this.records = records
        this.isLoading = false
      }
    },

    // 查询
    handleQuery () {
      this.loadingUsers()
      this.form.currentPage = 1
    },

    // 重置
    handleReset (formRule) {
      console.log(this.$refs[formRule])
      this.$refs[formRule].resetFields()
    },

    // 展示分配角色Dialog
    async showRoleDialog (row) {
      this.userId = row?.id
      this.dialogVisible = true
      // 获取所有角色
      const { data: { code, data } } = await getAllRoles()
      if (code === '000000') {
        this.roles = data
      }
      // 获取用户角色
      const { data: userRoles } = await getUserRoles(this.userId)
      if (userRoles.code === '000000') {
        // 设置给下拉菜单选择数据
        this.roleIdList = userRoles.data.map(role => role.id)
      }
    },

    // 给用户分配角色
    async allocateUserRoles () {
      const { data: { code } } = await allocateUserRoles({
        userId: this.userId,
        roleIdList: this.roleIdList
      })
      if (code === '000000') {
        this.$message({
          type: 'success',
          message: '分配角色成功'
        })
        // TODO 分配角色失败
      } else {

      }
      this.dialogVisible = false
    },

    handleClose () {},

    changeState () {}
  }
}
</script>

<style lang="scss" scoped>
// 自定义样式

</style>
