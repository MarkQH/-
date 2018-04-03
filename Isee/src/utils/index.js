import wx from 'wx'
import CONFIG from './const'

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function getDetailPage (lid, mid) {
  wx.navigateTo({
    url: '/pages/detail/main?' + 'locationId=' + lid + '&' + 'movieId=' + mid,
    fail: function () {
      wx.navigateBack()
      wx.showToast({
        title: 'Ohs!出了些问题',
        icon: 'error'
      })
    }
  })
}

export function getListPage (type) {
  if (type === 'h') {
    wx.navigateTo({url: '/pages/list/main?' + 'type=' + type})
  } else {
    wx.navigateTo({url: '/pages/list/main?' + 'type=' + type})
  }
}
/* 数据是否过期 */
export function isPastDue () {
  if (!storage(CONFIG.CITY_ID)) {
    return true
  } else {
    let timestamp = storage(CONFIG.TIMESTAMP).data
    let date = new Date()
    date.setHours(0)
    date.setMinutes(0)
    date.setSeconds(0)
    let todayMs = parseInt(date.getTime() / 1000)
    if ((todayMs - timestamp) >= 86400) {
      wx.removeStorageSync(CONFIG.CITY_ID)
      wx.removeStorageSync(CONFIG.HOT)
      wx.removeStorageSync(CONFIG.COME_ATTENT)
      wx.removeStorageSync(CONFIG.COME_COMINGS)
      return true
    } else {
      storage(CONFIG.TIMESTAMP, todayMs)
      return false
    }
  }
}

/* 存取数据 */
export function storage (name, data, movieId = 'data') {
  if (arguments.length === 1) {
    return wx.getStorageSync(name)
  } else {
    let cache = wx.getStorageSync(name)
    if (!cache) {
      let arr = {}
      arr[movieId] = data
      let updata = Object.assign({}, arr)
      wx.setStorage({
        key: name,
        data: updata
      })
    } else {
      cache[movieId] = data
      wx.setStorage({
        key: name,
        data: cache
      })
    }
  }
}
/* 删除数据 */
export function deleteStorage (name, movieId = 'data') {
  let data = wx.getStorageSync(name)
  delete data[movieId]
  wx.setStorageSync(name, data)
}
/* 查看预告片 */
export function seeProvue (name, movies) {
  let movieString = JSON.stringify(movies)
  wx.navigateTo({
    url: '/pages/prevue/main?name=' + name + '&' + 'movies=' + movieString
  })
}
/* 回到顶部 */
export function goTop () {
  wx.pageScrollTo({
    scrollTop: 0,
    duration: 300
  })
}
/* 显示loading */
export function loading () {
  wx.showLoading({
    title: '正在加载...'
  })
  let timeOut = setTimeout(() => {
    wx.hideLoading()
    clearTimeout(timeOut)
  }, 1000)
}
