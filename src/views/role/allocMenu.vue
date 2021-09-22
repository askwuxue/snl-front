<template>
  <div class="alloc-menu">
    <el-card>
      <el-tree
        ref="menu-tree"
        :data="menu"
        :props="defaultProps"
        :default-checked-keys="checkedKeys"
        node-key="id"
        show-checkbox
        default-expand-all
      ></el-tree>
      <el-button
        @click="onReset"
      >
      重置</el-button>
      <el-button
        type="primary"
        @click="saveMenu"
      >
      保存</el-button>
    </el-card>
  </div>
</template>

<script>
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/interface/menu'
import { Message } from 'element-ui'
export default {
  name: 'allocMenu',
  props: {
    // TODO 接受参数作为路由组件传递的参数，解耦路由和参数，在路由组件中配置props属性值为true，所有使用该组件的时候传递的props值都可以作为路由参数进行使用
    roleId: {
      type: [Number, String],
      require: true
    }
  },
  data () {
    return {
      menu: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },

      // 勾选的节点的 key 的数组
      checkedKeys: [],

      // 正在处于保存或者重置状态
      isLoading: false
    }
  },
  created () {
    // 加载所有菜单
    this.loadingMenuList()
    // 加载角色的菜单
    this.loadingRoleMenus()
  },
  methods: {

    // 加载菜单并且按照层级显示
    async loadingMenuList () {
      const { data: { code, data } } = await getMenuNodeList()
      if (code === '000000') {
        this.menu = data
      }
    },

    // 根据角色的菜单删选checkedKey
    getCheckedKeys (data) {
      data.forEach(menu => {
        // 当前menu具有subMenuList
        if (menu.subMenuList) {
          return this.getCheckedKeys(menu.subMenuList)
        }
        // 当前是叶子节点并且状态为选中状态
        if (!menu.subMenuList && menu.selected) {
          // TODO 为什么使用rest参数的方式而不是使用push的方式
          this.checkedKeys = [...this.checkedKeys, menu.id]
        }
      })
    },

    // 加载角色的菜单
    async loadingRoleMenus () {
      const { data: { code, data } } = await getRoleMenus(this.roleId)
      if (code === '000000') {
        this.getCheckedKeys(data)
      }
    },

    // 保存菜单列表
    async saveMenu () {
      const { data: { code, mesg } } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })
      // 保存成功
      if (code === '000000') {
        if (!this.isLoading) {
          Message({
            type: 'success',
            message: '保存成功',
            onClose: () => {
              this.isLoading = false
            }
          })
        }
      } else {
        if (!this.isLoading) {
          Message({
            type: 'error',
            message: mesg,
            onClose: () => {
              this.isLoading = false
            }
          })
        }
      }
      this.isLoading = true
    },

    // 清空菜单列表
    onReset () {
      // 通过 keys 设置目前勾选的节点，使用此方法必须设置 node-key 属性
      // (keys, leafOnly) 接收两个参数，1. 勾选节点的 key 的数组 2. boolean 类型的参数，若为 true 则仅设置叶子节点的选中状态，默认值为 false
      this.$refs['menu-tree'].setCheckedKeys([])
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
