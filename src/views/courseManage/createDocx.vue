<template>
  <el-card>
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

        <!-- <el-form-item label="教师姓名">
          <el-input v-model="teacherName" />
        </el-form-item>
        <el-form-item label="课程名">
          <el-input v-model="courseName" />
        </el-form-item>
        <el-form-item label="课程号">
          <el-input v-model="courseCode" />
        </el-form-item>
        <el-form-item label="课程性质">
          <el-input v-model="nature" />
        </el-form-item>
        <el-form-item label="学分">
          <el-input v-model="credit" />
        </el-form-item>
        <el-form-item label="总学时">
          <el-input v-model="totalHours" />
        </el-form-item>
        <el-form-item label="参考书目">
          <el-input v-model="resource" />
        </el-form-item>
        <el-form-item label="考核方式">
          <el-input v-model="assessment" />
        </el-form-item>
        <el-form-item label="讲授学时">
          <el-input v-model="teachHours" />
        </el-form-item>
        <el-form-item label="实验学时">
          <el-input v-model="experHours" />
        </el-form-item>
        <el-form-item label="上机学时">
          <el-input v-model="operateHours" />
        </el-form-item>
        <el-form-item label="课程实践学时">
          <el-input v-model="practiceHours" />
        </el-form-item>
        <el-form-item label="自学学时">
          <el-input v-model="selfStudyHours" />
        </el-form-item> -->

      </el-form>
    </div>

    <div>
      <el-upload
        class="confirm"
        action=""
        :on-change="handleChange"
        :on-remove="handleRemove"
        :on-exceed="handleExceed"
        :limit="limitUpload"
        accept="application/vnd.openxmlformats-
        officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.xlsx"
        :auto-upload="false"
      >
        <el-button size="small" type="primary">上传成绩册</el-button>
      </el-upload>
      <el-button @click="renderDoc" type="primary" class="confirm">
        确认
      </el-button>
    </div>
  </el-card>
</template>

<script>
import Docxtemplater from 'docxtemplater'
import PizZip from 'pizzip'
// import PizZipUtils from 'pizzip/utils/index.js'
import {saveAs} from 'file-saver'

export default {
  data () {
    return {
      fid: '',
      tags: {},
      limitUpload: 1,
      filetemp: '',
      spread: null,
      importExcelFile: null,
      exportFileName: 'export.xlsx',
      password: '',

      teacherName: '',
      courseName: '', // 课程名
      courseCode: '', // 课程号
      nature: '', // 课程性质
      time: '', // 填表日期
      credit: '', // 学分
      totalHours: '', // 总学时
      resource: '', // 参考书目
      assessment: '', // 考核方式
      teachHours: '', // 讲授学时
      experHours: '', // 实验学时
      operateHours: '', // 上机学时
      practiceHours: '', // 课程实践学时
      selfStudyHours: '', // 自学学时

      clints: [
        {
          number: '1',
          id: '',
          name: '',
          a: '',
          b: '',
          c: '',
          d: '',
          total: ''
        },
        {
          number: '2',
          id: '',
          name: '',
          a: '',
          b: '',
          c: '',
          d: '',
          total: ''
        },
        {
          number: '3',
          id: '',
          name: '',
          a: '',
          b: '',
          c: '',
          d: '',
          total: ''
        },
        {
          number: '4',
          id: '',
          name: '',
          a: '',
          b: '',
          c: '',
          d: '',
          total: ''
        }
      ]
    }
  },
  created () {
    const {fid} = this.$route.query
    this.fid = fid
    this.loadTemplate(fid)
  },
  methods: {
    addTabPane (tagName) {
      const t = JSON.parse(JSON.stringify(this.tags[tagName][0]))
      console.log(t)
      this.tags[tagName].push(t)
    },

    async loadTemplate (fid) {
      const {
        data: {data}
      } = await this.$request.getTemplateTags(fid)
      this.tags = data
    },
    renderDoc () {
      this.$request.renderTemplate(this.fid, this.tags)
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
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    handleExport () {
      require.ensure([], () => {
        const {export_json_to_excel} = require('../../vendor/Export2Excel')
        const tHeader = [
          '学号',
          '姓名',
          '团队表现',
          '作品',
          '答辩',
          '文档',
          '总评'
        ]
        const filterVal = ['id', 'name', 'a', 'b', 'c', 'd', 'total']
        const list = this.clints
        const data = this.formatJson(filterVal, list)
        console.log(data)
        export_json_to_excel(tHeader, data, '学生成绩册')
      })
    },
    // 上传文件时处理方法
    handleChange (file, fileList) {
      this.fileTemp = file.raw
      if (this.fileTemp) {
        if (
          this.fileTemp.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
          this.fileTemp.type === 'application/vnd.ms-excel'
        ) {
          this.importfxx(this.fileTemp)
        } else {
          this.$message({
            type: 'warning',
            message: '附件格式错误，请删除后重新上传！'
          })
        }
      } else {
        this.$message({
          type: 'warning',
          message: '请上传附件！'
        })
      }
    },
    // 超出最大上传文件数量时的处理方法
    handleExceed () {
      this.$message({
        type: 'warning',
        message: '超出最大上传文件数量的限制！'
      })
    },
    // 移除文件的操作方法
    handleRemove (file, fileList) {
      this.fileTemp = null
    },
    importfxx (obj) {
      // let inputDOM = this.$refs.inputer
      // 通过DOM取文件数据
      let that = this

      this.filetemp = event.currentTarget.files[0]

      var rABS = false // 是否将文件读取为二进制字符串
      var f = this.filetemp

      var reader = new FileReader()
      // if (!FileReader.prototype.readAsBinaryString) {
      FileReader.prototype.readAsBinaryString = function (f) {
        var binary = ''
        var rABS = false // 是否将文件读取为二进制字符串
        var wb // 读取完成的数据
        var outdata
        var reader = new FileReader()
        reader.onload = function (e) {
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          // 此处引入，用于解析excel
          var XLSX = require('xlsx')
          if (rABS) {
            wb = XLSX.read(btoa(fixdata(binary)), {
              // 手动转化
              type: 'base64'
            })
          } else {
            wb = XLSX.read(binary, {
              type: 'binary'
            })
          }
          outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
          console.log(outdata)
          that.clints = outdata.map((value, index) => {
            return {
              number: index + 1,
              id: value['学号'],
              name: value['姓名'],
              a: value['团队表现'],
              b: value['作品'],
              c: value['答辩'],
              d: value['文档'],
              total: value['总评']
            }
          })
          // outdata就是读取的数据（不包含标题行即表头，表头会作为对象的下标）
          // 此处可对数据进行处理
          // let arr = [];
          // outdata.map(v => {
          //     let obj = {}
          //     obj.code = v['Code']
          //     obj.name = v['Name']
          //     obj.pro = v['province']
          //     obj.cit = v['city']
          //     obj.dis = v['district']
          //     arr.push(obj)
          // });
          // _this.da=arr;
          // _this.dalen=arr.length;
          // return arr
        }
        reader.readAsArrayBuffer(f)
      }
      if (rABS) {
        reader.readAsArrayBuffer(f)
      } else {
        reader.readAsBinaryString(f)
      }
    }
  }
}
</script>

<style scoped>
.confirm {
  margin-top: 20px;
}
</style>
