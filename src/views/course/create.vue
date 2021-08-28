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
              <el-input type="number" placeholder="请输入售卖价格">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="商品原价">
              <el-input type="number" placeholder="请输入商品原价">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="销量">
              <el-input type="number">
                <template slot="append">单</template>
              </el-input>
            </el-form-item>
            <el-form-item label="活动标签">
              <el-input>
              </el-input>
            </el-form-item>
          </div>
          <div v-show="activeStep === 4">
            <h3>秒杀信息</h3>
            <el-form-item label="是否开启秒杀">
              <el-switch
                v-model="isSecKill"
                active-color="#13ce66"
                inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
            <!-- 秒杀功能开启时显示 -->
            <template v-if="isSecKill">
              <el-form-item label="开始时间">
                <el-date-picker
                  v-model="startTime"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="结束时间">
                <el-date-picker
                  v-model="endTime"
                  type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="秒杀价">
                <el-input type="number">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="秒杀库存">
                <el-input type="number">
                  <template slot="append">件</template>
                </el-input>
              </el-form-item>
            </template>
          </div>
          <div v-show="activeStep === 5">
            <h3>课程详情</h3>
            <el-form-item>
              <el-input type="textarea" rows="20"></el-input>
            </el-form-item>
          </div>
          <el-button type="primary" v-show="isShowForm">保存</el-button>
        </el-form>
        <el-button style="margin-top: 12px;" @click="next" v-if="isShowNext">下一步</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { saveOrUpdateCourse } from '@/interface/course'
import CourseImg from './components/courseImg'
export default {
  name: 'createCourse',
  components: {
    CourseImg
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
      // 图片预览
      imageUrl: '',
      imageUrl2: '',
      // 课程信息
      course: {
        id: 0,
        courseName: '',
        brief: '',
        teacherDTO: {
          id: 0,
          courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        // 课程封面地址
        courseListImg: '',
        // 课程解锁封面地址
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: true,
        activityCourseDTO: {
          id: 0,
          courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
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
      isShowForm: false,
      // 是否开启秒杀功能
      isSecKill: false,
      // 秒杀开启时间
      startTime: '',
      // 秒杀结束时间
      endTime: ''
    }
  },
  created () {
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
    async loadingCourse () {
      const data = await saveOrUpdateCourse()
      console.log('data: ', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-step {
  cursor: pointer;
}
</style>
