<template>
  <div class="login">
    <el-form
    :label-position="labelPosition"
    :model="ruleForm"
    :rules="rules"
    ref="ruleForm"
    label-width="100px"
    class="demo-ruleForm">
      <el-form-item
      label="手机号"
      prop="phone">
        <el-input v-model="ruleForm.phone"></el-input>
      </el-form-item>
        <el-form-item
        label="密码"
        prop="password">
        <el-input
        type="password"
        v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
        type="primary"
        :loading="isLoding"
        @click="submitForm('ruleForm')">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/interface/user'
import { Message } from 'element-ui'
export default {
  name: 'Login',

  data () {
    return {
      // 登录样式排版
      labelPosition: 'top',
      // 是否加载中
      isLoding: false,
      ruleForm: {
        // 18201288771
        // 111111
        phone: '',
        password: ''
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '密码不正确', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单提交验证
    async submitForm (formName) {
      // 错误处理
      try {
        // 验证成功的处理
        await this.$refs[formName].validate()
        // 开启button加载中
        this.isLoding = true
        // 请求数据的获取
        const { data } = await login(this.ruleForm)
        // 登录成功
        if (data.state === 1) {
          Message({
            message: '恭喜你，登录成功',
            type: 'success',
            onClose: () => {
              this.isLoding = true
            }
          })
          // 保存用户登录成功信息
          this.$store.commit('setUser', data)
          // 根据当前路由的query参数redirect进行路由跳转
          this.$router.push(this.$route.query.redirect || '/')
          // 登录失败
        } else {
          Message.error({
            message: data.message,
            showClose: true,
            // message关闭时回调
            onClose: () => {
              this.isLoding = false
            }
          })
        }
        // 验证失败
      } catch (error) {
        console.log('验证失败: ', error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-form {
  padding: 20px;
  width: 300px;
  background-color: #fff;
  border-radius: 10px;
}
.el-button {
  width: 100%;
}

// TODO elementUI的labelPosition属性值为TOP时，没有左对齐
// .el-form--label-top .el-form-item__label {
//   float: left !important;
// }
</style>
