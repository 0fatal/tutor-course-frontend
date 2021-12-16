<template>
  <div>
    <el-card>
      <template slot="header">
        <h1 v-if="!$route.query.templateId">成绩册列表</h1>
        <el-button v-else size="mini" type="warning" @click="handleNew($route.query.templateId)">上传成绩册</el-button>
      </template>
      <el-table border :data="instanceList" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="id" width="320" label="成绩册编号">
        </el-table-column>
        <el-table-column prop="templateName" label="模板文件名"></el-table-column>
        <el-table-column prop="courseName" label="课程名"></el-table-column>
        <el-table-column prop="updateAt" label="更新日期" width="150">
          <template slot-scope="scope">
            {{ dateFormat('YYYY-mm-dd HH:MM', new Date(scope.row.updateAt)) }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleCopy(scope.row.templateName, scope.row.id)"
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

    async handleCopy (templateName, instanceId) {
      try {
        await ApiPost('/instance/copy/' + instanceId)
        this.$message.success('复制成功')
        await this.loadInstance(this.templateId, this.courseId)
      } catch (e) {
        this.$message.error(`复制失败：${e.message}`)
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
