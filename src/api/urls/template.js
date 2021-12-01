const baseURL = 'http://localhost:7002/template'

export default (fid) => ({
  getTemplate: baseURL + '/'+fid,
  getTemplateList: baseURL + '/',
  getTemplateTags: baseURL+ `/tags?fid=${fid}`,
  deleteTemplate: baseURL + '/'+fid,
  renderTemplate: baseURL+ `/render`
})