<template>
  <div class="course-video">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
       <h3>视频上传</h3>
      </div>
      <div>
        <el-form>
          <el-form-item label="课程">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="课时">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="视频上传">
            <el-upload
              action="xxxx"
              :file-list="fileList"
              :http-request="uploadVideo"
              ref="video-uploader">
              <el-button size="small" type="primary">视频上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="封面上传">
            <el-upload
              action="xxxx"
              :file-list="fileList"
              :http-request="uploadVideo"
              ref="image-uploader">
              <el-button size="small" type="primary">封面上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <p v-if="uploadPercentage !== 0">视频上传中: {{uploadPercentage}} %</p>
            <p v-if="isUploadSuccess">视频转码中: {{TransPercentage}} %</p>
          </el-form-item>
          <el-form-item>
            <el-button
            type="primary"
            @click="handleUpload"
            :disabled="isUploadAndTrans">开始上传</el-button>
            <el-button>返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  aliyunImagUploadAddressAdnAuth,
  aliyunVideoUploadAddressAdnAuth,
  aliyunTransCode,
  aliyunTransCodePercent
} from '@/interface/aliyun-upload'
import { Message } from 'element-ui'
export default {
  name: 'courseVideo',
  data () {
    return {
      uploader: null,
      fileList: [],
      // 上传图片地址
      imageUrl: null,
      // 视频ID
      videoId: null,
      // 文件名
      fileName: '',
      // 视频上传进度
      uploadPercentage: 0,
      // 视频转码进度
      TransPercentage: 0,
      // 视频上传状态
      isUploadSuccess: false,
      // 是否正在进行上传和转码
      isUploadAndTrans: false
    }
  },
  created () {
    this.initUploader()
  },
  methods: {
    // 视频上传
    uploadVideo ({ file }) {
    },

    handleUpload () {
      this.uploadPercentage = 0
      this.isUploadSuccess = false
      this.isUploadAndTrans = true
      const image = this.$refs['image-uploader'].uploadFiles[0]?.raw
      const video = this.$refs['video-uploader'].uploadFiles[0]?.raw
      this.uploader.addFile(image)
      this.uploader.addFile(video)
      this.uploader.startUpload()
    },

    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        // userID，必填，只需有值即可。
        userId: '1618139964448548',
        // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        region: '',
        // 分片大小默认1 MB，不能小于100 KB
        partSize: 1048576,
        // 并行上传分片个数，默认5
        parallel: 5,
        // 网络原因失败时，重新上传次数，默认为3
        retryCount: 3,
        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传
        onUploadstarted: async uploadInfo => {
          let uploadAddressAndAuth = null
          // 上传文件类型为图片
          if (uploadInfo.isImage) {
            // 请求图片接口获取数据
            const { data: { code, data } } = await aliyunImagUploadAddressAdnAuth()
            if (code === '000000') {
              uploadAddressAndAuth = data
              this.imageUrl = uploadAddressAndAuth.imageURL
            }
            // 上传文件类型为视频
          } else {
            this.fileName = uploadInfo.file.name
            const { data: { code, data } } = await aliyunVideoUploadAddressAdnAuth({ fileName: this.fileName, imageUrl: this.imageUrl })
            if (code === '000000') {
              uploadAddressAndAuth = data
              this.videoId = data.videoId
            }
          }
          // 设置到SDK里
          this.uploader.setUploadAuthAndAddress(uploadInfo, uploadAddressAndAuth.uploadAuth, uploadAddressAndAuth.uploadAddress, uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId)
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
        },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          if (!uploadInfo.isImage) {
            this.uploadPercentage = Math.floor(loadedPercent * 100)
          }
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo) {
        },
        // 全部文件上传结束
        onUploadEnd: async uploadInfo => {
          this.isUploadSuccess = true
          // 接受路由中参数lessonID
          const lessonId = this.$route.query.lessonId
          const { data: { code } } = await aliyunTransCode({
            lessonId,
            coverImageUrl: this.imageUrl,
            fileId: this.videoId,
            fileName: this.fileName
          })
          // 视频转码请求成功
          if (code === '000000') {
            // 轮询转码进度
            const timer = setInterval(async () => {
              const { data: { data } } = await aliyunTransCodePercent(lessonId)
              this.TransPercentage = data
              if (data === 100) {
                this.isUploadAndTrans = false
                Message({
                  type: 'success',
                  message: '视频上传转码成功'
                })
                clearInterval(timer)
              }
            }, 1000)
            // TODO 请求失败
          } else {

          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
