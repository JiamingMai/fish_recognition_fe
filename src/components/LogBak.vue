<template>
  <ul>
    <li v-for="log in logs">
      {{ log }}
    </li>
  </ul>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        logs: ["log demo1", "log demo2"]
      }
    },
    methods: {
      // 检查是否登录
      checkLogin() {
        // 未登录或session过期，跳转到登录界面
        localStorage.removeItem('token')
        this.$router.push({name: 'Login'})
        this.$message({
          message: '登录已过期，请先登录！',
          type: 'error'
        })
      },
      // get log here
      getItems() {
        axios.get('/user/getLog.do', {
          params: {
            info : "request for logs"
          }
        }).then((response) => {
          if (response.data.code === 0) {
            this.logs = response.data.data
          } else if (response.data.code === 1) {
            this.checkLogin()
          } else {
            this.$message({
              message: '查询失败',
              type: 'error'
            })
          }
        }).catch(err => {
          this.$message({
            message: err.message,
            type: 'error'
          })
        })
      }
    },
    mounted () {
      console.log("mounted method is called")
      this.style = {
        maxHeight: document.documentElement.clientHeight - 182 + 'px'
      }
    },
    // define the action here after the page is initialized
    created() {
      console.log("created method is called")
      this.getItems()
    }
  }
</script>
