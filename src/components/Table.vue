<template>
  <div>
    <!--工具栏-->
    <el-form :inline="true" :model="filters" class="toolbar">
      <el-form-item>
        <el-input v-model="filters.name" placeholder="输入学名或科" @change="getBtfs"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="getBtfs">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="batchRemove">批量删除</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="importData">导入Excel数据</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="ButerflyList" highlight-current-row v-loading="listLoading" @selection-change="selsChange" :style="style">
      <el-table-column type="selection">
      </el-table-column>
       <el-table-column prop="id" label="id">
      </el-table-column>
      <el-table-column prop="name" label="中文学名">
      </el-table-column>
      <el-table-column prop="latinName" label="拉丁学名">
      </el-table-column>
      <el-table-column prop="nickname" label="俗称">
      </el-table-column>
      <el-table-column prop="type" label="科属">
      </el-table-column>
      <el-table-column prop="area" label="地理分布">
      </el-table-column>
       <el-table-column prop="feature" label="形态特征">
      </el-table-column>
      <el-table-column prop="livingHabit" label="生活习性">
      </el-table-column>
      <el-table-column prop="informationSource" label="资料来源">
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--新增界面-->
    <el-dialog title="新增鱼类" :visible.sync="addFormVisible">
      <el-form :model="addForm" label-width="110px" ref="addForm" :rules="rules" inline>
        <el-form-item label="id：" prop="id">
          <el-input v-model="addForm.id"></el-input>
        </el-form-item>
        <el-form-item label="中文学名：" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
         <el-form-item label="拉丁学名：" prop="latinName">
          <el-input v-model="addForm.latinName"></el-input>
        </el-form-item>
        <el-form-item label="俗称：" prop="nickname">
          <el-input v-model="addForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="科属：" prop="type">
          <el-input v-model="addForm.type"></el-input>
        </el-form-item>
        <el-form-item label="地理分布：" prop="area">
          <el-input type="textarea" v-model="addForm.area" style="width:500px" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
        <el-form-item label="识别特征：" prop="feature">
          <el-input type="textarea" v-model="addForm.feature" style="width:500px" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
        <el-form-item label="生活习性：" prop="livingHabit">
          <el-input type="textarea" v-model="addForm.livingHabit" style="width:500px" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
        <el-form-item label="资料来源：" prop="informationSource">
          <el-input v-model="addForm.informationSource" style="width:500px"></el-input>
        </el-form-item>
      </el-form>
      <Upload class="uploadImage" @change="onAddFormImageChange" v-model="addForm.image"></Upload>
      <SmallPhoto class="uploadImage" @change="onAddFormSmallImageChange" v-model="addForm.smallImage"></SmallPhoto>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--编辑界面-->
    <el-dialog title="编辑鱼类" :visible.sync="editFormVisible">
      <el-form :model="editForm" label-width="110px" ref="editForm" :rules="rules" inline>
        <el-form-item label="id：" prop="id">
          <el-input v-model="editForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="中文学名：" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="拉丁学名：" prop="latinName">
          <el-input v-model="editForm.latinName"></el-input>
        </el-form-item>
        <el-form-item label="俗称：" prop="nickname">
          <el-input v-model="editForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="科属：" prop="type">
          <el-input v-model="editForm.type"></el-input>
        </el-form-item>
        <el-form-item label="地理分布：" prop="area">
          <el-input type="textarea" v-model="editForm.area" style="width:500px" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
        <el-form-item label="识别特征：" prop="feature">
          <el-input type="textarea" v-model="editForm.feature" style="width:500px" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
        <el-form-item label="生活习性：" prop="livingHabit">
          <el-input type="textarea" v-model="editForm.livingHabit" style="width:500px" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
        </el-form-item>
        <el-form-item label="资料来源：" prop="informationSource">
          <el-input v-model="editForm.informationSource" style="width:500px"></el-input>
        </el-form-item>
      </el-form>
      <Upload class="uploadImage" @change="onEditFormImageChange" v-model="editForm.image"></Upload>
      <SmallPhoto class="uploadImage" @change="onEditFormSmallImageChange" v-model="editForm.smallImage"></SmallPhoto>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!--分页-->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex" :page-sizes="[5, 10, 15, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>


<script>
import axios from 'axios'
import Upload from '@/components/Upload'
import SmallPhoto from '@/components/SmallPhoto'

export default {
  data () {
    return {
      // 搜索框
      filters: {
        name: ''
      },
      style: {
        // maxHeight: document.documentElement.clientHeight - 182 + 'px'
      },
      pageIndex: 1,           // 当前页
      pageSize: 5,            // 分页大小
      total: 0,              // 信息总行数
      ButerflyList: [],       // 展示的蝴蝶信息列表
      listLoading: false,
      addFormVisible: false,  // 增加界面是否可见
      addLoading: false,
      addForm: {              // 增加的蝴蝶信息
        id: '',
        name: '',
        latinName: '',
        nickname: '',
        type: '',
        area: '',
        feature: '',
        livingHabit: '',
        image: '',
        smallImage: '',
        informationSource: ''
      },
      rules: {                // 校验规则
        id: [{ required: true, message: '请输入ID', trigger: 'blur' }],
        name: [{ required: true, message: '请输入中文学名', trigger: 'blur' }],
        latinName: [{ required: true, message: '请输入拉丁学名', trigger: 'blur' }],
        nickname: [{ required: true, message: '请输入俗称', trigger: 'blur' }],
        type: [{ required: true, message: '请输入科', trigger: 'blur' }],
        area: [{ required: true, message: '请输入地理分布', trigger: 'blur' }],
        feature: [{ required: true, message: '请输入识别特征', trigger: 'blur' }],
        livingHabit: [{ required: true, message: '请输入识别特征', trigger: 'blur' }]
      },
      editFormVisible: false, // 修改界面是否可见
      editLoading: false,
      editForm: {             // 修改的蝴蝶信息
        id: '',
        name: '',
        latinName: '',
        nickname: '',
        type: '',
        area: '',
        feature: '',
        livingHabit: '',
        image: '',
        smallImage: '',
        informationSource: ''
      },
      removeUrls: ''          // 移除的图片信息列表，用 , 连接
    }
  },
  components: {
    Upload, SmallPhoto
  },
  methods: {
    // 检查是否登录
    checkLogin () {
      // 未登录或session过期，跳转到登录界面
      localStorage.removeItem('token')
      this.$router.push({ name: 'Login' })
      this.$message({
        message: '登录已过期，请先登录！',
        type: 'error'
      })
    },
    // 获取蝴蝶列表，当前页，页大小
    getBtfs () {
      axios.get('/user/getInfo.do', {
        // 搜索框内容，当前页码，分页大小
        params: {
          searchStr: this.filters.name,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      }).then((response) => {
        if (response.data.code === 1) {
          this.checkLogin()
        } else if (response.data.code === 0) {
          this.ButerflyList = response.data.data.ButterflyList
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
    handleAdd () {
      this.addFormVisible = true
    },
    onAddFormImageChange (msg1, msg2) {
      this.addForm.image = msg1
      this.removeUrls = msg2
    },
    onAddFormSmallImageChange (msg) {
      this.addForm.smallImage = msg
    },
    // 清空新增界面
    resetAddForm () {
      this.addFormVisible = false
      this.addForm = {
        id: '',
        name: '',
        latinName: '',
        nickname: '',
        type: '',
        area: '',
        feature: '',
        livingHabit: '',
        image: '',
        smallImage: '',
        informationSource: ''
      }
      this.getBtfs()
    },
    // 提交新增信息
    addSubmit () {
      this.$refs['addForm'].validate((valid) => {
        if (!valid) return
        axios.post('/user/createBtf.do', this.addForm).then(res => {
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
        axios.get('/user/removeUrls.do', {
          params: {
            removeUrls: this.removeUrls || ''
          }
        })
      })
    },
    onEditFormImageChange (msg1, msg2) {
      this.editForm.image = msg1
      this.removeUrls = msg2
    },
    onEditFormSmallImageChange (msg) {
      this.editForm.smallImage = msg
    },
    // 显示修改界面
    handleEdit (index, row) {
      this.editFormVisible = true
      this.editForm = Object.assign({}, row)
    },
    // 提交修改信息
    editSubmit () {
      this.$refs['editForm'].validate((valid) => {
        if (!valid) return
        axios.post('/user/updateBtf.do', this.editForm).then((res) => {
          this.editFormVisible = false
          this.getBtfs()
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
        axios.get('/user/removeUrls.do', {
          params: {
            removeUrls: this.removeUrls || ''
          }
        })
      })
    },
    // 删除一行蝴蝶信息
    handleDel (index, row) {
      this.$confirm('确认删除该记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        axios.get('/user/deleteBtf.do', {params: { ID: row.id }})
          .then((res) => {
            if (res.data.code === 1) {
              return this.checkLogin()
            } else if (res.data.code === 0) {
              this.getBtfs()
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
    batchRemove () {
      if (this.sels.length === 0) return
      this.$confirm('确认删除选中记录吗?', '提示', {
        type: 'warning'
      }).then(() => {
        axios.post('/user/batchRemove.do', this.sels.map(item => item.id))
        .then((res) => {
          if (res.data.code === 1) {
            return this.checkLogin()
          } else if (res.data.code === 0) {
            this.getBtfs()
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
    handleSizeChange (val) {
      this.pageSize = val
      this.getBtfs()
    },
    // 当前页改变
    handleCurrentChange (val) {
      this.pageIndex = val
      this.getBtfs()
    }
  },
  mounted () {
    this.style = {
      maxHeight: document.documentElement.clientHeight - 182 + 'px'
    }
  },
  // 页面初始化
  created () {
    this.getBtfs()
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

/* 图片上传组件 */
.uploadImage {
  text-align: center;
}

/* 对话框底部 */
.dialog-footer {
  text-align: center;
}
</style>
