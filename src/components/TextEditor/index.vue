<template>
  <div ref="editor"></div>
</template>

<script>
import E from 'wangeditor'
import { uploadImg } from '@/interface/course'
export default {
  name: 'TextEditor',
  props: {
    value: {
      type: String
    }
  },
  data () {
    return {
      // 是否已经加载完毕
      isLoaded: false,
      editor: null
    }
  },
  mounted () {
    this.initEditor()
  },
  watch: {
    // 注意侦听器中函数的使用方式不是箭头函数
    value () {
      // 还没有加载完毕
      if (!this.isLoaded) {
        // 为编辑器赋值
        this.editor.txt.html(this.value)
        // TODO只有首次加载才会处理默认值，后续value是同步的，不需要使用这种赋值方式
        this.isLoaded = true
      }
    }
  },
  methods: {
    // 初始化富文本编辑器
    initEditor () {
      const editor = new E(this.$refs.editor)
      // 配置 onchange 回调函数
      editor.config.onchange = newHtml => {
        this.$emit('input', newHtml)
      }
      // 为了在当前作用域之外操作editor对象
      this.editor = editor
      // editor.txt.html(this.value)
      // 配置触发 onchange 的时间频率，默认为 200ms
      editor.config.onchangeTimeout = 500 // 修改为 500ms
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        // resultFiles 是 input 中选中的文件列表
        // insertImgFn 是获取图片 url 后，插入到编辑器的方法
        const formData = new FormData()
        formData.append('file', resultFiles[0])
        const { data: { code, data: { name } } } = await uploadImg(formData)
        // 上传成功
        if (code === '000000') {
        // 上传图片，返回结果，将图片插入到编辑器中
          insertImgFn(name)
          // TODO上传失败
        } else {
          alert('上传失败')
        }
      }
      editor.create()
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
