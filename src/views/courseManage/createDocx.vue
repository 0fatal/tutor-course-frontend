<template>
  <el-card>
    <template slot="header">
      <h1>{{ $route.query.instanceId ? '实例生成' : '实例编辑' }}</h1>
    </template>
    <div class="form">
      <el-form
        ref="form"
        :model="tags"
        label-position="left"
        label-width="120px"
        style="width: 100%"
      >
        <el-form-item label="实例名称">
          <el-input v-model="instanceName"/>
        </el-form-item>
        <el-form-item label="选择课程">
          <el-select v-model="courseId" placeholder="请选择" @change="handleCourseChange" :disabled="!!$route.query.instanceId">
            <el-option
              v-for="item in courses"
              :key="item.courseId"
              :label="item.courseName"
              :value="item.courseId">
              <span style="float: left">{{ item.courseName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.courseNum }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择成绩册">
          <el-select v-model="excelId" placeholder="请选择" @change="handleExcelChange" clearable>
            <el-option
              v-for="item in excels"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="float: left">{{ item.name }}</span>
<!--              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.courseNum }}</span>-->
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="(k, index) in Object.keys(tags)"
          :key="index"
          :label="k"
        >
          <template v-if="typeof tags[k] === 'object'">
            <el-button size="mini" @click="addTabPane(k)">add</el-button>
            <el-table :data="tags[k]" border>
              <el-table-column
                type="index"
                width="30"
              >
              </el-table-column>
              <el-table-column
                v-for="(item,idx) in Object.keys(tags[k][0])"
                :key="idx"
                :label="item"
              >
                <template slot-scope="scope">
                  <el-input v-model="scope.row[item]"/>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button circle icon="el-icon-delete" type="danger"
                             @click="() => tags[k].splice(scope.$index,1)"></el-button>
                </template>

              </el-table-column>
            </el-table>
          </template>
          <template v-else>
            <el-input v-model="tags[k]"/>
          </template>
        </el-form-item>


      </el-form>
      <div>
        <el-button @click="saveInstance" type="primary" class="confirm">
          <span v-if="$route.query.instanceId">保存编辑</span>
          <span v-else>生成实例</span>
        </el-button>
        <el-button @click="() => $router.go(-1)" class="confirm">
          取消编辑
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import {ApiGet, ApiPatch, ApiPost} from '../../api/api'

// TODO 选择course自动请求加载课程信息
// TODO 课程的绑定，要求删除绑定
export default {
  data () {
    return {
      templateId: '',
      instanceId: '',
      excelId: '',
      courses: [],
      tags: {},
      courseId: '',
      instanceName: '',
      excels: []
    }
  },
  async created () {
    await this.loadCourse()
    await this.loadExcels()

    const {templateId, instanceId} = this.$route.query
    this.templateId = templateId
    this.instanceId = instanceId

    templateId && await this.loadTemplate(templateId, this.courseId)
    instanceId && await this.loadInstance(instanceId)
  },
  methods: {
    async handleCourseChange (courseId) {
      console.log(courseId)
      await this.loadTemplate(this.templateId, courseId)
    },

    async handleExcelChange (excelId) {

    },
    async loadTemplate (templateId, courseId) {
      const {
        data: {data}
      } = await ApiGet('/template/tags', {
        params: {
          templateId,
          courseId
        }
      })

      this.tags = data
    },

    async saveInstance () {
      try {
        if (this.$route.query.instanceId) {
          await ApiPatch('/instance', {
            templateId: this.templateId,
            // courseId: this.courseId,
            name: this.instanceName,
            id: this.instanceId,
            tags: this.tags,
            excelId: this.excelId === '' ? null : this.excelId
          })
          this.$message.success('保存成功')
          this.$router.go(-1)
        } else {
          await ApiPost('/instance/new', {
            type: 0,
            templateId: this.templateId,
            name: this.instanceName,
            staffId: this.$store.getters.teacherInfo.staffId,
            tags: this.tags,
            courseId: this.courseId
          })
          this.$message.success('生成成功')
          this.$router.go(-1)
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },


    async loadInstance (instanceId) {
      const {data: {data}} = await ApiGet(`/instance/${instanceId}`)
      this.instanceName = data.name
      this.courseId = data.courseId
      this.excelId = data.excelId
      this.tags = JSON.parse(data.tags)
    },

    async loadExcels () {
      const {data: {data}} = await ApiGet('/instance/excel')
      this.excels = data
    },


    addTabPane (tagName) {
      const t = JSON.parse(JSON.stringify(this.tags[tagName][0]))
      console.log(t)
      this.tags[tagName].push(t)
    },

    async loadCourse () {
      const {data: {data}} = await ApiGet('/course')
      this.courses = data
    },

    getDate () {
      let date = new Date()
      return (
        date.getFullYear().toString() +
        '.' +
        (date.getMonth() + 1).toString() +
        '.' +
        date.getDate().toString()
      )
    }
  }
}
</script>

<style scoped>
.confirm {
  margin-top: 20px;
}
</style>
