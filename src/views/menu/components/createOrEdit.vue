<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{isEdit ? '编辑菜单': '添加菜单'}}</span>
      </div>
      <el-form :label-position="labelPosition" ref="form" :model="form" label-width="80px">
        <el-form-item label="菜单名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="form.href"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单">
          <el-select v-model="form.parentId" placeholder="无上级菜单">
            <!-- 不选择菜单 即当前的菜单就是一级菜单 -->
            <el-option
              label="无上级菜单"
              :value="-1">
            </el-option>
            <!-- 选择一级菜单 -->
            <el-option
              v-for="item in parentMenuList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item label="前端图标">
          <el-input v-model="form.icon"></el-input>
        </el-form-item>
        <el-form-item label="是否显示">
          <el-radio-group v-model="form.shown">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序">
            <el-input-number v-model="form.orderNum" ></el-input-number>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button v-if="!isEdit">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getEditMenuInfo, createMenuList } from '@/interface/menu'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      labelPosition: 'left',
      // MenuList信息 parentId 为-1 则为1级菜单， 为1则为2级菜单
      parentMenuList: [],
      form: {
        id: '',
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        orderNum: '',
        description: '',
        shown: true
      }
    }
  },

  // 加载页面时获取编辑菜单页面信息
  created () {
    this.loadingMenuInfo()
  },
  methods: {
    async loadingMenuInfo () {
      // 获取动态路由传递的参数
      const id = this.$route.params.id
      // 根据动态路由的参数获取编辑菜单信息，默认参数为-1
      const { data: { data: { parentMenuList, menuInfo } }, data: { code } } = await getEditMenuInfo(id)
      // 编辑菜单
      if (this.isEdit) {
        // 请求数据成功
        if (code === '000000') {
          this.form = menuInfo
        }
        // 添加菜单
      } else {
        this.parentMenuList = parentMenuList
      }
    },
    async onSubmit () {
      // 1. 表单验证
      // 2. 发送请求
      const { data: { code, mesg } } = await createMenuList(this.form)
      if (code === '000000') {
        this.$message.success('添加菜单成功')
        this.$router.push({
          path: '/menu'
        })
      } else {
        this.$message.error(`添加菜单失败,${mesg}`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-select {
    width: 100%;
  }
  // TODO 改变element-UI的默认样式
  .clearfix {
    line-height: 60px;
    text-align: left;
    font-weight: 700;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
</style>
