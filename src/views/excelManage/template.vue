<template>
  <div>
    <el-dialog title="上传模板" :visible.sync="uploadDialogShow">
      <el-upload
        ref="upload"
        action="http://127.0.0.1:7002/template/parse"
        :file-list="templateList"
        :on-success="handleUploadSuccess"
        :on-error="handleUploadError"
        :auto-upload="false"
        :multiple="false"
        :limit="1"
      >
        <el-button size="small" type="primary" slot="trigger">选取模板</el-button>
        <el-button size="small" type="success" @click="submitUpload">上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
      </el-upload>
    </el-dialog>
    <el-card>
      <template slot="header">
        <el-button size="mini" type="warning" @click="() => uploadDialogShow = true">上传模板</el-button>
      </template>
      <el-table border :data="courses" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column sortable prop="fid" width="320" label="模板编号">
        </el-table-column>
        <el-table-column prop="filename" label="模板文件名"></el-table-column>
        <el-table-column prop="createAt" label="创建日期" width="150">
          <template slot-scope="scope">
            {{ dateFormat('YYYY-mm-dd HH:MM', new Date(scope.row.createAt)) }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleInstance(scope.row.filename, scope.row.fid)"
            >查看实例
            </el-button
            >
            <el-button
              size="mini"
              @click="handleNewInstance(scope.row.filename, scope.row.fid)"
            >创建新实例
            </el-button>
            <el-button
              size="mini"
              @click="handleDownload(scope.row.filename, scope.row.fid)"
            >下载文档
            </el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.filename, scope.row.fid)"
            >删除
            </el-button
            >
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
import {ApiGet} from '../../api/api'

export default {
  name: 'courseInfo',
  data () {
    return {
      courses: [],
      templateList: [],
      uploadDialogShow: false
    }
  },
  methods: {
    async handleDelete (filename, fid) {
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
      } catch (e) {
      }
    },
    submitUpload () {
      this.$refs.upload.submit()
    },
    handleTemplateChange () {

    },
    handleUploadError (err, file, fileList) {
      console.log(err)
    },

    handleNewInstance (templateName, templateId) {
      console.log(templateName, templateId)
      this.$router.push({
        name: 'template-instance-edit',
        query: {
          templateId
        }
      })
    },

    handleUploadSuccess (response, file, fileList) {
      console.log(response)
    },
    async uploadTemplate () {
    },
    async loadTemplate (courseId) {
      const {
        data: {data}
      } = await ApiGet('/template/excel', {
        params: {
          course_id: courseId
        }
      })
      this.courses = data
      this.$forceUpdate()
    },

    handleDownload (filename, fid) {
      this.$request.getTemplate(fid, filename)
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
    const courseId = this.$route.query.courseId
    this.loadTemplate(courseId)
  }
}
</script>

<style></style>
