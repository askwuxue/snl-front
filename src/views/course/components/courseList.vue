<template>
  <div>
    <!-- 数据筛选功能 -->
    <el-card>
      <div slot="header" class="clearfix">
        <span>数据筛选</span>
      </div>
      <el-form
        :inline="true"
        :model="form"
        ref="form"
        class="demo-form-inline">
        <!-- TODO 使用this.$refs[formRule].resetFields() 重置表达操作必须设置prop属性 -->
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="form.courseName" placeholder="课程名称"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="shanghai"></el-option>
            <el-option label="下架" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">查询</el-button>
          <el-button type="primary" @click="onReset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 查询结果 -->
    <el-card>
      <el-button @click="createCourse">添加课程</el-button>
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
          <!-- 注意 使用默认绑定时绑定的为字符串 使用v-bind方式绑定绑定的JavaScript表达式 -->
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
            <el-button @click="editCourse(scope.row)">编辑</el-button>
            <el-button>内容管理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- pagination 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="form.currentPage"
        :page-sizes="[10, 50, 200, 400]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPages">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getQueryCourses, changeState } from '@/interface/course'
import createCourse from '../create.vue'
export default {
  name: 'courseList',
  data () {
    return {
      // 默认查询参数
      form: {
        currentPage: 0,
        pageSize: 10,
        courseName: '',
        status: ''
      },

      // 课程数据
      records: [],

      // 课程数据总页数
      totalPages: 0

    }
  },
  created () {
    this.loadingCourses()
  },

  methods: {
    // 加载课程数据
    async loadingCourses () {
      const { data: { code, data: { records, total } } } = await getQueryCourses(this.form)
      // 请求数据成功
      if (code === '000000') {
        records.forEach(item => {
          item.isLoadingStatus = false
        })
        this.totalPages = total
        this.records = records
        // TODO 请求数据失败
      } else {

      }
    },

    // 查询操作
    onSubmit (form) {
      // 当前页置0
      this.form.currentPage = 0
      this.loadingCourses()
      // 查询条件清空
    },

    // 页数发生变化
    handleSizeChange (size) {
      this.form.pageSize = size
      this.form.currentPage = 0
      // 加载数据
      this.loadingCourses()
    },

    // 当前页发生变化
    handleCurrentChange (currentPage) {
      this.form.currentPage = currentPage
      // 加载数据
      this.loadingCourses()
    },

    // 重置查询
    onReset (form) {
      this.$refs[form].resetFields()
      this.loadingCourses()
    },

    // 改变课程上下架状态
    async changeState (row) {
      // 改变当前数据的isLoadingStatus属性值用于控制disabled
      row.isLoadingStatus = true
      const { status, id: courseId } = row
      const { data: { code } } = await changeState({
        status,
        courseId
      })
      // 改变课程状态成功
      if (code === '000000') {
        this.loadingCourses()
        row.isLoadingStatus = false
        this.$message({
          type: 'success',
          message: status === 1 ? '上架成功' : '下架成功'
        })
        // TODO 更改课程状态失败
      } else {

      }
    },

    // 添加课程
    createCourse () {
      this.$router.push({
        path: '/course/create',
        components: {
          createCourse
        }
      })
    },

    // 编辑课程信息
    editCourse ({ id }) {
      console.log('id: ', id)
      this.$router.push({
        name: 'course-edit',
        params: {
          courseId: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
