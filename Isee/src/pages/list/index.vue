<template>
  <div class="container">
    <div class="head">
      <div class="btn-bg">
        <span @click="toggle('hot')" class="tab-btn" :class="{active: isHot}">正在热映</span>
        <span @click="toggle('come')" class="tab-btn" :class="{active: !isHot}">即将上映</span>
      </div>
    </div>
    <div class="list-wrap">
      <div v-if="isHot" class="hot-list">
        <ul>
          <li class="hot-li clearfix" v-for="item in hotMovie" :key="item.id" @click="getDetail(cityId, item.id)">
            <div class="hot-img fd-l">
              <img src="/static/image/load_img.png" alt="" v-if="isLoading">
              <img :src="item.img" :alt="item.tCn" v-show="!isLoading" @load="isLoaded()">
            </div>
            <div class="hot-text">
              <div class="mv-name">
                <span class="t">{{item.tCn}}</span>
              </div>
              <div v-if="item.is3D||item.isDMAX||item.isIMAX" class="mv-tip">
                <span v-if="item.is3D" class="t">3D</span>
                <span v-if="item.isDMAX" class="t">巨幕</span>
                <span v-if="item.isIMAX" class="t">Imax</span>
              </div>
              <div class="mv-text">{{item.commonSpecial}}</div>
              <div class="mv-kind">{{item.movieType}}</div>
              <div class="mv-actors"><span>导演：{{item.dN}}</span><span>主演：{{item.actors}}</span></div>
              <div class="mv-grade">
                <span class="gra" v-if="item.r>1">评分：{{item.r}}</span>
                <span class="btn">详情</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div v-if="!isHot" class="come-list">
        <div class="attention">
          <div class="a-head">
            最受关注
            <span v-if="attentMovie.length">{{attentMovie.length}}部</span>
          </div>
          <div class="a-swiper">
            <scroll-view class="a-wrap" scroll-x>
              <div class="a-box" v-for="item in attentMovie" :key="item.id">
                <div class="a-cont clearfix">
                  <div class="a-date">{{item.rMonth}}月{{item.rDay}}日</div>
                  <div class="a-img">
                    <img src="/static/image/load_img.png" alt="" v-if="isLoading">
                    <img class="fade-in" :src="item.image" v-show="!isLoading" @load="isLoaded()"/>
                  </div>
                  <div class="a-text">
                    <div class="a-name">{{item.title}}</div>
                    <div class="a-type"><span class="w-num">{{item.wantedCount}}</span>人想看-{{item.type}}</div>
                    <div class="a-actor" v-if="item.director || item.actor1">
                      <span>导演：{{item.director}}</span>
                      <span v-if="item.actor1">演员：{{item.actor1}},{{item.actor2}}</span>
                    </div>
                    <div class="a-btn">
                      <span class="detail" @click="getDetail(cityId, item.id)">详情</span>
                      <span class="prevue" @click="moviePrevue(item.title, item.videos)" v-if="item.isVideo">预告片</span>
                    </div>
                  </div>
                </div>
              </div>
            </scroll-view>
          </div>
        </div>
        <div class="comming">
          <div class="a-head">即将上映<span v-if="comingMovie.length">{{comingMovie.length}}部</span></div>
          <div class="come-ul">
            <ul>
              <li class="come-li" v-for="(item,index) in comingMovie" :key="item.id">
                <div class="month" v-if="index === 0 || comingMovie[index].rMonth !== comingMovie[index-1].rMonth">{{item.rMonth}}月</div>
                <div class="come-box clearfix">
                  <div class="day">{{item.rDay}}日</div>
                  <div class="come-txt" :class="{last : index == comingMovie.length-1 || comingMovie[index].rMonth == comingMovie[index+1].rMonth}">
                    <div class="img">
                      <img src="/static/image/load_img.png" alt="" v-if="isLoading">
                      <img class="fade-in" :src="item.image" :alt="item.title" v-show="!isLoading" @load="isLoaded()">
                    </div>
                    <div class="text">
                      <div class="title">{{item.title}}</div>
                      <div class="type">
                        <span class="want">{{item.wantedCount}}</span>人想看-
                        <span class="kind">{{item.type}}</span>
                      </div>
                      <div class="dir" v-if="item.director || item.actor1">
                        <span>导演：{{item.director}}</span>
                        <span v-if="item.actor1">演员：{{item.actor1}},{{item.actor2}}</span>
                      </div>
                      <div class="btn">
                        <span class="detail"  @click="getDetail(cityId, item.id)">详情</span>
                        <span class="prevue" @click="moviePrevue(item.title, item.videos)" v-if="item.isVideo">预告片</span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from '@/components/card'
import {mapState} from 'vuex'
import CONFIG from '@/utils/const'
import { storage, seeProvue, goTop, getDetailPage, loading, isPastDue } from '@/utils/index'
import api from '@/utils/api'

export default {
  components: {
    card
  },
  computed: {
    ...mapState(['cityId'])
  },
  data () {
    return {
      isLoading: false,
      isHot: true,
      hotMovie: {},
      comingMovie: {},
      attentMovie: {}
    }
  },
  methods: {
    isLoaded () {
      this.isLoading = false
    },
    toggle (type) {
      if (type === 'hot') this.isHot = true
      else this.isHot = false
      goTop()
    },
    moviePrevue (name, movies) {
      seeProvue(name, movies)
    },
    getDetail (lid, mid) {
      getDetailPage(lid, mid)
    },
    async getHotList () {
      if (!isPastDue()) {
        this.hotMovie = storage(CONFIG.HOT).data
      } else {
        let hotObj = await api.getHotMovie(this.cityId)
        this.hotMovie = hotObj.ms
        storage(CONFIG.HOT, hotObj.ms)
      }
    },
    async getComeList () {
      if (!isPastDue()) {
        this.comingMovie = storage(CONFIG.COME_COMINGS).data
        this.attentMovie = storage(CONFIG.COME_ATTENT).data
      } else {
        let comeObj = await api.getCommingMovie(this.cityId)
        this.comingMovie = comeObj.moviecomings
        this.attentMovie = comeObj.attention
        storage(CONFIG.COME_COMINGS, comeObj.moviecomings)
        storage(CONFIG.COME_ATTENT, comeObj.attention)
      }
    },
    async init () {
      this.isLoading = true
      loading()
      if (this.$root.$mp.query.type === 'h') {
        this.isHot = true
      } else {
        this.isHot = false
      }
      await Promise.all([
        this.getHotList(),
        this.getComeList()
      ])
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/style.scss";
.head{
  background-color: $primary-color;
  text-align: center;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  @include vertical-center(80rpx);
  .btn-bg{
    background-color: #0d121a;
    width: 90%;
    display: flex;
    height: 60rpx;
    justify-content: center;
    align-items: center;
    margin-left: 5%;
    border-radius: 60rpx;
    padding: 0 6rpx;
    .tab-btn{
      color: #999;
      background-color: #0d121a;
      width: 50%;
      font-size: 28rpx;
      display: inline-block;
      height: 50rpx;
      line-height: 50rpx;
      border-radius: 50rpx;
    }
    .tab-btn.active{
      color: #f1f1f1;
      background-color: $primary-color;
    }
  }
}
.list-wrap{
  margin-top: 80rpx;
  .hot-li{
    padding: 16rpx 20rpx;
    border-bottom: 6rpx solid #f5f5f5;
    .hot-img{
      width: 230rpx;
      height: 340rpx;
    }
    .hot-text{
      overflow: hidden;
      padding-left: 20rpx;
      height: 340rpx;
      padding-top: 20rpx;
      position: relative;
      .mv-name{
        .t{
          @include t-ellipsis;
          font-size:40rpx;
          color:#333;
          font-weight:bold;
          display: inline-block;
        }
        .c{
          margin-left:20rpx;
          color:#659d0e;
          font-size:30rpx;
          float: right;
          margin: 10rpx 20rpx 0 0
        }
      }
      .mv-tip{
        margin: 10rpx 0;
        .t{
          padding: 6rpx 20rpx;
          border: 1px solid #659d0e;
          border-radius: 6rpx;
          font-size: 20rpx;
          color: #659d0e;
          margin-right: 10rpx;
          display: inline;
        }
      }
      .mv-text{
        color: #659d0e;
        font-size: 34rpx;
        margin:20rpx 0;
        @include c-ellipsis;
      }
      .mv-kind{
        color: #659d0e;
        font-size: 30rpx;
        margin: 10rpx 0;
      }
      .mv-actors{
        font-size: 24rpx;
        color: #999999;
        margin: 20rpx 0;
        @include t-ellipsis;
        span{
          margin-right: 10rpx;
        }
      }
      .mv-grade{
        position: absolute;
        bottom:10rpx;
        width: 90%;
        .gra{
          font-size: 30rpx;
          color: #659d0e;
          float: left;
        }
        .btn{
          float: right;
          padding: 10rpx 30rpx;
          border-radius: 30rpx;
          background-color: #ff8600;
          font-size: 30rpx;
          color: #f5f5f5;
          position: relative;
          bottom: 10rpx;
        }
      }
    }
  }
  .come-list{
    padding: 16rpx 20rpx;
    .a-head{
      font-size: 40rpx;
      font-weight: bold;
      padding: 20rpx 0;
      margin-bottom: 20rpx;
      span{
        color: #999999;
        margin-left: 10rpx;
      }
    }
    .a-wrap{
      height: 402rpx;
      width: 100%;
      white-space: nowrap;
      .a-box{
        width: 95%;
        display: inline-block;
        margin-right: 20rpx;
        padding-top:40rpx;
        padding-right:20rpx;
        .a-cont{
          position: relative;
          border-top:1px solid #ddd;
          border-right:1px solid #ddd;
          padding-top:40rpx;
          .a-img{
            width: 200rpx;
            height: 295rpx;
            float: left;
          }
          .a-text{
            overflow: hidden;
            padding-left: 20rpx;
            padding-top: 10rpx;
            position: relative;
            height: 300rpx;
            div{
              margin-bottom: 10rpx;
            }
            .a-name{
              font-size: 40rpx;
              font-weight: bold;
            }
            .a-type{
              font-size: 28rpx;
              .w-num{
                color: #ff8600;
              }
            }
            .a-actor{
              @include t-ellipsis;
              font-size: 28rpx;
              span{
                margin-right: 20rpx;
              }
            }
            .a-btn{
              position: absolute;
              width: 100%;
              bottom: 30rpx;
              span{
                padding: 20rpx 30rpx;
                border-radius: 30rpx;
                font-size: 40rpx;
                margin-right: 30rpx;
              }
              .detail{
                background-color: #ff8600;
                color: #f1f1f1;
              }
              .prevue{
                border: 1px solid #659d0e;
                color: #659d0e;
              }
            }
          }
          .a-date{
            position: absolute;
            display: inline-block;
            background-color: #fff;
            padding: 10rpx 40rpx;
            top: -30rpx;
            font-size: 28rpx;
            color: #999;
          }
        }
      }
    }
    .come-li{
      height: 400rpx;
      .month{
        border-bottom: 1px solid #999;
        padding-bottom: 20rpx;
        font-size: 34rpx;
      }
      .come-box{
        padding-top: 20rpx;
        .day{
          color: #999;
          font-size: 30rpx;
          width: 80rpx;
          float: left;
        }
        .come-txt{
          overflow: hidden;
          padding-bottom: 30rpx;
        }
        .come-txt.last{
          border-bottom: 1px solid #999;
        }
        .img{
          width: 160rpx;
          height: 240rpx;
          float: left;
        }
        .text{
          overflow: hidden;
          padding-left: 20rpx;
          position: relative;
          height: 260rpx;
          div{
            margin-bottom: 20rpx;
          }
          .title{
            font-size: 34rpx;
            font-weight: bold;
          }
          .type{
            font-size: 28rpx;
            .want{
              color: #ff8600;
            }
          }
          .dir{
            font-size: 28rpx;
            @include t-ellipsis;
            span{
              margin-right: 20rpx;
            }
          }
          .btn{
            position: absolute;
            width: 100%;
            bottom: 0rpx;
            span{
              padding: 12rpx 30rpx;
              border-radius: 30rpx;
              font-size: 34rpx;
              margin-right: 30rpx;
            }
            .detail{
              background-color: #ff8600;
              color: #f1f1f1;
            }
            .prevue{
              border: 1px solid #659d0e;
              color: #659d0e;
            }
          }
        }
      }
    }
  }
}
</style>
