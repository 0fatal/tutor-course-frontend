import fileDownload from 'js-file-download'
import axios from '../axios'
import templateUrl from '../urls/template'

export default {
  async getTemplate (fid, filename) {
    const res = await axios.get(templateUrl(fid).getTemplate, {
      responseType: 'blob'
    })
    fileDownload(res.data, filename)
  },

  getTemplateList () {
    return axios.get(templateUrl().getTemplateList)
  },

  getTemplateTags (fid) {
    return axios.get(templateUrl(fid).getTemplateTags)
  },

  async renderTemplate (fid, tags) {
    const res = await axios.post(templateUrl().renderTemplate, {
      fid,
      tags
    }, {
      responseType: 'blob'
    })
    fileDownload(res.data, '生成结果.docx')
  },

  deleteTemplate (fid) {
    return axios.delete(templateUrl(fid).deleteTemplate)
  }
}
