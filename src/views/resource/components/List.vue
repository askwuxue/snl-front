<template>
  <div>
    <el-card class="box-card">
      <!-- header -->
      <div slot="header" class="clearfix">
       <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="审批人">
          <el-input v-model="form.user" placeholder="审批人"></el-input>
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
      </div>
      <!-- body -->
      <div>
        <el-table
          :data="resourceData"
          style="width: 100%">
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
          :page-sizes="[form.size, 50, 200, 500]"
          :page-size="form.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="form.total">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getResourcePages } from '@/interface/resource'
export default {
  name: 'ResourceList',
  data () {
    return {
      form: {
        user: '',
        region: '',
        // 当前页
        current: 1,
        // 每页显示的数量
        size: 10,
        // 资源总数
        total: 0
      },
      resourceData: []
    }
  },
  created () {
    this.loadingResource()
  },
  methods: {

    // 按条件分页查询资源
    async loadingResource () {
      const { data: { code, data: { records, total } } } = await getResourcePages({ size: this.form.size, current: this.form.current })
      // 数据请求成功
      if (code === '000000') {
        // 资源列表
        this.resourceData = records
        // 资源总数
        this.form.total = total
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
