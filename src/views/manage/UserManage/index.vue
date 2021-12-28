<template>
  <section>
    <el-dialog :visible.sync="teacherDialogVisible">
      <h1>修改资料</h1>
      <el-divider></el-divider>
      <el-form label-width="80" label-position="left">
        <el-form-item label="工号">
          <el-input v-model="teacherInfo.staffId" :disabled="isEdit"></el-input
        ></el-form-item>
        <el-form-item label="用户名"> <el-input v-model="teacherInfo.name"></el-input></el-form-item>
        <el-form-item label="登录密码"> <el-input v-model="teacherInfo.password"></el-input></el-form-item>
        <el-divider></el-divider>
        <el-form-item>
          <el-popconfirm title="确定提交吗？" @onConfirm="handleAddOrEditTeacher"
            ><el-button type="primary" slot="reference">提交</el-button></el-popconfirm
          >
          <el-button @click="teacherDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-card>
      <template slot="header">
        <header>
          <h1>用户管理</h1>
          <el-button type="primary" size="mini" @click="() => ((isEdit = false), (teacherDialogVisible = true))">
            添加用户
          </el-button>
        </header>
      </template>
      <el-table :data="teacherList">
        <el-table-column prop="name" label="用户名"></el-table-column>
        <el-table-column prop="staffId" label="工号"></el-table-column>
        <el-table-column prop="createAt" label="创建时间">
          <template slot-scope="scope">
            <span>{{ dateFormat('YYYY-mm-dd HH:MM', new Date(scope.row.createAt)) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="credit" label="是否封禁">
          <template slot-scope="scope">
            <el-switch
              v-if="scope.row.isAdmin !== 1"
              @change="handleForbiddenStateChange($event, scope.row.staffId)"
              active-color="orange"
              v-model="scope.row.forbidden"
              :active-value="1"
              inactive-value="0"
            ></el-switch>
            <span>{{ scope.row.forbidden === 1 ? '已封禁' : '未封禁' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isAdmin" label="身份">
          <template slot-scope="scope">
            {{ scope.row.isAdmin === 1 ? '管理员' : '普通' }}
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button
              circle
              size="mini"
              @click="editTeacherInfo(scope.row.staffId)"
              icon="el-icon-edit"
              type="primary"
            ></el-button>
            <el-popconfirm
              title="确定要删除账号吗，所有的关于该账号的数据都会删除？"
              @onComfirm="deleteTeacher(scope.row.staffId)"
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
      teacherDialogVisible: false,
      teacherList: [],
      teacherInfo: {
        name: '',
        staffId: '',
        password: ''
      },
      isEdit: false
    }
  },
  watch: {
    teacherDialogVisible(val) {
      if (!val) {
        this.teacherInfo = {
          name: '',
          staffId: '',
          password: ''
        }
      }
    }
  },
  methods: {
    dateFormat,
    async handleForbiddenStateChange(val, staffId) {
      await ApiPost(`/teacher/forbidden/${staffId}?f=${val}`)
    },

    async handleAddOrEditTeacher() {
      try {
        if (this.isEdit) {
          await ApiPatch('/teacher', this.teacherInfo)
        } else {
          await ApiPost('/teacher/registry', this.teacherInfo)
        }
        this.teacherDialogVisible = false
        this.$message.success('操作成功')
        await this.loadTeacherList()
      } catch (e) {
        this.$message.error(`操作失败,原因：${e.message}`)
      }
    },
    async editTeacherInfo(staffId) {
      try {
        this.isEdit = true
        const {
          data: { data }
        } = await ApiGet(`/teacher/info/${staffId}`)
        console.log(data)
        this.teacherInfo = {
          name: data.name,
          staffId: data.staffId,
          password: data.password
        }
        this.teacherDialogVisible = true
      } catch (e) {
        this.$message.error(`操作失败,原因：${e.message}`)
      }
    },

    async deleteTeacher(staffId) {
      console.log('delete teacher', staffId)
      try {
        await ApiDelete(`/teacher/${staffId}`)
        this.$message.success('操作成功')
        await this.loadTeacherList()
      } catch (e) {
        this.$message.error(`操作失败,原因：${e.message}`)
      }
    },
    async loadTeacherList() {
      const { data } = await ApiGet('/teacher/list')
      console.log(data)
      this.teacherList = data.data
      this.$forceUpdate()
    }
  },
  created() {
    this.loadTeacherList()
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
