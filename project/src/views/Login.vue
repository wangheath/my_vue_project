<template>
  <div id="login">
    <canvas id="canvas"></canvas>
  </div>
</template>

<script>
export default {
  name: "Login",
  props: {
    msg: String
  },
  created() {},
  mounted() {
    this.drawCanvas();
  },
  methods: {
    
  }
};
</script>


<style scoped lang="stylus">

#canvas {
  width: 100%;
  height: 100%;
  display: block;
  opacity: 0.8;
}
</style>
