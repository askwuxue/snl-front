<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-steps :active="activeStep" finish-status="success">
          <el-step
          v-for="(item, index) in steps"
          :key="item.id"
          :title="item.title"
          @click.native="onBackStep(index)"></el-step>
        </el-steps>
      </div>
      <div>
        <!-- TODO 使用表单验证规则时必须为el-form绑定model数据和rules数据，也必须为el-form添加prop属性 -->
        <!-- TODO 表单绑定数据中有引用类型导致表单验证无法捕捉到该引用类型中的属性值 -->
        <el-form :rules="rules" :model="course">
          <div v-show="activeStep === 1">
            <h3>基本信息</h3>
            <el-form-item label="名称" prop="courseName">
              <el-input
                v-model="course.courseName"
                minlength="3"
                maxlength="50"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="教师姓名" prop="teacherName">
              <el-input
                v-model="course.teacherDTO.teacherName"
                minlength="2"
                maxlength="20"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="职位">
              <el-input
                v-model="course.teacherDTO.position"
                minlength="3"
                maxlength="50"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="讲师简介">
              <el-input
                type="textarea"
                v-model="course.teacherDTO.description"
                minlength="3"
                maxlength="200"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="课程概述">
              <el-input
                type="textarea"
                v-model="course.previewFirstField"
                minlength="3"
                maxlength="100"
                show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="课程排序">
              <el-input type="number" v-model="course.sortNum"></el-input>
            </el-form-item>
          </div>
          <div v-show="activeStep === 2">
            <h3>封面</h3>
            <!-- 图片上传组件 -->
            <course-img
              v-model="course.courseListImg"
              label="课程封面"
              :limit="3"></course-img>
            <course-img
              v-model="course.courseImgUrl"
              label="解锁封面"
              :limit="3"></course-img>
          </div>
          <div v-show="activeStep === 3">
            <h3>销售信息</h3>
            <el-form-item label="售卖价格">
              <el-input
                type="number"
                v-model="course.discounts"
                placeholder="请输入售卖价格"
                :min="0">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品原价">
              <el-input
                type="number"
                v-model="course.price"
                placeholder="请输入商品原价"
                :min="0">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="销量">
              <el-input
              type="number"
              v-model="course.sales"
              :min="0"
              >
                <template slot="append">单</template>
              </el-input>
            </el-form-item>
            <el-form-item label="活动标签">
              <el-input v-model="course.discountsTag">
              </el-input>
            </el-form-item>
          </div>
          <div v-show="activeStep === 4">
            <h3>秒杀信息</h3>
            <el-form-item label="是否开启秒杀">
              <el-switch
                v-model="course.activityCourse"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <!-- 秒杀功能开启时显示 -->
            <template v-if="course.activityCourse">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="course.activityCourseDTO.beginTime"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="course.activityCourseDTO.endTime"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="秒杀价">
                <el-input
                type="number"
                v-model="course.activityCourseDTO.amount"
                :min="0">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="秒杀库存">
                <el-input
                type="number"
                v-model="course.activityCourseDTO.stock"
                :min="0">
                  <template slot="append">件</template>
                </el-input>
              </el-form-item>
            </template>
          </div>
          <div v-show="activeStep === 5">
            <h3>课程详情</h3>
            <el-form-item>
              <!-- 富文本编辑组件 -->
              <!-- v-model 实现组件间的动态数据绑定 -->
              <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
            </el-form-item>
            <el-form-item label="是否上架">
              <el-switch
                v-model="course.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0">
              </el-switch>
            </el-form-item>
          </div>
          <el-button
          type="primary"
          v-show="isShowForm"
          @click="saveCourse">保存</el-button>
        </el-form>
        <el-button style="margin-top: 12px;" @click="next" v-if="isShowNext">下一步</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { saveOrUpdateCourse, getCourseById } from '@/interface/course'
import CourseImg from './courseImg'
import TextEditor from '@/components/TextEditor'
export default {
  name: 'createOrEdit',
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [String, Number]
    }
  },
  components: {
    CourseImg,
    TextEditor
  },
  data () {
    return {
      // 步骤信息
      steps: [
        {
          id: 1,
          title: '基本信息'
        },
        {
          id: 2,
          title: '课程封面'
        },
        {
          id: 3,
          title: '销售信息'
        },
        {
          id: 4,
          title: '秒杀信息'
        },
        {
          id: 5,
          title: '课程详情'
        }
      ],
      // 课程信息
      course: {
        // id: 0,
        // 课程名
        courseName: '',
        brief: '',
        // 教师信息
        teacherDTO: {
          // id: 0,
          // courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        // 课程详情
        courseDescriptionMarkDown: '',
        // 原价
        price: 0,
        // 售卖价格
        discounts: 0,
        priceTag: '',
        // 活动标签
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        // 课程封面地址
        courseListImg: '',
        // 课程解锁封面地址
        courseImgUrl: '',
        // 排序
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        // 上架状态 默认不上架
        status: 0,
        // 销量
        sales: 0,
        // 是否开启秒杀
        activityCourse: false,
        // 秒杀信息
        activityCourseDTO: {
          // id: 0,
          // courseId: 0,
          // 秒杀开始时间
          beginTime: '',
          // 秒杀结束时间
          endTime: '',
          // 价格
          amount: 0,
          // 库存
          stock: 0
        },
        autoOnlineTime: ''
      },
      // 表单验证规则
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 3, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ]
        // TODO 表单验证失败 结合上方TODO
        // teacherName: [
        //   {
        //     validator: teacherNameCheck, trigger: 'blur'
        //   }
        // { required: true, message: '请输入教师名称', trigger: 'blur' },
        // { min: 2, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        // ]
      },
      // 当前步骤
      activeStep: 0,
      // 是否显示下一步
      isShowNext: true,
      isShowForm: false
    }
  },
  created () {
    // 判断是否为编辑
    if (this.isEdit) {
      this.loadingCourse()
    }
    this.next()
  },
  methods: {

    // 下一步
    next () {
      if (++this.activeStep === 5) {
        this.isShowForm = true
        this.isShowNext = false
      }
    },

    // 回退到某一步
    onBackStep (index) {
      this.activeStep = ++index
    },

    // 保存或者更新课程信息
    async saveCourse () {
      const { data: { code } } = await saveOrUpdateCourse(this.course)
      if (code === '000000') {
        this.$message({
          type: 'success',
          message: this.isEdit === true ? '编辑成功' : '创建课程成功'
        })
        this.$router.push({
          path: '/course'
        })
        // TODO 保存失败
      } else {
        alert('保存失败')
      }
    },

    // 根据ID加载课程信息
    async loadingCourse () {
      const { data: { code, data } } = await getCourseById(this.courseId)
      // 获取数据成功
      if (code === '000000') {
        this.course = data
        // TODO 如果秒杀标识为false，则秒杀的信息为null，导致开启秒杀时报错，为秒杀信息赋默认值
        if (!data.activityCourse) {
          this.course.activityCourseDTO = {
            // 秒杀开始时间
            beginTime: '',
            // 秒杀结束时间
            endTime: '',
            // 价格
            amount: 0,
            // 库存
            stock: 0
          }
        }
        // TODO 获取数据失败
      } else {
        alert('获取数据失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
</style>
