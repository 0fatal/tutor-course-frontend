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

export default {
  data () {
    return {
      // template: {
      //   tags: {}
      // },
      // instance: '',
      // course: {
      //   courseId: ''
      // }
      templateId: '',
      instanceId: '',
      tags: {},
      courseId: {}
    }
  },
  async created () {
    const {templateId, instanceId, courseId} = this.$route.query
    this.templateId = templateId
    this.instanceId = instanceId
    this.courseId = courseId


    templateId && await this.loadTemplate(templateId)
    instanceId && await this.loadInstance(instanceId)
  },
  methods: {
    async loadTemplate (templateId) {
      const {
        data: {data}
      } = await ApiGet('/template/tags', {
        params: {
          templateId
        }
      })

      this.tags = data
    },

    async saveInstance () {
      try {
        if (this.$route.query.instanceId) {
          await ApiPatch('/instance', {
            templateId: this.templateId,
            id: this.instanceId,
            tags: this.tags
          })
          this.$message.success(this.$route.query.instanceId ? '保存成功' : '生成成功')
          this.$router.go(-1)
        } else {
          await ApiPost('/instance/new', {
            type: 0,
            templateId: this.templateId,
            staffId: this.$store.getters.teacherInfo.staffId,
            tags: this.tags,
            courseId: this.courseId
          })
          this.$message.success(this.$route.query.instanceId ? '保存成功' : '生成成功')
          this.$router.go(-1)
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },


    async loadInstance (instanceId) {
      const {data: {data}} = await ApiGet(`/instance/${instanceId}`)
      this.tags = JSON.parse(data.tags)
    },

    renderDoc () {
      this.$request.renderTemplate(this.fid, this.tags)
    },

    addTabPane (tagName) {
      const t = JSON.parse(JSON.stringify(this.tags[tagName][0]))
      console.log(t)
      this.tags[tagName].push(t)
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
