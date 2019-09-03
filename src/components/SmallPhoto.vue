<template>
  <section>
    <el-upload action="/user/uploadSmallPhoto.do" :file-list="fileList" list-type="picture" :on-success="onSuccess" :on-error="handleError" :on-remove="onRemove">
      <el-button size="small" type="primary">点击上传小图片</el-button>
      <div slot="tip">只能上传jpg/png文件</div>
    </el-upload>
  </section>
</template>

<script>
export default {
  data() {
    return {
      imageUrl: ''
    }
  },
  props: {
    // 原始的图片地址列表，用 , 连接
    value: {
      type: String
    }
  },
  computed: {
    // 展示的图片
    fileList() {
      if (this.imageUrl === '') return
      var fileList = [{
        name: this.imageUrl.replace('/smallImage/', ''),
        url: this.imageUrl,
        response: this.imageUrl.replace('/smallImage/', '')
      }]
      return fileList
    }
  },
  watch: {
    value() {
      this.imageUrl = this.value
    }
  },
  mounted() {
    this.imageUrl = this.value
  },
  methods: {
    // 移除图片
    onRemove () {
      this.imageUrl = ""
      this.$emit('change', this.imageUrl)
      this.$emit('input', this.imageUrl)
    },
    // 上传图片成功
    onSuccess(response) {
      if (response.code === 1) {
        // 未登录或session过期，跳转到登录界面
        localStorage.removeItem('token')
        this.$router.push({ name: 'Login' })
        this.$message({
          message: '登录已过期，请先登录！',
          type: 'error'
        })
      }
      this.imageUrl = `/smallImage/${response}`
      this.$emit('change', this.imageUrl)
      this.$emit('input', this.imageUrl)
    },
    // 上传图片失败
    handleError(err) {
      this.$message({
        message: '图片上传失败',
        type: 'error'
      })
    }
  }
}
</script>