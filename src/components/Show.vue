<template>
  <div class="Show">
    <!--工具条-->
    <el-form :inline="true" :model="filters" class="toolbar" :rules="rules">
      <el-form-item prop="rate1">
        <el-input v-model.number="filters.rate1" placeholder="起始识别率" style="width:120px"></el-input>
      </el-form-item>
      <el-form-item>—</el-form-item>
      <el-form-item prop="rate2">
        <el-input v-model.number="filters.rate2" placeholder="截止识别率" style="width:120px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-on:click="getItems">查询</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table :data="IdentifyList" highlight-current-row :style="style">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="table-expand">
            <el-form-item label="中文学名：">
              <span>{{ props.row.butterfly.name }}</span>
            </el-form-item>
            <el-form-item label="拉丁学名:">
              <span>{{ props.row.butterfly.latinName }}</span>
            </el-form-item>
            <el-form-item label="俗称：">
              <span>{{ props.row.butterfly.type }}</span>
            </el-form-item>
            <el-form-item label="科属：">
              <span>{{ protectText[props.row.butterfly.protect] }}</span>
            </el-form-item>
            <el-form-item label="地理分布：">
              <span>{{ rareText[props.row.butterfly.rare] }}</span>
            </el-form-item>
            <el-form-item label="形态特征：">
              <span>{{ uniqueToChinaText[props.row.butterfly.uniqueToChina] }}</span>
            </el-form-item>
            <el-form-item label="生活习性：" class="table-expand-longtext">
              <span>{{ props.row.butterfly.area }}</span>
            </el-form-item>
            <el-form-item label="资料来源：" class="table-expand-longtext">
              <span>{{ props.row.butterfly.feature }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column type="index">
      </el-table-column>
      <el-table-column prop="butterfly.name" label="图片识别品种">
      </el-table-column>
      <el-table-column prop="butterfly.latinName" label="拉丁学名">
      </el-table-column>
      <el-table-column prop="rate" label="识别率">
      </el-table-column>
      <el-table-column prop="runTime" label="花费时间(s)">
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="block">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageIndex"
                     :page-sizes="[8, 10, 15, 20]" :page-size="pageSize"
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
          rate1: '',            // 起始识别率
          rate2: ''             // 截止识别率
        },
        style: {
          // maxHeight: document.documentElement.clientHeight - 182 + 'px'
        },
        IdentifyList: [],       // 识别信息展示列表
        pageIndex: 1,           // 当前页码
        pageSize: 8,            // 分页大小
        total: 0,              // 记录总行数
        protectText: {          // 是否受保护字段
          '1': '是',
          '0': '否'
        },
        rareText: {             // 是否受稀有字段
          '1': '是',
          '0': '否'
        },
        uniqueToChinaText: {    // 是否中国特有字段
          '1': '是',
          '0': '否'
        },
        showForm: {             // 查看表单信息
          name: '',
          latinName: '',
          type: '',
          feature: '',
          area: '',
          protect: -1,
          rare: -1,
          uniqueToChina: -1
        },
        showFormVisible: false, // 查看界面是否可见
        rules: {                // 校验信息
          rate1: [
            {type: 'number', message: '必须为数字值'}
          ],
          rate2: [
            {type: 'number', message: '必须为数字值'}
          ]
        }
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
      // 获取识别信息列表
      getItems() {
        axios.get('/user/getIdf.do', {
          params: {
            // 起始识别率，截止识别率，当前页码，分页大小
            rate1: this.filters.rate1 || 0,
            rate2: this.filters.rate2 || 100,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
          }
        }).then((response) => {
          if (response.data.code === 0) {
            this.IdentifyList = response.data.data.IdentifyList
            this.total = response.data.data.total
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
      },
      // 显示查看界面
      handleShow(index, row) {
        this.showFormVisible = true
        this.showForm = Object.assign({}, row.butterfly)
      },
      // 分页大小改变
      handleSizeChange(val) {
        this.pageSize = val
        this.getItems()
      },
      // 当前页改变
      handleCurrentChange(val) {
        this.pageIndex = val
        this.getItems()
      }
    },
    mounted() {
      this.style = {
        maxHeight: document.documentElement.clientHeight - 182 + 'px'
      }
    },
    // 页面初始化
    created() {
      this.getItems()
    }
  }
</script>

<style>
  .table-expand {
    font-size: 0;
  }

  .table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 30%;
  }

  .table-expand .table-expand-longtext {
    width: 100%;
  }
</style>
