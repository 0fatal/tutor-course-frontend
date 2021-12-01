/**
 * Created by WebStorm.
 * User: nirongxu
 * Date: 2018/12/8
 * Description: 文件描述
 */
import enLocale from 'element-ui/lib/locale/lang/en'
const en = {
  routeName: {
    home: 'home',
    builtInIcon: 'builtInIcon',
    shuttleBox: 'shuttleBox',
    demoShuttle: 'demoShuttle',
    permissions: 'permissions',
    pageControl: 'pageControl',
    btnControl: 'btnControl',
    table: 'table',
    navMenu: 'navMenu',
    test: 'test',
    courseManage: 'courseManage',
    createDocx: 'createDocx',
    docxInfo: 'docxInfo',
    courseInfo: 'courseInfo',
    courseApply: 'courseApply',
    infoManage: 'infoManage',
    studentInfo: 'studentInfo',
    teacherInfo: 'teacherInfo',
    testoss: 'testoss'
  },
  rightMenu: {
    close: 'close',
    closeOther: 'closeOther',
    closeAll: 'closeAll'
  },
  role: {
    teacher: 'teacher',
    student: 'student',
    ordinary: 'ordinary'
  },
  userDropdownMenu: {
    basicInfor: 'basicInfor',
    changePassword: 'changePassword',
    logout: 'logout'
  },

  ...enLocale //  合并element-ui内置翻译
}

export default en
