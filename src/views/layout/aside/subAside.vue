<template>
  <el-submenu :index="name" v-if="type">
    <template slot="title">
      <span slot="title">{{ name }}</span>
    </template>
    <sub-aside
      v-for="(r, idx) in children"
      :key="idx"
      :name="r.name"
      :type="r.type"
      :children="r.children"
      :route="r.route"
    ></sub-aside>
  </el-submenu>
  <el-menu-item :index="route" :key="route" v-else>
    {{ name }}
  </el-menu-item>
</template>

<script>
export default {
  name: 'SubAside',
  props: {
    name: {
      type: String
    },
    type: {
      type: String
    },
    children: {
      type: Array
    },
    route: {
      type: String
    }
  },
  data() {
    return {}
  },
  methods: {
    test() {
      console.log(1111)
    }
  }
}
</script>
