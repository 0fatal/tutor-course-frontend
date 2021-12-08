<template>
  <div>
    <el-card>
    <template slot="header">
      <el-button size="mini" type="warning" @click="() => uploadDialogShow = true">创建新实例</el-button>
    </template>
    <el-table border :data="instanceList" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="id" width="320" label="实例编号">
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
            @click="handleInstance(scope.row.filename, scope.row.fid)"
          >查看
          </el-button>
          <el-button
            size="mini"
            @click="handleInstance(scope.row.filename, scope.row.fid)"
          >编辑
          </el-button>
          <el-button
            size="mini"
            @click="handleInstance(scope.row.filename, scope.row.fid)"
          >复制
          </el-button>
          <el-button
            size="mini"
            @click="handleDownload(scope.row.filename, scope.row.fid)"
          >生成文档
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
      instanceList: []
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

            await loadCourses()
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
      } = await ApiGet('/instance', {
        params: {
          course_id: courseId,
          template_id: templateId
        }
      })
      this.instanceList = data
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

    handleInstance (filename, fid) {
      this.$router.push(`/courseManage/createDocx?fid=${fid}`)
    }
  },
  computed: {},
  created () {
    const templateId = this.$route.query.templateId
    const courseId = this.$route.query.courseId
    console.log(templateId, courseId)
    this.loadInstance(templateId, courseId)
  }
}
</script>

<style></style>
