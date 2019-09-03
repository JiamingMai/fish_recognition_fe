<template>
  <div>
    <!--列表-->
    <el-table :data="logList" highlight-current-row v-loading="listLoading" :style="style">
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="loginTimestamp" label="登录时间" :formatter="timestampFormatter"></el-table-column>
    </el-table>
    <!--分页-->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
                     :page-sizes="[5, 10, 15, 20]" :page-size="pageSize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        // 搜索框
        filters: {
          username: ''
        },
        style: {
          // maxHeight: document.documentElement.clientHeight - 182 + 'px'
        },
        pageIndex: 1,           // 当前页
        pageSize: 5,            // 分页大小
        total: 0,              // 信息总行数
        logList: [],       // 展示的帐号信息列表
        listLoading: false,
      }
    },
    methods: {
      timestampFormatter(row, column) {
        return new Date(parseInt(row.loginTimestamp)).toLocaleString().replace(/:\d{1,2}$/,' ');
      },
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
      // 获取蝴蝶列表，当前页，页大小
      getLog() {
        axios.get('/user/getLog.do', {
          // 搜索框内容，当前页码，分页大小
          params: {
            searchStr: this.filters.username,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        }).then((response) => {
          if (response.data.code === 1) {
            this.checkLogin()
          } else if (response.data.code === 0) {
            this.logList = response.data.data.logList
            this.total = response.data.data.total
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
      },
      // 分页大小改变
      handleSizeChange(val) {
        this.pageSize = val
        this.getLog()
      },
      // 当前页改变
      handleCurrentChange(val) {
        this.pageIndex = val
        this.getLog()
      }
    },
    mounted() {
      this.style = {
        maxHeight: document.documentElement.clientHeight - 182 + 'px'
      }
    },
    // 页面初始化
    created() {
      this.getLog()
    }
  }
</script>

<style lang="less">
  /* 工具栏 */
  .toolbar {
    padding: 5px 10px 15px 10px;
  }

  .toolbar {
    .el-form-item {
      margin-bottom: 0px !important;
      margin-right: 5px !important;
    }
  }

  .el-table {
    width: 100%;
    overflow: auto !important;
  }

  /* 新增和修改的对话框 */
  .el-dialog {
    .el-input, .el-radio-group {
      width: 185px;
    }
  }

  /* 分页 */
  .block {
    margin-top: 10px;
  }

  /* 对话框底部 */
  .dialog-footer {
    text-align: center;
  }
</style>
