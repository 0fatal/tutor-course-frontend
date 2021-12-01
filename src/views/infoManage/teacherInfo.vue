<template>
  <section>
    <el-card>
      <template slot="header">
        <span>教师信息</span>
      </template>
      <section>
        <el-form :model="teacherInfo" label-position="left" label-width="120px">
          <el-form-item label="工号">
            <span>{{ teacherInfo.staffId }}</span>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model="teacherInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="注册日期">
            <span>{{ teacherInfo.createAt }}</span>
          </el-form-item>
          <el-form-item style="padding-top: 1rem; border-top: 0.5px solid rgba(0,0,0,.2)" inline-message>
            <el-button @click="updateTeacherInfo" type="primary">保存</el-button>
            <el-button @click="loadTeacherInfo">重置</el-button>
          </el-form-item>
        </el-form>
      </section>
    </el-card>
  </section>
</template>

<script>
import {ApiGet, ApiPatch} from '../../api/api'

export default {
  name: 'teacherInfo',
  data () {
    return {
      teacherInfo: {}
    }
  },
  methods: {
    async loadTeacherInfo () {
      const {data} = await ApiGet('/teacher/')
      if (data.code === 0) {
        this.teacherInfo = data.data
      }
    },

    async updateTeacherInfo () {
      const {data} = await ApiPatch('/teacher/', {
        name: this.teacherInfo.name
      })
      if (data.code === 0) {
        this.$message.success('保存成功')
      } else {
        this.$message.error(data.msg)
      }
    }
  },
  created () {
    this.loadTeacherInfo()
  }
}
</script>

<style>

</style>
