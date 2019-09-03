<template>
  <div>
    <!--工具栏-->
    <el-form :inline="true" :model="filters" class="toolbar">
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="batchRemove">批量删除</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="accountList" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
              :style="style">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column prop="id" label="id"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="level" label="权限" :formatter="levelFormatter"></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增界面-->
    <el-dialog title="新增帐号" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="110px" ref="addForm" :rules="rules" inline>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="权限：" prop="level">
          <el-select v-model="addForm.level">
            <el-option v-for="item in levelOptions"
                       :label="item.text"
                       :key="item.value"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑界面-->
    <el-dialog title="修改帐号" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="110px" ref="editForm" :rules="rules" inline>
        <el-form-item label="id：" prop="id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input type="password" v-model="editForm.password"></el-input>
        </el-form-item>
        <el-form-item label="权限：" prop="level">
          <el-select v-model="editForm.level">
            <el-option v-for="item in levelOptions"
                       :label="item.text"
                       :key="item.value"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
        </div>
    </el-dialog>
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
        accountList: [],       // 展示的帐号信息列表
        levelOptions: [
          {value: 0, text: "普通帐号"},
          {value: 1, text: "管理员"},
        ],
        listLoading: false,
        addFormVisible: false,  // 增加界面是否可见
        addLoading: false,
        addForm: {              // 增加的帐号信息
          id: '',
          uesrname: '',
          password: '',
          level: '',
        },
        rules: {                // 校验规则
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        },
        editFormVisible: false, // 修改界面是否可见
        editLoading: false,
        editForm: {             // 修改的帐户信息
          username: '',
          password: '',
          level: '',
        }
      }
    },
    methods: {
      levelFormatter(row, column) {
        if (row.level === 0) {
          return '普通帐号'
        } else if (row.level === 1) {
          return '管理员'
        } else {
          return '其它'
        }
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
      getAccount() {
        axios.get('/user/queryAccount.do', {
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
            this.accountList = response.data.data.accounts
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
      // 显示新增界面
      handleAdd() {
        this.addFormVisible = true
      },
      onAddFormImageChange(msg1, msg2) {
        this.addForm.image = msg1
        this.removeUrls = msg2
      },
      onAddFormSmallImageChange(msg) {
        this.addForm.smallImage = msg
      },
      // 清空新增界面
      resetAddForm() {
        this.addFormVisible = false
        this.addForm = {
          username: '',
          password: '',
          level: ''
        }
        this.getAccount()
      },
      // 提交新增信息
      addSubmit() {
        this.$refs['addForm'].validate((valid) => {
          if (!valid) return
          axios.post('/user/addAccount.do', this.addForm).then(res => {
            this.resetAddForm()
            if (res.data.code === 1) {
              return this.checkLogin()
            } else if (res.data.code === 0) {
              return this.$message({
                message: '新增成功',
                type: 'success'
              })
            }
            this.$message({
              message: '新增失败',
              type: 'error'
            })
          }).catch(err => {
            this.$message({
              message: err.message,
              type: 'error'
            })
          })
        })
      },
      // 显示修改界面
      handleEdit(index, row) {
        this.editFormVisible = true
        this.editForm = Object.assign({}, row)
      },
      // 提交修改信息
      editSubmit() {
        this.$refs['editForm'].validate((valid) => {
          if (!valid) return
          axios.post('/user/updateAccount.do', this.editForm).then((res) => {
            this.editFormVisible = false
            this.getAccount()
            if (res.data.code === 1) {
              return this.checkLogin()
            } else if (res.data.code === 0) {
              return this.$message({
                message: '修改成功',
                type: 'success'
              })
            }
            this.$message({
              message: '修改失败',
              type: 'error'
            })
          }).catch(err => {
            this.$message({
              message: err.message,
              type: 'error'
            })
          })
        })
      },
      // 删除一行蝴蝶信息
      handleDel(index, row) {
        this.$confirm('确认删除该记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          axios.get('/user/deleteAccount.do', {params: {ID: row.id}})
            .then((res) => {
              if (res.data.code === 1) {
                this.getAccount()
                return this.$message({
                  message: res.data.message,
                  type: 'error'
                })
              } else if (res.data.code === 0) {
                this.getAccount()
                return this.$message({
                  message: '删除成功',
                  type: 'success'
                })
              }
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }).catch(err => {
            this.$message({
              message: err.message,
              type: 'error'
            })
          })
        }).catch(() => {
          this.$message({
            message: '已取消',
            type: 'info'
          })
        })
      },
      // 批量删除
      batchRemove() {
        if (this.sels.length === 0) return
        this.$confirm('确认删除选中记录吗?', '提示', {
          type: 'warning'
        }).then(() => {
          axios.post('/user/deleteAccountByBatch.do', this.sels.map(item => item.id))
            .then((res) => {
              if (res.data.code === 1) {
                return this.checkLogin()
              } else if (res.data.code === 0) {
                this.getAccount()
                return this.$message({
                  message: '删除成功',
                  type: 'success'
                })
              }
              this.$message({
                message: '删除失败',
                type: 'error'
              })
            }).catch(err => {
            this.$message({
              message: err.message,
              type: 'error'
            })
          })
        }).catch(() => {
          this.$message({
            message: '已取消',
            type: 'info'
          })
        })
      },
      // 勾选数组
      selsChange: function (sels) {
        this.sels = sels
      },
      // 分页大小改变
      handleSizeChange(val) {
        this.pageSize = val
        this.getAccount()
      },
      // 当前页改变
      handleCurrentChange(val) {
        this.pageIndex = val
        this.getAccount()
      }
    },
    mounted() {
      this.style = {
        maxHeight: document.documentElement.clientHeight - 182 + 'px'
      }
    },
    // 页面初始化
    created() {
      this.getAccount()
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
