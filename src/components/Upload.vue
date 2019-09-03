<template>
  <section>
    <el-upload action="/user/upload.do" :on-remove="handleRemove"
      :file-list="fileList" list-type="picture" :on-success="onSuccess" :on-error="handleError">
      <el-button size="small" type="primary">点击上传轮播图</el-button>
      <div slot="tip">只能上传jpg/png文件</div>
    </el-upload>
  </section>
</template>

<script>

export default {
  data () {
    return {
      // fileList: [{name: '1513521336577.jpg', url: '/images/1513521336577.jpg', response: '1513521336577.jpg'},
      //             {name: '1513521330851.jpg', url: '/images/1513521330851.jpg', response: '1513521330851.jpg'}],
      imageUrls: '', // 待上传的图片地址列表，用 , 连接
      removeUrls: '' // 待移除的图片地址列表，用 , 连接
    }
  },
  props: {
    // 原始的图片地址列表，用 , 连接
    value: {
      type: String
    }
  },
  computed: {
    // 展示的图片列表
    fileList () {
      if (this.imageUrls === '') return
      var imageArray = this.imageUrls.split(',')
      var fileList = imageArray.map(imageFile => ({
        name: imageFile.replace('/images/', ''),
        url: imageFile,
        response: imageFile.replace('/images/', '')
      }))
      return fileList
    }
  },
  watch: {
    value () {
      this.imageUrls = this.value
    }
  },
  mounted () {
    this.imageUrls = this.value
  },
  methods: {
    // 移除图片
    handleRemove (file, fileList) {
      // file是删除图片的信息，fileList是列表中图片的信息
      this.imageUrls = fileList.map(item => `/images/${item.response}`).join(',')
      if (this.removeUrls !== '') this.removeUrls = this.removeUrls + ',' + `/images/${file.response}`
      else this.removeUrls += `/images/${file.response}`
      this.$emit('change', this.imageUrls, this.removeUrls)
      this.$emit('input', this.imageUrls)
    },
    // 上传图片成功
    onSuccess (response) {
      if (response.code === 1) {
        // 未登录或session过期，跳转到登录界面
        localStorage.removeItem('token')
        this.$router.push({ name: 'Login' })
        this.$message({
          message: '登录已过期，请先登录！',
          type: 'error'
        })
      }
      if (!this.imageUrls) this.imageUrls = `/images/${response}`
      else this.imageUrls = this.imageUrls + ',' + `/images/${response}`
      this.$emit('change', this.imageUrls)
      this.$emit('input', this.imageUrls)
    },
    // 上传图片失败
    handleError (err) {
      console.log(err)
      this.$message({
        message: '图片上传失败',
        type: 'error'
      })
    }
  }
}
</script>