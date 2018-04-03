<template>
  <div class="container">
    <div class="title">
      我想看
    </div>
    <div class="list" v-if="listLength>0">
      <ul>
        <li class="li clearfix" @click="goToDetail(item.cityId, item.movieId)" v-for="item in myList" :key="item.movieId">
          <div class="pic">
            <img :src="item.movieImg" :alt="item.cnName" @load="isLoaded()">
          </div>
          <div class="txt">
            <div class="name">
              {{item.cnName}}
            </div>
            <div class="tip">
              <span>{{item.runTime}}</span>
              <span v-if="item.fen>0">评分：{{item.fen}}</span>
            </div>
          </div>
          <div class="cin-line">
            <div class="p"></div>
            <div class="p"></div>
          </div>
          <div class="remove" @click="remove(item.movieId)">
            <img src="/static/image/remove.png" alt="">
          </div>
        </li>
      </ul>
    </div>
    <div class="none" v-else>
      <div class="word">
        你还未收录电影...
      </div>
      <div class="icon">
        <img src="/static/image/logo.png" alt="">
      </div>
    </div>
  </div>
</template>

<script>
import {getDetailPage, storage, deleteStorage, loading} from '@/utils/index'
import CONFIG from '@/utils/const'
export default {
  data () {
    return {
      isLoading: false,
      myList: null,
      listLength: Number
    }
  },
  methods: {
    isLoaded () {
      this.isLoading = false
    },
    goToDetail (lid, mid) {
      getDetailPage(lid, mid)
    },
    getMyList () {
      loading()
      this.isLoading = true
      this.myList = storage(CONFIG.WTS)
      let arr = []
      for (let i in this.myList) {
        arr.push(this.myList[i])
      }
      this.listLength = arr.length
    },
    remove (movieid) {
      deleteStorage(CONFIG.WTS, movieid)
      this.myList = storage(CONFIG.WTS)
      let arr = []
      for (let i in this.myList) {
        arr.push(this.myList[i])
      }
      this.listLength = arr.length
    }
  },
  onShow () {
    this.getMyList()
  }
}

</script>
<style lang="scss" scoped>
@import "~@/styles/style.scss";
.title{
  @include vertical-center(80rpx);
  background-color: $primary-color;
  text-indent: 30rpx;
  font-size: 40rpx;
  color: #f1f1f1;
}
.list{
  .li{
    height: 300rpx;
    padding: 30rpx 20rpx 0 20rpx;
    position: relative;
    .pic{
      float: left;
      height: 250rpx;
      width: 170rpx;
    }
    .txt{
      overflow: hidden;
      height: 250rpx;
      padding-left: 30rpx;
      margin-bottom: 20rpx;
      .name{
        font-size: 40rpx;
        font-weight: bold;
        @include t-ellipsis;
        margin-bottom: 28rpx;
      }
      .tip{
        span{
          margin-right: 20rpx;
          font-size: 32rpx;
        }
      }
    }
    .remove{
      width: 48rpx;
      height: 48rpx;
      position: absolute;
      right:20rpx;
      top:20rpx;
    }
  }
}
.none{
  width: 100%;
  height: 100%;
  position: absolute;
  .word{
    margin-top: 100rpx;
    padding-left: 30rpx;
    font-size: 36rpx;
  }
  .icon{
    width:300rpx;
    height: 300rpx;
    position: absolute;
    left:50%;
    top:50%;
    margin-left: -150rpx;
    margin-top: -150rpx;
  }
}
</style>
