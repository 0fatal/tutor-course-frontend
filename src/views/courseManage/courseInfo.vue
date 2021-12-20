<template>
  <div>
    <el-card>
      <template slot="header">
        <h1>课程列表</h1>
      </template>
      <el-table border :data="courses" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="courseName" label="课程名"></el-table-column>
        <el-table-column prop="courseNum" label="课程代号"></el-table-column>
        <el-table-column prop="courseNum" label="学分">
          <template slot-scope="scope">
            {{scope.row.credit}} 学分
          </template>
        </el-table-column>
        <el-table-column label="课程时间">
          <template slot-scope="scope">
            <span>{{`${scope.row.beginYear}-${scope.row.endYear} 第${scope.row.semester}学期`}}</span>
          </template>
        </el-table-column>

        <el-table-column label="开课状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.courseState"
              active-text="开课"
              :active-value="1"
              :inactive-value="0"
              @change="changeCourseState($event,scope.row.courseId)"
              inactive-text="未开课">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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
import {ApiGet, ApiPatch} from '../../api/api'

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

    changeCourseState (courseState, courseId) {
      console.log('course-state-change', courseState, courseId)
      ApiPatch('/course/state', {
        courseId: courseId,
        courseState: courseState
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
