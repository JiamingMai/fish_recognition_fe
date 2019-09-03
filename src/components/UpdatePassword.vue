<template>
  <section>
    <el-form :model="ruleForm" :rules="rules2" ref="ruleForm" label-position="left" label-width="0px" class="login-container">
      <h3 class="headtitle">修改密码</h3>
      <el-form-item prop="account">
        <el-input type="password" v-model="ruleForm.oldPassword" auto-complete="off" placeholder="旧密码"></el-input>
      </el-form-item>
      <el-form-item prop="checkPass">
        <el-input type="password" v-model="ruleForm.newPassword" auto-complete="off" placeholder="新密码"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="updating">修改</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
  import axios from 'axios'

  export default {
    data () {
      return {
        updating: false,  // 修改按钮是否加载中状态
        ruleForm: {       // 修改密码表单信息
          oldPassword: '',    // 旧密码
          newPassword: ''   // 新密码
        },
        rules2: {         // 输入校验
          oldPassword: [
            { required: true, message: '请输入旧密码', trigger: 'blur' }
          ],
          newPassword: [
            { required: true, message: '请输入新密码', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      checkLogin() {
        // 未登录或session过期，跳转到登录界面
        localStorage.removeItem('token')
        this.$router.push({name: 'Login'})
        this.$message({
          message: '登录已过期，请先登录！',
          type: 'error'
        })
      },
      // 修改密码
      handleSubmit (ev) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.updating = true
            var passwordParams = { oldPassword: this.ruleForm.oldPassword, newPassword: this.ruleForm.newPassword }
            axios.post('/user/updatePassword.do', passwordParams)
              .then(res => {
                this.updating = false
                // 修改密码成功
                if (res.data.code === 0) {
                  const redirectPath = this.$route.query.redirect
                  if (redirectPath) {
                    return this.$router.push({
                      path: redirectPath
                    })
                  }
                  return this.$router.push({ name: 'Table' })
                }
                checkLogin();
                // 修改密码失败
                this.$message({
                  message: res.data.message || '修改密码失败',
                  type: 'error'
                })
              })
              .catch(err => {
                this.updating = false
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
      },
      created() {
        this.handleSubmit();
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
