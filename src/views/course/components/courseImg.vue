<template>
  <div>
    <el-form-item :label="label">
      <el-upload
        class="avatar-uploader"
        :before-upload="beforeAvatarUpload"
        :show-file-list="false"
        :http-request="uploadImg">
        <img v-if="value" :src="value" class="avatar">
        <i v-else class="avatar-uploader-icon">
        <el-button size="small" type="primary">点击上传</el-button>
        </i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
import { uploadImg } from '@/interface/course'

export default {
  name: 'CourseImg',
  props: {
    value: {
      type: String
    },
    label: {
      type: String
    },
    limit: {
      type: Number,
      default: 2
    }
  },
  methods: {
    // 上传文件之前的钩子
    beforeAvatarUpload (file) {
      // const isJPG = file.type === 'image/jpeg'
      const isLimit = file.size / 1024 / 1024 > this.limit

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      // }
      if (isLimit) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLimit
    },

    // // 文件上传成功钩子
    // handleAvatarSuccess (res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw)
    //   console.log('this.imageUrl: ', this.imageUrl)
    // },

    // 图片上传功能 覆盖upload组件的图片上传
    async uploadImg (options) {
      const { file } = options
      const formData = new FormData()
      formData.append('file', file)
      const { data: { code, data, mesg } } = await uploadImg(formData)
      // 图片上传成功
      if (code === '000000') {
        // this.course.courseListImg = data.name
        // 出发自定义事件和父组件的绑定的v-model通信
        this.$emit('input', data.name)
      // TODO 文件上传失败
      } else {
        alert(mesg)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// TODO 当 <style> 标签有 scoped 属性时，它的 CSS 只作用于当前组件中的元素
// TODO 深度作用选择器
::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    display: inline-block;
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
