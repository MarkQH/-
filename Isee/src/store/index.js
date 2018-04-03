// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import wx from 'wx'
import api from '@/utils/api'
import { storage } from '@/utils/index'
import CONFIG from '@/utils/const'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    cityId: null,
    cityName: '',
    userInfo: {}
  },
  mutations: {
    cityId: (state, data) => {
      state.cityId = data
    },
    cityName: (state, data) => {
      state.cityName = data
    },
    userInfo: (state, data) => {
      state.userInfo = data
    }
  },
  actions: {
    async getCityId ({ commit, state }) {
      wx.getLocation({
        type: 'wgs84',
        success: async (res) => {
          let cityObj = await api.getCity(res.latitude, res.longitude)
          let cityArr = await api.getLocation()
          let cities = JSON.parse(cityObj).result.addressComponent.city
          let city = cities.substr(0, cities.length - 1)
          commit('cityName', city)
          storage(CONFIG.CITY_NAME, city)
          let cityArrs = cityArr.p
          let index = cityArrs.findIndex(function (value, index, arr) {
            return value.n === city
          })
          let cityid = cityArrs[index].id
          commit('cityId', cityid)
          storage(CONFIG.CITY_ID, cityid)
        }
      })
    },
    async getUserInfo ({ commit }) {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              commit('userInfo', res.userInfo)
            }
          })
        }
      })
    }
  }
})

export default store
