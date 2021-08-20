<template>
  <div>
    <el-card class="box-card">
      <!-- header -->
      <div slot="header" class="clearfix">
       <el-form
       :inline="true"
       :model="form"
       ref="ruleForm"
       class="demo-form-inline">
        <el-form-item label="资源名称" prop="name">
          <el-input
          v-model="form.name"
           placeholder="资源名称"
           clearable
           ></el-input>
        </el-form-item>
        <el-form-item label="资源路径" prop="url">
          <el-input
          v-model="form.url"
          placeholder="资源路径"
          clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="资源分类" prop="categoryId">
          <el-select
          v-model="form.categoryId"
          placeholder="全部"
          clearable>
            <el-option
            v-for="item in resourceCategoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="onReset('ruleForm')"
            :disabled ="isLoading"
          >
          重置</el-button>
          <el-button
            type="primary"
            @click="onSubmit"
            :disabled ="isLoading"
          >查询</el-button>
        </el-form-item>
      </el-form>
      </div>
      <!-- body -->
      <div>
        <el-table
          :data="resourceData"
          v-loading="isLoading"
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label="编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="资源名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="url"
            label="资源路径"
            width="180">
          </el-table-column>
          <el-table-column
            prop="description"
            label="描述">
          </el-table-column>
          <el-table-column
            label="添加时间">
            <template slot-scope="scope">
              <span>{{scope.row.createdTime | formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="form.current"
          :page-sizes="[10, 50, 200, 500]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.total"
          :disabled="isLoading"
        >
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getResourcePages, getResCategoryList } from '@/interface/resource'
export default {
  name: 'ResourceList',
  data () {
    return {
      form: {
        // 资源名称
        name: '',
        // 资源路径
        url: '',
        // 资源id
        categoryId: '',
        // 当前页
        current: 1,
        // 每页显示的数量
        size: 10,
        // 资源总数
        total: 0
      },
      // 资源数据
      resourceData: [],
      // 资源分类列表
      resourceCategoryList: [],
      // 加载状态
      isLoading: false
    }
  },
  created () {
    // 按条件分页查询资源
    this.loadingResource()
    // 查询资源分类列表
    this.loadingResCategory()
  },
  methods: {

    // 按条件分页查询资源
    async loadingResource () {
      // 正在加载数据
      this.isLoading = true
      const { data: { code, data: { records, total } } } = await getResourcePages(this.form)
      // 数据请求成功
      if (code === '000000') {
        // 资源列表
        this.resourceData = records
        // 资源总数
        this.form.total = total
        // 数据加载完成
        this.isLoading = false
      }
    },

    // 查询资源分类列表
    async loadingResCategory () {
      const { data: { code, data } } = await getResCategoryList()
      // 数据获取成功
      if (code === '000000') {
        this.resourceCategoryList = data
      }
    },

    // 编辑资源
    handleEdit (row) {
      // console.log('row: ', row)
    },

    // 删除资源
    handleDelete (row) {
      // console.log('row: ', row)
    },

    // 改变每页显示页数触发函数
    handleSizeChange (val) {
      this.form.size = val
      this.form.current = 1
      this.loadingResource()
    },

    // 改变当前显示页数触发函数
    handleCurrentChange (val) {
      this.form.current = val
      this.loadingResource()
    },

    // 查询操作
    onSubmit () {
      // 查询请求之前，默认从第一页显示
      this.form.current = 1
      this.loadingResource()
    },

    // 重置操作
    onReset (ruleForm) {
      this.$refs[ruleForm].resetFields()
    }
  }
}
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  /* .box-card {
    width: 480px;
  } */

  /* 自定义属性 */
  .el-main {
    text-align: left !important;
    line-height: 100% !important;
  }

</style>
