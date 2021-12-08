<template>
  <div>
    <el-aside id="asideNav">
      <div class="logo-name">
        <p>教学材料生成系统</p>
      </div>
      <el-menu :default-active="$route.path" class="el-menu-vertical"
               @select="selectMenu"
               :collapse="$store.getters.isCollapse"
               background-color="#03152A"
               text-color="rgba(255,255,255,.7)"
               active-text-color="#e6c56c"
               router
               :unique-opened="openTab"
               :collapse-transition="true"
      >
        <el-submenu :index="1">
          <template slot="title">
            <span slot="title">课程相关</span>
          </template>
          <el-menu-item :index="1" route="/course">
            课程列表
          </el-menu-item>
          <el-menu-item :index="2" route="/course/template">
            模板列表
          </el-menu-item>
          <el-menu-item :index="3" route="/course/template/instance">
            实例列表
          </el-menu-item>
        </el-submenu>
        <el-submenu :index="2">
          <template slot="title">
            <span slot="title">教师信息</span>
          </template>
          <el-menu-item :index="1" route="/info/teacher">
            教师个人信息
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
  </div>
</template>

<script>
import menuTree from './menuTree'

export default {
  name: 'asideNav',
  components: {
    menuTree
  },
  data () {
    return {
      openTab: ''
    }
  },
  watch: {
    // 监听浏览器直接输入路由，将此路由添加到tabnavBox
    '$route.path': function (val) {
      this.selectMenu(val)
    }
  },
  methods: {
    selectMenu (key, indexpath) {
      // 如果不使用 elemenUI 菜单的 vue-router 的模式将用以下方式进行页面跳转 el-menu的router设置为false
      // this.$router.push(indexpath.join("/"))
      let router = this.$store.getters.routers
      let name = ''
      let navTitle = function (path, routerARR) {
        for (let i = 0; i < routerARR.length; i++) {
          if (routerARR[i].children.length > 0 || routerARR[i].path === path) {
            if (routerARR[i].path === path && routerARR[i].children.length < 1) {
              name = routerARR[i].name
              break
            }
            navTitle(path, routerARR[i].children)
          }
        }
        return name
      }
      this.$store.dispatch('addTab', {
        title: navTitle(key, router),
        path: key
      })
    }
  }
}
</script>

<style lang="scss">
$top: top;
$bottom: bottom;
$left: left;
$right: right;
%w100 {
  width: 100%;
}

%h100 {
  height: 100%;
}

%cursor {
  cursor: pointer;
}

@mixin set-value($side, $value) {
  @each $prop in $leftright {
    #{$side}-#{$prop}: $value;
  }
}

#asideNav {
  width: auto !important;
  display: flex;
  flex-direction: column;
  border-right: solid 1px #e6e6e6;

  .logo-name {
    background-color: #03152A !important;
    @extend %w100;
    font-weight: 300;
    z-index: 999;

    p {
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      color: #5e6d82;
    }
  }

  .el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    @extend %h100;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .el-menu {
    flex: 1;
    overflow: inherit;
    border-right: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .fa {
      vertical-align: middle;
      margin-right: 5px;
      width: 24px;
      text-align: center;
      font-size: 18px;
    }

    .el-menu-item {
      background-color: #020f1d !important;
      border-bottom: 1px solid #020f1d;

      &:hover {
        color: #ffffff !important;
        background-color: #375573 !important;
      }
    }

    .el-menu-item.is-active {
      background-color: #56a9ff !important
    }

    .is-opened > .el-submenu__title > .el-icon-arrow-down {
      color: #ffffff;
      font-weight: 500;
      font-size: 18px;
    }
  }

}
</style>
