<template>
  <div class="container">
    <div class="header">
      <img @click="con" class="logo" src="/static/image/logo_h.png" alt="">
      <span class="city">{{city_name}}</span>
    </div>
    <div class="h-movie">
      <div class="h-more clearfix">
        <i class="title inb fd-l">正在热映{{hotNum}}部</i>
        <i @click="getMovieList('h')" class="more-tip inb fd-r"><img src="/static/image/more.png" alt=""></i>
      </div>
      <div class="h-recomment">
        <ul class="h-ui">
          <li class="h-li" v-for="item in hotMovies" :key="item.id" @click="getMovieDetail(item.id)">
            <div class="h-img">
              <img src="/static/image/load_img.png" alt="" v-if="isLoading">
              <img class="fade-in" :src="item.img" :alt="item.commonSpecial" v-show="!isLoading" @load="isLoaded()">
            </div>
            <div class="h-text">{{item.tCn}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div class="c-movie">
      <div class="c-title">即将上映 <span class="c-num">{{commingNum}}</span>部
        <i @click="getMovieList('c')" class="more-tip inb fd-r"><img src="/static/image/more.png" alt=""></i>
      </div>
      <swiper class="c-warp" indicator-dots indicator-color indicator-active-color="#1c2635">
        <block v-for="(item, index) in attentMovie" :key="index">
          <swiper-item class="c-item" @click="getMovieDetail(item.id)">
            <img src="/static/image/load_img.png" alt="" v-if="isLoading">
            <image :src="item.image" class="slide-image fade-in" v-show="!isLoading" @load="isLoaded()"/>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="first-screen" v-if="openFirstScreen">
      <div class="wrap">
        <div class="img"><img src="/static/image/logo_red.png" alt=""></div>
        <div class="txt">为你提供最新影讯</div>
      </div>
    </div>
  </div>
</template>

<script>

import { mapState, mapActions } from 'vuex'
import api from '@/utils/api'
import { getDetailPage, getListPage, storage, isPastDue } from '@/utils/index'
import CONFIG from '@/utils/const'

export default {
  data () {
    return {
      hotMovies: {},
      hotNum: '',
      attentMovie: {},
      addentNum: '',
      commingNum: '',
      city_id: '',
      city_name: '',
      isLoading: false,
      openFirstScreen: false
    }
  },
  watch: {
    cityId: function () {
      this.city_id = this.cityId
      this.city_name = this.cityName
      this.getHotMovie(this.city_id)
      this.getCommingMovie(this.city_id)
    }
  },
  computed: {
    ...mapState(['cityId', 'cityName', 'userInfo'])
  },
  methods: {
    ...mapActions(['getUserInfo', 'getCityId']),

    showFirstScreen () {
      if (isPastDue()) {
        this.openFirstScreen = true
        setTimeout(() => {
          this.openFirstScreen = false
        }, 3000)
      }
    },

    isLoaded () {
      this.isLoading = false
    },
    getMovieDetail (id) {
      let lid = this.cityId
      getDetailPage(lid, id)
    },
    getMovieList (type) {
      getListPage(type)
    },
    async getHotMovie (id) {
      let hotObj = await api.getHotMovie(id)
      this.hotMovies = hotObj.ms.slice(0, 6)
      this.hotNum = hotObj.ms.length
      storage(CONFIG.HOT, hotObj.ms)
    },
    async getCommingMovie (id) {
      let comObj = await api.getCommingMovie(id)
      this.attentMovie = comObj.attention
      this.commingNum = comObj.moviecomings.length
      storage(CONFIG.COME_COMINGS, comObj.moviecomings)
      storage(CONFIG.COME_ATTENT, comObj.attention)
    },
    async getData () {
      this.isLoading = true
      if (!isPastDue()) {
        this.city_id = storage(CONFIG.CITY_ID).data
        this.city_name = storage(CONFIG.CITY_NAME).data
        this.hotMovies = storage(CONFIG.HOT).data.slice(0, 6)
        this.hotNum = storage(CONFIG.HOT).data.length
        this.attentMovie = storage(CONFIG.COME_ATTENT).data
        this.addentNum = storage(CONFIG.COME_ATTENT).data.length
        this.commingNum = storage(CONFIG.COME_COMINGS).data.length
      } else {
        await Promise.all([
          this.getUserInfo(),
          this.getCityId()
        ])
      }
    }
  },
  mounted () {
    this.showFirstScreen()
    this.getData()
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/style.scss";
.header {
  background-color: $primary-color;
  height: 70rpx;
  padding: 10rpx 20rpx;
  .logo {
    width: 160rpx;
    height: 80rpx;
  }
  .city {
    position: relative;
    height: 40rpx;
    color: #fff;
    margin-left: 20rpx;
    bottom: 24rpx;
  }
}
.h-movie{
  @include content-padding;
  .h-more {
    font-size: 40rpx;
    margin-bottom: 20rpx;
    @include vertical-center($value: 80rpx);
    .more-tip{
      position: relative;
      top: 8rpx;
    }
  }
  .h-recomment{
    width: 100%;
    .h-ui{
      display: flex;
      @include Lateral-uniform;
      .h-li{
        width: 210rpx;
        img{
          height: 280rpx;
        }
        .h-text{
          text-align: center;
          height: 100rpx;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
  }
}
.c-movie{
  @include content-padding;
  .c-title{
    font-size: 40rpx;
    margin-bottom: 20rpx;
    @include vertical-center($value: 80rpx);
    .more-tip{
      position: relative;
      top: 10rpx;
    }
  }
  .c-warp{
    height: 1000rpx;
    .c-item{
      margin-right: 30rpx;
      .slide-image{
        width: 670rpx;
        height: 946rpx;
      }
    }
  }
}
.first-screen{
  position: absolute;
  width: 100%;
  height: 100%;
  z-index:1000;
  background-color: #fff;
  .wrap{
    position: absolute;
    width: 320rpx;
    height: 360rpx;
    margin-top: -160rpx;
    margin-left: -160rpx;
    top:40%;
    left:50%;
    .img{
      width: 280rpx;
      height: 320rpx;
      text-align: center;
      margin-left: 20rpx;
    }
    .txt{
      font-size: 40rpx;
      text-align: center;
      color: #ff283c;
    }
  }
}
</style>
