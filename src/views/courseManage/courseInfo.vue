<template>
  <div>
    <el-card>
      <template slot="header">
        <el-button size="mini" type="warning" @click="() => uploadDialogShow = true">创建新实例</el-button>
      </template>
      <el-table border :data="courses" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column sortable prop="courseId" width="320" label="课程编号">
        </el-table-column>
        <el-table-column prop="courseName" label="课程名"></el-table-column>
        <el-table-column prop="courseNum" label="课程代号"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleQueryTemplate(scope.row.courseName, scope.row.courseId)"
            >查看模板
            </el-button>
            <el-button
              size="mini"
              @click="handleQueryInstance(scope.row.courseName, scope.row.courseId)"
            >查看实例
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
import {ApiGet} from '../../api/api'

export default {
  name: 'courseInfo',
  data () {
    return {
      courses: []
    }
  },
  methods: {
    async loadCourses () {
      const { data } = await ApiGet('/course/')
      console.log(data)
      this.courses = data.data
      this.$forceUpdate()
    },

    handleQueryTemplate (courseName, courseId) {
      this.$router.push({
        name: 'course-template',
        query: {
          courseId: courseId
        }
      })
    },

    handleQueryInstance (courseName, courseId) {
      this.$router.push({
        name: 'course-template-instance',
        query: {
          courseId: courseId
        }
      })
    }
  },
  created () {
    this.loadCourses()
  }
}
</script>

<style></style>
