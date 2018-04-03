<template>
  <div class="container">
    <div class="prevue-name">{{prevueName}}<span>-预告片</span></div>
    <div class="prevue-list">
      <ul>
        <li class="prevue-li" v-for="item in prevueList" :key="item.videoId">
          <div class="img" v-show="playIndex !== item.videoId">
            <img class="btn" src="/static/image/play.png" alt="播放" @click="playVedio(item.videoId)">
            <img src="/static/image/load_img.png" alt="" v-if="loading">
            <img class="poster fade-in" :src="item.image" :alt="item.title" v-show="!loading" @load="isLoaded()">
          </div>
          <video :poster="item.image" :id="item.videoId" class="video" :src="item.url" direction='90' v-show="playIndex == item.videoId"></video>
          <div class="text">{{item.title}}</div>
          <div class="cin-line">
            <div class="p"></div>
            <div class="p"></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { loading } from '@/utils/index'
export default {
  data () {
    return {
      loading: false,
      prevueName: '',
      prevueList: [],
      playIndex: null,
      targetVideo: null,
      showBtn: false
    }
  },
  onUnload () {
    this.prevueName = ''
    this.prevueList = []
    this.playIndex = null
    this.targetVideo = null
    this.showBtn = false
  },
  methods: {
    isLoaded () {
      this.loading = false
    },
    playVedio (movieid) {
      this.playIndex = movieid
      let id = movieid.toString()
      this.targetVideo = wx.createVideoContext(id)
      this.targetVideo.play()
    }
  },
  mounted () {
    this.loading = true
    loading()
    this.showBtn = false
    this.prevueName = this.$root.$mp.query.name
    this.prevueList = JSON.parse(this.$root.$mp.query.movies)
  }
}
</script>

<style lang="scss" scoped>
@import '~@/styles/style.scss';
.mask{@include mask;}
.prevue-name{
  @include vertical-center(80rpx);
  background-color: $primary-color;
  height: 80rpx;
  padding: 10rpx 20rpx;
  font-size: 40rpx;
  color: #f1f1f1;
}
.prevue-list{
  padding: 10rpx 20rpx;
  margin-top: 60rpx;
  .prevue-li{
    margin-bottom: 50rpx;
    border-bottom: 1px solid #999;
    position: relative;
    height: 500rpx;
    .img{
      width: 710rpx;
      height: 399rpx;
      position: absolute;
      left: 0;
      top: 0;
      overflow: hidden;
      z-index:2;
      .btn{
        position: absolute;
        left:50%;
        top:50%;
        width: 100rpx;
        height: 100rpx;
        margin-left: -50rpx;
        margin-top: -50rpx;
        z-index: 1;
      }
    }
    .video{
      width: 710rpx;
      height: 399rpx;
    }
    .text{
      margin-top: 40rpx;
      font-size: 36rpx;
      position: absolute;
      width: 100%;
      bottom : 20rpx;
      @include t-ellipsis;
    }
  }
}

</style>