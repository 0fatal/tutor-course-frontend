<template>
  <div>
    <el-dialog
      title="复制模板"
      :visible.sync="copyDialogVisible"
      width="30%"
    >
      <el-form label-position="top">
        <el-form-item label="新实例名称：">
          <el-input v-model="copyNewInstanceName" placeholder="请输入实例名称"></el-input>
        </el-form-item>
        <el-form-item label="请选择复制到哪个课程：">
          <el-select v-model="targetCopyCourseId" placeholder="请选择">
            <el-option
              v-for="item in courses.filter(({courseId}) => courseId !== selectCopyCourseId)"
              :key="item.courseId"
              :label="item.courseName"
              v-model="item.courseId">
              <span style="float: left">{{ item.courseName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.courseNum }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <hr>
        <br>
        <div>
          <el-popconfirm
            title="确定要复制吗？"
            @onConfirm="handleCopy"
          >
            <el-button slot="reference">复制</el-button>
          </el-popconfirm>

          <el-button @click="() =>copyDialogVisible=false" type="primary">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-card>
      <template slot="header">
        <h1 v-if="!$route.query.templateId">实例列表</h1>
        <el-button v-else size="mini" type="warning" @click="handleNew($route.query.templateId)">创建新实例</el-button>
      </template>
      <el-table border :data="instanceList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="实例名称"></el-table-column>
        <el-table-column prop="" label="模板文件名">
          <template slot-scope="scope">
            {{ scope.row.template.templateName }}
          </template>
        </el-table-column>
        <el-table-column label="课程名">
          <template slot-scope="scope">
            {{ scope.row.course.courseName }}
          </template>
        </el-table-column>
        <el-table-column label="成绩册">
          <template slot-scope="scope">
            <div v-if="scope.row.excel" class="excel-download" @click="handleDownloadExcel(scope.row.excel.id,scope.row.excel.name)">{{ scope.row.excel.name}}</div>
            <span v-else>未关联</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateAt" label="更新日期" width="150">
          <template slot-scope="scope">
            {{ dateFormat('YYYY-mm-dd HH:MM', new Date(scope.row.updateAt)) }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.row.templateName, scope.row.id)"
            >编辑
            </el-button>
            <el-button
              size="mini"
              @click="openCopyDialog(scope.row.course.courseId,scope.row.id)"
            >复制
            </el-button>
            <el-button
              size="mini"
              @click="handleDownload(scope.row.templateName, scope.row.id)"
            >生成文档
            </el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row.templateName, scope.row.id)"
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
import {ApiDelete, ApiGet, ApiPost} from '../../api/api'
import fileDownload from 'js-file-download'

export default {
  name: 'courseInfo',
  data () {
    return {
      instanceList: [],
      copyDialogVisible: false,
      courses: [],
      selectCopyCourseId: '',
      selectCopyInstanceId: '',
      copyNewInstanceName: '',
      targetCopyCourseId: ''
    }
  },

  watch: {
    $route (to, from) {
      console.log(to, from, to.query.length)

      if (Object.keys(to.query).length === 0 && Object.keys(from.query).length > 0) {
        this.templateId = undefined
        this.courseId = undefined
        this.loadInstance()
        this.loadCourse()
      }
    }
  },
  methods: {
    async loadCourse () {
      const {data: {data}} = await ApiGet('/course')
      this.courses = data
    },
    async handleDownloadExcel (excelId, excelName) {
      // this.$request.getTemplate(fid, filename)
      const res = await ApiGet('/instance/download/' + excelId, {
        responseType: 'blob'
      })
      console.log(res.data.filename)
      fileDownload(res.data, `${excelName.substr(0, excelName.lastIndexOf('.'))}.docx`)
    },

    async handleDelete (templateName, instanceId) {
      try {
        const confirm = await this.$confirm(`确定删除实例[${instanceId}]?`)
        if (confirm) {
          try {
            await ApiDelete('/instance/' + instanceId)
            this.$message({
              type: 'success',
              message: '删除成功'
            })

            await this.loadInstance(this.templateId, this.courseId)
          } catch (e) {
            this.$error(e.message)
          }
        }
      } catch (e) {
      }
    },

    async openCopyDialog (courseId, instanceId) {
      this.selectCopyInstanceId = instanceId
      this.selectCopyCourseId = courseId
      this.copyDialogVisible = true
      this.$notify({
        title: '提示',
        type: 'warning',
        message: '只能复制到没有绑定教学文档实例的课程，若已绑请先查看并删除对应课程的文档实例',
        duration: 10000,
        customClass: 'copy-dialog-info'
      })
    },

    async handleCopy () {
      this.copyNewInstanceName = this.copyNewInstanceName.trim()
      if (!this.copyNewInstanceName) {
        await this.$confirm('请输入新实例名称')
        return
      }
      const instanceId = this.selectCopyInstanceId
      try {
        await ApiPost('/instance/copy', {
          instanceId,
          name: this.copyNewInstanceName,
          courseId: this.targetCopyCourseId
        })
        this.$message.success('复制成功')
        this.copyDialogVisible = false
        this.copyNewInstanceName = ''
        this.selectCopyCourseId = ''
        this.targetCopyCourseId = ''
        await this.loadInstance(this.templateId, this.courseId)
      } catch (e) {
        this.$message.error(`复制失败：${e.message}`)
      }
    },


    async loadInstance (templateId, courseId) {
      console.log(templateId, courseId)
      const {
        data: {data}
      } = await ApiGet('/instance', {
        params: {
          course_id: courseId,
          template_id: templateId
        }
      })
      this.instanceList = data
      this.$forceUpdate()
    },

    async handleNew (templateId) {
      this.$router.push({
        name: 'template-instance-edit',
        query: {
          templateId
        }
      })
    },

    async handleDownload (templateName, instanceId) {
      // this.$request.getTemplate(fid, filename)
      const loading = this.$loading({
        lock: true,
        text: '生成文档中，请等待文档生成完毕...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const res = await ApiGet('/instance/download/' + instanceId, {
          responseType: 'blob'
        })
        fileDownload(res.data, '生成结果.docx')
      } finally {
        loading.close()
      }
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

    handleEdit (templateName, instanceId) {
      this.$router.push({
        name: 'template-instance-edit',
        query: {
          instanceId
        }
      })
    }
  },
  computed: {},
  created () {
    const templateId = this.$route.query.templateId
    const courseId = this.$route.query.courseId
    this.templateId = templateId
    this.courseId = courseId
    console.log(templateId, courseId)
    this.loadInstance(templateId, courseId)
    this.loadCourse()
  }
}
</script>

<style>
.excel-download:hover {
  text-decoration: underline;
  color: red;
  cursor: pointer;
}

.excel-download {
  color: #3d95ff;
}
.copy-dialog-info {
  z-index: 3000 !important;
}
</style>
