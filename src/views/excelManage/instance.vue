<template>
  <div>
    <el-card>
      <template slot="header">
        <h1>成绩册列表</h1>
      </template>
      <el-table border :data="instanceList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="templateName" label="模板文件名">
          <template slot-scope="scope">
            <span>{{scope.row.template.templateName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="courseName" label="课程名">
          <template slot-scope="scope">
            <span>{{scope.row.course.courseName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="实例名称"></el-table-column>
        <el-table-column prop="updateAt" label="更新日期" width="150">
          <template slot-scope="scope">
            {{ dateFormat('YYYY-mm-dd HH:MM', new Date(scope.row.updateAt)) }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
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
      templateId: '',
      courseId: ''
    }
  },
  methods: {
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

    async loadInstance (templateId, courseId) {
      const {
        data: {data}
      } = await ApiGet('/instance/excel', {
        params: {
          course_id: courseId,
          template_id: templateId
        }
      })
      this.instanceList = data
      this.$forceUpdate()
    },

    async handleDownload (templateName, instanceId) {
      // this.$request.getTemplate(tid, templateName)
      const res = await ApiGet('/instance/download/' + instanceId, {
        responseType: 'blob'
      })
      fileDownload(res.data, '生成结果.docx')
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
  }
}
</script>

<style></style>
