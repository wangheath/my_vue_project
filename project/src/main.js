import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import canvasJs from "../public/js/canvas"

Vue.config.productionTip = false;
// Vue.use(canvasJs)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
