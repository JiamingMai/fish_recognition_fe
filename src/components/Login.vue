<template>
  <section>
    <el-form :model="ruleForm" :rules="rules2" ref="ruleForm" label-position="left" label-width="0px" class="login-container">
      <h3 class="headtitle">系统登录</h3>
      <el-form-item prop="account">
        <el-input type="text" v-model="ruleForm.account" auto-complete="off" placeholder="账号"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      logining: false,  // 登录按钮是否加载中状态
      ruleForm: {       // 登录表单信息
        account: '',    // 账号
        checkPass: ''   // 密码
      },
      rules2: {         // 输入校验
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 登录
    handleSubmit (ev) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.logining = true
          var loginParams = { username: this.ruleForm.account, password: this.ruleForm.checkPass }
          axios.post('/login.do', loginParams)
            .then(res => {
              this.logining = false
              // 登录成功
              if (res.data.code === 0) {
                localStorage.setItem('token', this.ruleForm.account)
                const redirectPath = this.$route.query.redirect
                if (redirectPath) {
                  return this.$router.push({
                    path: redirectPath
                  })
                }
                return this.$router.push({ name: 'Table' })
              }
              // 登录失败
              this.$message({
                message: res.data.message || '登录失败',
                type: 'error'
              })
            })
            .catch(err => {
              this.logining = false
              this.$message({
                message: err.message,
                type: 'error'
              })
            })
        } else {
          console.log('error submit!')
          return false
        }
      })
    }
  }
}
</script>

<style>
.login-container {
  position:fixed;  
  margin: auto;
  top:0;
  right:0;
  bottom:0;
  left:0;    
  width: 350px;
  height: 251px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;  
  box-shadow: 0 0 25px #cac6c6;
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;  
}

 .headtitle {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
} 
</style>
