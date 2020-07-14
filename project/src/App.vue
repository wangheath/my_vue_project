<template>
  <div id="app">
    <!-- <div id="nav"> -->
      <!-- <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> -->
    <!-- </div> -->
    <router-view />
  </div>
</template>

<style lang="stylus">

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0
}

body {
  font: 14px Microsoft YaHei;
  -webkit-text-size-adjust: 100%;
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  background: #000;
}
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
 

</style>
