<template>
  <div>
    <el-dialog title="上传模板"  :visible.sync="uploadDialogShow">
      <el-upload
        ref="upload"
        :http-request="uploadFiles"
        :file-list="templateList"
        :auto-upload="false"
        :multiple="false"
        :limit="1"
      >
        <el-button size="small" type="primary" slot="trigger">选取模板</el-button>
        <el-button size="small" type="success" @click="submitUpload">上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传docx文件</div>
      </el-upload>

    </el-dialog>
    <el-dialog title="解析成绩册"  :visible.sync="uploadExcelDialogShow">
      <el-form label-position="left" label-width="150px">
        <el-form-item label="成绩册：">
          <el-upload
            ref="upload"
            :http-request="uploadExcelFiles"
            :file-list="excelFileList"
            :auto-upload="false"
            :multiple="false"
            :limit="1"
          >
            <el-button size="small" type="primary" slot="trigger">选择成绩册</el-button>
            <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
          </el-upload>
        </el-form-item>
        <el-divider></el-divider>

        <el-form-item>
          <el-button size="small" @click="submitUpload">上传</el-button>
          <el-button size="small"  type="primary" @click="() => uploadExcelDialogShow = false">取消</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>

    <el-card>
      <template slot="header">
        <el-button size="mini" type="warning" @click="() => uploadDialogShow = true" v-if="$isAdmin()">上传模板</el-button>
        <h1 v-else>成绩模板列表</h1>
      </template>
      <el-table border :data="excelList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="templateName" label="模板文件名"></el-table-column>
        <el-table-column prop="createAt" label="创建日期" width="150">
          <template slot-scope="scope">
            {{ dateFormat('YYYY-mm-dd HH:MM', new Date(scope.row.createAt)) }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleInstance(scope.row.templateName, scope.row.tid)"
            >查看实例
            </el-button
            >
            <el-button
              size="mini"
              @click="handleNewInstance(scope.row.templateName, scope.row.tid)"
            >解析成绩册
            </el-button>
            <el-button
              size="mini"
              @click="handleDownload(scope.row.templateName, scope.row.tid)"
            >下载文档
            </el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.templateName, scope.row.tid)"
              v-if="$isAdmin()"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <!-- <div>
    <div v-for="(item,index) in excelList" :key="index">
    {{ item }}
  </div>
  </div> -->
</template>

<script>
import {ApiGet, ApiPost} from '../../api/api'

export default {
  data () {
    return {
      templateList: [],
      excelList: [],
      excelFileList: [],
      uploadDialogShow: false,
      uploadExcelDialogShow: false,
      templateId: ''
    }
  },

  watch: {
    uploadExcelDialogShow (newVal, oldVal) {
      if (!newVal) {
        this.excelFileList = []
        this.$refs.uploadExceL.clearFiles()
      }
    }
  },
  methods: {
    async uploadFiles (e) {
      const fd = new FormData()
      fd.append('file', e.file)
      await ApiPost('/template/upload?type=1', fd)
      this.$message({
        message: '上传成功',
        type: 'success'
      })
      this.uploadDialogShow = false
      this.templateList = []
      this.$refs.upload.clearFiles()
      await this.loadTemplate()
    },
    async handleDelete (templateName, tid) {
      try {
        const confirm = await this.$confirm(`确定删除 [${templateName}]？`)
        if (confirm) {
          try {
            await this.$request.deleteTemplate(tid)
            this.$message({
              type: 'success',
              message: `删除 [${templateName}] 成功`
            })

            await this.loadTemplate()
          } catch (e) {
            this.$error(e.message)
          }
        }
      } catch (e) {
      }
    },
    submitUpload () {
      this.$refs.upload.submit()
    },


    async uploadExcelFiles (e) {
      const fd = new FormData()
      fd.append('file', e.file)
      await ApiPost(`/instance/new?template_id=${this.templateId}`, fd)
      this.$message({
        message: '上传成功',
        type: 'success'
      })
      this.uploadExcelDialogShow = false
      await this.loadTemplate()
    },

    handleUploadError (err, file, fileList) {
      console.log(err)
    },

    handleNewInstance (templateName, templateId) {
      this.templateId = templateId
      this.uploadExcelDialogShow = true
    },

    handleUploadSuccess (response, file, fileList) {
      console.log(response)
    },
    async uploadTemplate () {
    },
    async loadTemplate () {
      const {
        data: {data}
      } = await ApiGet('/template/excel')
      this.excelList = data
      this.$forceUpdate()
    },

    handleDownload (templateName, tid) {
      this.$request.getTemplate(tid, templateName)
    },

    dateFormat (fmt, date) {
      console.log(date)
      let ret
      const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      }
      for (let k in opt) {
        ret = new RegExp('(' + k + ')').exec(fmt)
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length === 1 ? opt[k] : opt[k].padStart(ret[1].length, '0')
          )
        }
      }
      return fmt
    },

    handleInstance (templateName, templateId) {
      this.$router.push({
        name: 'excel-template-instance',
        query: {
          templateId
        }
      })
    }
  },
  computed: {},
  created () {
    this.loadTemplate()
  }
}
</script>

<style>
.copy-dialog-info {
  z-index: 3000 !important;
}
</style>
