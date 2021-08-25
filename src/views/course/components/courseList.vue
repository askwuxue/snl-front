<template>
  <div>
    <!-- 数据筛选功能 -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>数据筛选</span>
      </div>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="课程名称">
          <el-input v-model="form.courseName" placeholder="课程名称"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="shanghai"></el-option>
            <el-option label="下架" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 查询结果 -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>查询结果</span>
      </div>
      <el-table
        :data="records"
        style="width: 100%">
        <el-table-column
          prop="id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态">
        </el-table-column>
        <el-table-column
          label="操作">
          <template>
            <el-button>编辑</el-button>
            <el-button>内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getQueryCourses } from '@/interface/course'
export default {
  name: 'courseList',
  data () {
    return {
      // 默认查询参数
      form: {
        currentPage: 0,
        pageSize: 0,
        courseName: '',
        status: ''
      },

      // 课程数据
      records: [],
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  created () {
    this.loadingCourses()
  },

  methods: {
    async loadingCourses () {
      const { data: { code, data: { records } } } = await getQueryCourses({
        currentPage: 0,
        pageSize: 10,
        courseName: '',
        status: 0
      })
      // 请求数据成功
      if (code === '000000') {
        this.records = records
        // TODO 请求数据失败
      } else {

      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
