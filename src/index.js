
import Vue from 'vue'
// import { GridLayout, GridItem } from 'vue-grid-layout'
import App from './App.vue'
import './assets/main.less'
const rootApp = new Vue({
  el: '#app',
  render(h){
    return h(App)
  }
})