<template>
  <el-container style="overflow: hidden;">
    <el-header>
      <el-row>
        <el-col :span="24">
          <el-col :span="6" class="system-name">{{ButterflySystem}}</el-col>
          <el-col :span="4" class="user">
            <el-dropdown trigger="click" @command="handleLogout">
              <span class="userinfo">用户名：&nbsp;&nbsp;{{username}}</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
                <el-dropdown-item command="loginout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-col>
      </el-row>
    </el-header>
    <!--工具条-->
    <el-container>
      <el-aside width="100px" :style="style">
        <el-menu :default-active="$route.path" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b" theme="dark" router style="border-right: none;">
          <el-menu-item index="/page/">
            <span slot="title">鱼类信息</span>
          </el-menu-item>
          <el-menu-item index="/page/show">
            <span slot="title">识别信息</span>
          </el-menu-item>
          <el-menu-item index="/page/account">
            <span slot="title">帐号信息</span>
          </el-menu-item>
          <el-menu-item index="/page/log">
            <span slot="title">日志信息</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      ButterflySystem: '识鱼后台管理系统',
      username: localStorage.getItem('token'),
      style: {
        // minHeight: document.body.clientHeight - 60 + 'px'
      }
    }
  },
  methods: {
    // 注销登录
    handleLogout (command) {
      if (command === 'loginout') {
        axios.get('/user/logout.do').then(res => {
          if (res.data.code === 0 || res.data.code === 1) {
            localStorage.removeItem('token')
            return this.$router.push({ name: 'Login' })
          }
          this.$message({
            message: '注销失败',
            type: 'error'
          })
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
      } else if (command === 'updatePassword') {
        return this.$router.push(({name: 'UpdatePassword'}))
      }
    }
  },
  mounted () {
    this.style = {
      minHeight: document.documentElement.clientHeight - 60 + 'px'
    }
  }
}
</script>

<style>
.system-name {
  float: left;
  font-size: 24px;
}

.user {
  float: right !important;
  text-align: right;
  padding-right: 20px;
}

.system-name,
.user .userinfo {
  line-height: 60px;
}

.userinfo {
  font-size: 16px;
  color: #fff;
}

.el-header {
  width: 100%;
  color: #fff;
  background-color: #324157;
}

.el-aside {
  text-align: center;
  line-height: 200px;
  background: #545c64;
}

.el-main {
  padding: 10px !important;
}
</style>
