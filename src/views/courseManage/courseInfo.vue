<template>
  <div>
    <el-dialog :visible.sync="newCourseDialogVisible">
      <h1>创建课程实例</h1>
      <el-divider></el-divider>
      <el-form label-width="100px" label-position="left">
        <el-form-item label="选择课程模板">
          <el-select v-model="newCourseForm.courseTemplateId" placeholder="请选择">
            <el-option
              v-for="v in templateCourse"
              :key="v.courseTemplateId"
              :value="v.courseTemplateId"
              :label="v.courseName"
            >
              <span style="float: left">{{ v.courseName }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ v.courseCode }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始学年" :prop="newCourseForm.beginYear">
          <el-input v-model="newCourseForm.beginYear"></el-input>
        </el-form-item>
        <el-form-item label="结束学年" :prop="newCourseForm.endYear">
          <el-input v-model="newCourseForm.endYear"></el-input>
        </el-form-item>
        <el-form-item label="开课学期" :prop="newCourseForm.semester">
          <el-input v-model="newCourseForm.semester"></el-input>
        </el-form-item>
        <el-form-item label="上课教室" :prop="newCourseForm.classroom">
          <el-input v-model="newCourseForm.classroom"></el-input>
        </el-form-item>
        <el-form-item label="上课时间" :prop="newCourseForm.classTime">
          <el-input v-model="newCourseForm.classTime"></el-input>
        </el-form-item>
        <el-form-item label="教学班号" :prop="newCourseForm.classNum">
          <el-input v-model="newCourseForm.classNum"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item>
          <el-button type="primary" @click="createCourse">创建课程实例</el-button>
          <el-button @click="() => (newCourseDialogVisible = false)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog :visible.sync="editCourseDialogVisible">
      <h1>编辑课程实例</h1>
      <el-divider></el-divider>
      <el-form label-width="100px" label-position="left">
        <el-form-item label="开始学年" :prop="editCourseForm.beginYear">
          <el-input v-model="editCourseForm.beginYear"></el-input>
        </el-form-item>
        <el-form-item label="结束学年" :prop="editCourseForm.endYear">
          <el-input v-model="editCourseForm.endYear"></el-input>
        </el-form-item>
        <el-form-item label="开课学期" :prop="editCourseForm.semester">
          <el-input v-model="editCourseForm.semester"></el-input>
        </el-form-item>
        <el-form-item label="上课教室" :prop="editCourseForm.classroom">
          <el-input v-model="editCourseForm.classroom"></el-input>
        </el-form-item>
        <el-form-item label="上课时间" :prop="editCourseForm.classTime">
          <el-input v-model="editCourseForm.classTime"></el-input>
        </el-form-item>
        <el-form-item label="教学班号" :prop="editCourseForm.classNum">
          <el-input v-model="editCourseForm.classNum"></el-input>
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item>
          <el-button type="primary" @click="modifyCourse">保存编辑</el-button>
          <el-button @click="() => (editCourseDialogVisible = false)">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-card>
      <template slot="header">
        <el-button type="warning" size="mini" @click="() => (newCourseDialogVisible = true)">创建课程实例</el-button>
      </template>
      <el-table border :data="courses" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="courseName" label="课程名" width="120"></el-table-column>
        <el-table-column prop="courseCode" label="课程代号" width="120"></el-table-column>
        <el-table-column prop="classNum" label="教学班号" width="100"></el-table-column>
        <el-table-column prop="courseNum" label="学分" width="70">
          <template slot-scope="scope"> {{ scope.row.credit }} 学分 </template>
        </el-table-column>
        <el-table-column label="开课时间">
          <template slot-scope="scope">
            <span>{{ `${scope.row.beginYear}-${scope.row.endYear} 第${scope.row.semester}学期` }}</span>
          </template>
        </el-table-column>
        <el-table-column label="教室" prop="classroom"> </el-table-column>
        <el-table-column label="上课时间" prop="classTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleQueryInstance(scope.row.courseName, scope.row.courseId)"
              >教学文档
            </el-button>
            <el-button size="mini" @click="handleEditInstance(scope.row.courseName, scope.row.courseId)" type="primary"
              >编辑
            </el-button>
            <el-popconfirm
              title="确定要删除吗？"
              @confirm="handleDeleteInstance(scope.row.courseName, scope.row.courseId)"
            >
              <el-button slot="reference" size="mini" type="danger">删除 </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { ApiDelete, ApiGet, ApiPatch, ApiPost } from '../../api/api'

export default {
  name: 'courseInfo',
  data() {
    return {
      courses: [],
      newCourseForm: {
        courseTemplateId: '',
        beginYear: null,
        endYear: null,
        classroom: '',
        classTime: '',
        semester: null,
        classNum: null
      },
      editCourseForm: {
        beginYear: null,
        endYear: null,
        classroom: '',
        classTime: '',
        semester: null,
        courseId: '',
        classNum: null
      },
      newCourseDialogVisible: false,
      editCourseDialogVisible: false,
      templateCourse: []
    }
  },
  methods: {
    async modifyCourse() {
      try {
        await ApiPatch('/course', this.editCourseForm)
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.editCourseDialogVisible = false
        await this.loadCourses()
      } catch (e) {
        this.$message({
          message: `修改失败,原因：${e.message}`,
          type: 'error'
        })
      }
    },
    async createCourse() {
      try {
        await ApiPost('/course', this.newCourseForm)
        // 创建成功，提示并关闭窗口
        this.$message({
          message: '创建成功',
          type: 'success'
        })
        this.newCourseDialogVisible = false
        await this.loadCourses()
      } catch (e) {
        console.log(e)
        this.$message.error(`创建失败,原因：${e.message}`)
      }
    },
    async loadCourses() {
      const { data } = await ApiGet('/course/')
      console.log(data)

      this.courses = data.data
      this.$forceUpdate()
    },

    async handleEditInstance(courseName, courseId) {
      const {
        data: { data: res }
      } = await ApiGet(`/course/${courseId}`)
      this.editCourseForm = {
        beginYear: res.beginYear + '',
        endYear: res.endYear + '',
        classroom: res.classroom + '',
        classTime: res.classTime + '',
        courseId: courseId + '',
        semester: res.semester + '',
        classNum: res.classNum + ''
      }
      this.editCourseDialogVisible = true
    },

    async handleDeleteInstance(courseName, courseId) {
      try {
        await ApiDelete(`/course/${courseId}`)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        await this.loadCourses()
      } catch (e) {
        console.log(e)
        this.$message.error(`删除失败,原因：${e.message}`)
      }
    },

    async loadCourseTemplate() {
      const { data } = await ApiGet('/course_template')
      console.log('course-template', data.data)
      this.templateCourse = data.data
      console.log(this.templateCourse)
    },

    handleQueryTemplate(courseName, courseId) {
      this.$router.push({
        name: 'course-template',
        query: {
          courseId: courseId
        }
      })
    },

    changeCourseState(courseState, courseId) {
      console.log('course-state-change', courseState, courseId)
      ApiPatch('/course/state', {
        courseId: courseId,
        courseState: courseState
      })
    },

    handleQueryInstance(courseName, courseId) {
      this.$router.push({
        name: 'course-template-instance',
        query: {
          courseId: courseId
        }
      })
    }
  },
  async created() {
    await this.loadCourseTemplate()
    await this.loadCourses()
  }
}
</script>

<style></style>
