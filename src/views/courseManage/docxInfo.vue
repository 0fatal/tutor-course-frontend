<template>
  <div>
    <el-dialog title="上传模板" :visible.sync="uploadDialogShow">
      <el-upload
        ref="upload"
        :file-list="templateList"
        :http-request="uploadFiles"
        :auto-upload="false"
        :multiple="false"
        :limit="1"
      >
        <el-button size="small" type="primary" slot="trigger">选取模板</el-button>
        <el-button size="small" type="success" @click="submitUpload">上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传docx文件</div>
      </el-upload>
    </el-dialog>
    <el-card>
      <template slot="header">
        <el-button size="mini" type="warning" @click="() => (uploadDialogShow = true)" v-if="$isAdmin()"
          >上传模板</el-button
        >
        <h1 v-else>模板列表</h1>
      </template>
      <el-table border :data="courses" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="templateName" label="模板文件名"></el-table-column>
        <el-table-column prop="createAt" label="创建日期" width="150">
          <template slot-scope="scope">
            {{ dateFormat('YYYY-mm-dd HH:MM', new Date(scope.row.createAt)) }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleInstance(scope.row.templateName, scope.row.tid)">查看实例 </el-button>
            <el-button size="mini" @click="handleNewInstance(scope.row.templateName, scope.row.tid)"
              >创建新实例
            </el-button>
            <el-button size="mini" @click="handleDownload(scope.row.templateName, scope.row.tid)">下载文档 </el-button>
            <el-button
              size="mini"
              type="danger"
              v-if="$isAdmin()"
              @click="handleDelete(scope.row.templateName, scope.row.tid)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
  <!-- <div>
    <div v-for="(item,index) in courses" :key="index">
    {{ item }}
  </div>
  </div> -->
</template>

<script>
import { ApiGet, ApiPost } from '../../api/api'
import { dateFormat } from '../../utils/index'

export default {
  name: 'courseInfo',
  data() {
    return {
      courses: [],
      templateList: [],
      uploadDialogShow: false
    }
  },
  methods: {
    dateFormat,
    async uploadFiles(e) {
      const fd = new FormData()
      fd.append('file', e.file)
      await ApiPost('/template/upload', fd)
      this.$message({
        message: '上传成功',
        type: 'success'
      })
      this.uploadDialogShow = false
      this.templateList = []
      this.$refs.upload.clearFiles()
      await this.loadTemplate()
    },

    async handleDelete(filename, fid) {
      try {
        const confirm = await this.$confirm(`确定删除 [${filename}]？`)
        if (confirm) {
          try {
            await this.$request.deleteTemplate(fid)
            this.$message({
              type: 'success',
              message: `删除 [${filename}] 成功`
            })

            await this.loadTemplate()
          } catch (e) {
            this.$error(e.message)
          }
        }
      } catch (e) {}
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleTemplateChange() {},
    handleUploadError(err, file, fileList) {
      console.log(err)
    },

    handleNewInstance(templateName, templateId) {
      console.log(templateName, templateId)
      this.$router.push({
        name: 'template-instance-edit',
        query: {
          templateId
        }
      })
    },

    handleUploadSuccess(response, file, fileList) {
      console.log(response)
    },
    async uploadTemplate() {},
    async loadTemplate() {
      const {
        data: { data }
      } = await ApiGet('/template')
      this.courses = data
      this.$forceUpdate()
    },

    handleDownload(filename, fid) {
      this.$request.getTemplate(fid, filename)
    },

    handleInstance(templateName, templateId) {
      this.$router.push({
        name: 'course-template-instance',
        query: {
          templateId
        }
      })
    }
  },
  computed: {},
  created() {
    this.loadTemplate()
  }
}
</script>

<style></style>
