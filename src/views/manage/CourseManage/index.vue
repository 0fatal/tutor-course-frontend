<template>
  <section>
    <el-dialog :visible.sync="courseDialogVisible">
      <h1>课程模板</h1>
      <el-divider></el-divider>
      <el-form label-width="80" label-position="left">
        <el-form-item label="课程名"> <el-input v-model="courseTemplateForm.courseName"></el-input></el-form-item>
        <el-form-item label="学分"> <el-input v-model="courseTemplateForm.credit"></el-input></el-form-item>
        <el-form-item label="课程代号"> <el-input v-model="courseTemplateForm.courseCode"></el-input></el-form-item>
        <el-divider></el-divider>
        <el-form-item>
          <el-popconfirm title="确定提交吗？" @confirm="handleAddOrEditCourse">
            <el-button type="primary" slot="reference">提交</el-button>
          </el-popconfirm>
          <el-button @click="courseDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-card>
      <template slot="header">
        <header>
          <h1>课程管理</h1>
          <el-button type="primary" size="mini" @click="() => ((isEdit = false), (courseDialogVisible = true))">
            添加课程
          </el-button>
        </header>
      </template>
      <el-table :data="templateCourse">
        <el-table-column prop="courseName" label="课程名"></el-table-column>
        <el-table-column prop="courseCode" label="课程代号"></el-table-column>
        <el-table-column prop="credit" label="学分">
          <template slot-scope="scope">
            <span>{{ scope.row.credit }} 学分</span>
          </template>
        </el-table-column>
        <el-table-column prop="createAt" label="创建时间">
          <template slot-scope="scope">
            <span>{{ dateFormat('YYYY-mm-dd HH:MM', new Date(scope.row.createAt)) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="credit" label="是否启用">
          <template slot-scope="scope">
            <el-switch
              @change="handleCourseStateChange($event, scope.row.courseTemplateId)"
              active-color="#13ce66"
              v-model="scope.row.courseState"
              :active-value="1"
              inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button
              circle
              size="mini"
              @click="editCourseTemplate(scope.row.courseTemplateId)"
              icon="el-icon-edit"
              type="primary"
            ></el-button>
            <el-popconfirm
              title="确定要删除该课程模板吗，会连带删除所有老师一切与该课程有关的数据？"
              @confirm="deleteCourseTemplate(scope.row.courseTemplateId)"
            >
              <el-button type="danger" size="mini" slot="reference" icon="el-icon-delete" circle></el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </section>
</template>

<script>
import { ApiDelete, ApiGet, ApiPatch, ApiPost } from '../../../api/api'
import { dateFormat } from '../../../utils'

export default {
  data() {
    return {
      courseDialogVisible: false,
      templateCourse: [],
      courseTemplateForm: {
        courseName: '',
        courseCode: '',
        credit: null
      },
      isEdit: false,
      courseTemplateId: ''
    }
  },
  watch: {
    courseDialogVisible(val) {
      if (!val) {
        this.courseTemplateForm = {
          courseName: '',
          courseCode: '',
          credit: null
        }
      }
    }
  },
  methods: {
    dateFormat,
    async handleCourseStateChange(val, courseTemplateId) {
      console.log(val, courseTemplateId)
      await ApiPatch('/course_template', {
        courseTemplateId: courseTemplateId,
        courseState: val
      })
    },

    async handleAddOrEditCourse() {
      try {
        if (this.isEdit) {
          const form = this.courseTemplateForm
          form.courseTemplateId = this.courseTemplateId
          await ApiPatch('/course_template', form)
        } else {
          await ApiPost('/course_template', this.courseTemplateForm)
        }
        this.courseDialogVisible = false
        this.$message.success('操作成功')
        await this.loadCourseTemplate()
      } catch (e) {
        this.$message.error(`操作失败,原因：${e.message}`)
      }
    },
    async editCourseTemplate(courseTemplateId) {
      try {
        this.isEdit = true
        this.courseTemplateId = courseTemplateId
        const {
          data: { data }
        } = await ApiGet(`/course_template/${courseTemplateId}`)
        console.log(data)
        this.courseTemplateForm = {
          courseName: data.courseName,
          courseCode: data.courseCode,
          credit: data.credit
        }
        this.courseDialogVisible = true
      } catch (e) {
        this.$message.error(`操作失败,原因：${e.message}`)
      }
    },

    async deleteCourseTemplate(courseTemplateId) {
      console.log('delete course template', courseTemplateId)
      try {
        await ApiDelete(`/course_template/${courseTemplateId}`)
        this.$message.success('操作成功')
        await this.loadCourseTemplate()
      } catch (e) {
        this.$message.error(`操作失败,原因：${e.message}`)
      }
    },
    async loadCourseTemplate() {
      const { data } = await ApiGet('/course_template?m=1')
      this.templateCourse = data.data
      this.$forceUpdate()
    }
  },
  created() {
    this.loadCourseTemplate()
  }
}
</script>

<style scoped>
header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
