/**
 * Created by WebStorm.
 * User: nirongxu
 * Date: 2018/12/8
 * Description: 文件描述
 */
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
const cn = {
  routeName: {
    home: '主页',
    builtInIcon: '内置图标',
    shuttleBox: '穿梭框',
    demoShuttle: '穿梭框demo',
    permissions: '权限管理',
    pageControl: '页面权限',
    btnControl: '按钮权限',
    table: '表格',
    navMenu: '导航菜单',
    test: '测试',
    courseManage: '课程管理',
    docxInfo: '教学文档列表',
    createDocx: '生成教学文档',
    courseInfo: '课程信息',
    courseApply: '入班申请',
    infoManage: '个人信息管理',
    studentInfo: '学生个人信息',
    teacherInfo: '教师个人信息',
    testoss: 'oss测试'
  },
  rightMenu: {
    close: '关闭',
    closeOther: '关闭其他',
    closeAll: '全部关闭'
  },
  role: {
    teacher: '教师',
    student: '学生',
    ordinary: '普通用户'
  },
  userDropdownMenu: {
    basicInfor: '基本资料',
    changePassword: '修改密码',
    logout: '退出'
  },

  ...zhLocale //  合并element-ui内置翻译
}

export default cn
