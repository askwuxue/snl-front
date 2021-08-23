<template>
  <div>
    <el-form :model="form">
        <el-form-item
        label="角色名称"
        :label-width="formLabelWidth">
          <el-input
            v-model="role.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="角色编码"
          :label-width="formLabelWidth">
          <el-input
            v-model="role.code"
            autocomplete="off"
          ></el-input>
        </el-form-item>
         <el-form-item
         label="角色描述"
         :label-width="formLabelWidth"
         >
          <el-input
            type="textarea"
            v-model="role.description"
            autocomplete="off"
          ></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleCreate">确 定</el-button>
    </div>
  </div>
</template>

<script>
import { saveOrUpdate, getRole } from '@/interface/role'
export default {
  name: 'createOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      dialogFormVisible: false,
      // 角色信息
      role: {
        id: '',
        name: '',
        code: '',
        description: ''
      }
      // TODO 备份role 犯了大错误引用类型，备份地址没有用
      // editSave: null
    }
  },
  created () {
    this.loadingRole()
  },
  methods: {

    // 点击dialog确定 确认添加数据或者更新数据
    async handleCreate () {
      const { data: { code } } = await saveOrUpdate(this.role)
      console.log('this.isEdit: ', this.isEdit)
      if (this.isEdit) {
        if (code === '000000') {
          this.$message({
            type: 'success',
            message: '更新角色成功!'
          })
          // 父子组件通信，注册success方法
          this.$emit('success')
          // 重置表达
          // TODO 在角色更新前不允许再次更新角色数据
          this.role = {}
        // 更新角色失败
        } else {
          alert('更新角色失败')
        }
      } else {
        // 添加角色成功
        if (code === '000000') {
          this.$message({
            type: 'success',
            message: '添加角色成功!'
          })
          // 父子组件通信，注册success方法
          this.$emit('success')
          // 重置表达
          this.role = {}
        // 添加角色失败
        } else {
          alert('添加角色失败')
        }
      }
    },

    // 点击dialog取消
    handleCancel () {
      this.$emit('cancel')
      // TODO 编辑状态下点击取消 role数据清空或者重新加载，之间的role数据不留存
      this.loadingRole()
    },

    // 加载角色
    async loadingRole () {
      const { data: { data, code } } = await getRole(this.roleId)
      // 加载成功
      if (code === '000000') {
        this.role = data
        // 根据ID加载角色失败
      } else {
        alert('加载角色失败')
      }
    }

  }
}
</script>

<style lang="scss" scoped>

</style>
