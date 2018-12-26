import Vue from 'vue'
import App from './App'
import store from '@/store'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      'pages/list/main',
      '^pages/index/main',
      'pages/detail/main',
      'pages/my/main',
      'pages/prevue/main'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#1c2635',
      navigationBarTitleText: '我看电影',
      navigationBarTextStyle: 'white',
      backgroundColor: '#f6f6f6'
    },
    tabBar: {
      color: '#999',
      selectedColor: '#1c2635',
      backgroundColor: '#fff',
      borderStyle: 'white',
      list: [
        {
          pagePath: 'pages/index/main',
          text: '',
          iconPath: '/static/image/movie.png',
          selectedIconPath: '/static/image/movie_active.png'
        },
        {
          pagePath: 'pages/my/main',
          text: '',
          iconPath: '/static/image/wode.png',
          selectedIconPath: '/static/image/wode_active.png'
        }
      ]
    }
  }
}
