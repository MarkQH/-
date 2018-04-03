<template>
  <div class="container">
    <div class="blur">
      <img class="curve" mode="aspectFit" src="/static/image/cinemainfo_bg.png" alt="曲线">
      <img class="bg-blur" mode="aspectFill" :src="d.movieImage" alt="movieName"> 
    </div>
    <div class="article clearfix">
      <div class="cinema-pic">
        <img src="/static/image/load_img.png" alt="" v-if="isLoading">
        <img class="c-pic fade-in" :src="d.movieImage" alt="movieName" v-show="!isLoading" @load="isLoaded()">
      </div>
      <div class="cinema-txt">
        <div class="cn-name">{{d.cnName}}</div>
        <div class="en-name">{{d.enName}}</div>
        <div class="run-time">{{d.runTime}}</div>
        <div class="type">{{d.type}}</div>
        <div class="release">
          <span>{{d.date}}</span>
          <span>{{d.country}}</span>
          <span>上映</span>
        </div>
        <div @click="moviePrevue(d.cnName, video)" class="btn">
          <span>预告片</span>
        </div>
        <span class="score" v-if="d.rating > 0">{{d.rating}}</span>
      </div>
    </div>
    <div class="summarize">
      <div class="txt">{{d.summarize}}</div>
      <div class="btn" @click="wantToSee(movieId)">我想看</div>
    </div>
    <div class="cin-line">
      <div class="p"></div>
      <div class="p"></div>
    </div>
    <div class="plotRegion">
      <div class="txt" :class="{more: isMore}">{{d.plotRegion}}</div>
      <div class="btn">
        <img @click="readMore()" v-show="!isMore" src="/static/image/down.png" alt="展开">
        <img @click="readMore()" v-show="isMore" src="/static/image/up.png" alt="收起">
      </div>
    </div>
    <div class="cin-line">
      <div class="p"></div>
      <div class="p"></div>
    </div>
    <div class="menbers clearfix">
      <div class="director">
        <div class="zi">导演</div>
        <div class="d-box">
          <img src="/static/image/load_img.png" alt="" v-if="isLoading">
          <img class="fade-in" mode="aspectFill" :src="d.director.directorImg" alt="" v-show="!isLoading" @load="isLoaded()">
          <div class="name">{{d.director.directorName}}</div>
          <div class="name">{{d.director.directorNameEn}}</div>
        </div>
      </div>
      <div class="actors">
        <div class="zi">主要演员</div>
        <div class="wrap clearfix">
          <div class="a-box">
            <div class="real">
              <img src="/static/image/load_img.png" alt="" v-if="isLoading">
              <img mode="aspectFill" :src="d.actorOne.actorImg" alt="演员" v-show="!isLoading" @load="isLoaded()">
              <div class="real-name-cn">{{d.actorOne.actor}}</div>
              <div class="real-name-en">{{d.actorOne.actorEn}}</div>
            </div>
            <div class="role">
              <img src="/static/image/load_img.png" alt="" v-if="isLoading">
              <img :src="d.actorOne.roleImg" alt="演员" v-if="d.actorTwo.roleImg" v-show="!isLoading" @load="isLoaded()">
              <div class="role-name">饰：{{d.actorOne.roleName}}</div>
            </div>
          </div>
          <div class="a-box left">
            <div class="real">
              <img src="/static/image/load_img.png" alt="" v-if="isLoading">
              <img mode="aspectFill" :src="d.actorTwo.actorImg" alt="演员" v-show="!isLoading" @load="isLoaded()">
              <div class="real-name-cn">{{d.actorTwo.actor}}</div>
              <div class="real-name-en">{{d.actorTwo.actorEn}}</div>
            </div>
            <div class="role">
              <img src="/static/image/load_img.png" alt="" v-if="isLoading">
              <img :src="d.actorTwo.roleImg" alt="演员" v-if="d.actorTwo.roleImg" v-show="!isLoading" @load="isLoaded()">
              <div class="role-name">饰：{{d.actorTwo.roleName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="cin-line">
      <div class="p"></div>
      <div class="p"></div>
    </div>
    <div class="images">
      <div class="biao">图片</div>
      <swiper class="sw" indicator-dots indicator-color indicator-active-color="#1c2635">
        <block v-for="(item, index) in d.images" :key="index">
          <swiper-item>
            <image mode="aspectFit" :src="item" class="slide-image"/>
          </swiper-item>
        </block>
      </swiper>
    </div>
  </div>
</template>

<script>
import api from '@/utils/api'
import { storage, seeProvue, loading } from '@/utils/index'
import CONFIG from '@/utils/const'
export default {

  data () {
    return {
      isLoading: false,
      cityId: null,
      movieId: null,
      isMore: false,
      video: [],
      d: {
        movieImage: '',
        cnName: '',
        enName: '',
        runTime: '',
        type: '',
        date: '',
        country: '',
        rating: '',
        summarize: '',
        plotRegion: '',
        director: '',
        actorList: [],
        actorOne: {},
        actorTwo: {},
        images: []
      }
    }
  },

  methods: {
    isLoaded () {
      this.isLoading = false
    },
    async getDetai () {
      loading()
      this.cityId = this.$root.$mp.query.locationId
      this.movieId = this.$root.$mp.query.movieId
      let detailString = await api.getMovieDetail(this.movieId, this.cityId)
      let detailObj = JSON.parse(detailString)
      this.d.movieImage = detailObj.image
      this.d.cnName = detailObj.titleCn
      this.d.enName = detailObj.titleEn
      this.d.runTime = detailObj.runTime
      this.d.type = detailObj.type.join('/')
      this.d.date = detailObj.release.date
      this.d.country = detailObj.release.location
      this.d.rating = detailObj.rating
      this.d.summarize = detailObj.commonSpecial
      this.d.plotRegion = detailObj.content
      this.d.director = detailObj.director
      this.d.actorOne = detailObj.actorList[0]
      this.d.actorTwo = detailObj.actorList[1]
      this.d.images = detailObj.images
      this.video = detailObj.videos
    },
    readMore () {
      this.isMore = !this.isMore
    },
    moviePrevue (name, movies) {
      seeProvue(name, movies)
    },
    wantToSee (movieId) {
      let data = {
        movieId: this.movieId,
        cityId: this.cityId,
        movieImg: this.d.movieImage,
        cnName: this.d.cnName,
        runTime: this.d.runTime,
        fen: this.d.rating
      }
      let name = CONFIG.WTS
      storage(name, data, movieId)
      wx.showToast({
        title: '已标记',
        icon: 'none'
      })
    }
  },

  mounted () {
    this.isLoading = true
    this.getDetai()
  },

  onUnload () {
    this.cityId = null
    this.movieId = null
    this.isMore = false
    this.video = []
    this.d = {
      movieImage: '',
      cnName: '',
      enName: '',
      runTime: '',
      type: '',
      date: '',
      country: '',
      rating: '',
      summarize: '',
      plotRegion: '',
      director: '',
      actorList: [],
      actorOne: {},
      actorTwo: {},
      images: []
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@/styles/style.scss";
.blur{
  height: 320rpx;
  width: 100%;
  overflow: hidden;
  position: relative;
  .bg-blur{
    width: 100%;
    height: 320rpx;
    -webkit-filter: blur(12px);
  }
  .curve{
    height: 50rpx;
    width: 100%;
    position: absolute;
    bottom: -10rpx;
    z-index: 1;
  }
}
.article{
  height: 360rpx;
  padding:0 30rpx;
  margin-top: -160rpx;
  position: relative;
  z-index: 2;
  .cinema-pic{
    height: 360rpx;
    width: 250rpx;
    border:4rpx solid #f1f1f1;
    float: left;
  }
  .cinema-txt{
    overflow: hidden;
    height: 360rpx;
    padding-left: 26rpx;
    padding-top: 16rpx;
    .cn-name{
      font-size: 46rpx;
      font-weight: bold;
      color: #f1f1f1;
      @include t-ellipsis;
    }
    .en-name{
      color: #f1f1f1;
      font-size: 30rpx;
      @include t-ellipsis;
      margin-bottom: 10rpx;
    }
    .run-time{
      margin-top: 60rpx;
      @include t-ellipsis;
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    .type{
      @include t-ellipsis;
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    .release{
      @include t-ellipsis;
      font-size: 30rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    .btn{
      margin-top: 20rpx;
      span{
        padding: 10rpx 40rpx;
        border:1px solid #659d0e;
        color: #659d0e;
        font-size: 34rpx;
        border-radius: 40rpx;
      }
    }
    .score{
      padding: 6rpx 10rpx;
      background-color: #659d0e;
      color: #f1f1f1;
      position: absolute;
      right:40rpx;
      bottom: 190rpx;
      font-size: 40rpx;
    }
  }
}
.summarize{
  padding: 20rpx 30rpx;
  .txt{
    color: #fd8900;
    font-size: 40rpx;
    text-align: center;
    margin-bottom: 30rpx;
    @include t-ellipsis;
  }
  .btn{
    background-color: #fd8900;
    color: #f1f1f1;
    border-radius: 80rpx;
    text-align: center;
    font-weight: bold;
    font-size: 44rpx;
    letter-spacing: 4rpx;
    @include vertical-center(80rpx);
  }
}
.cin-line{
  .p:first-child{
    height: 12rpx;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 0.2em 0.2em rgba(51,51,51,0.05);
    position: relative;
    z-index: 1;
  }
  .p:last-child{
    height: 30rpx;
    background: #f6f6f6;
    position: relative;
    z-index: 0;
  }
}
.plotRegion{
  padding: 20rpx 30rpx 20rpx 30rpx;
  .txt{
    @include c-ellipsis;
    font-size: 36rpx;
    letter-spacing: 3rpx;
    line-height: 40rpx;
    text-align: justify;
  }
  .txt.more{
    height: auto;
    display: inherit;
    overflow: auto;
  }
  .btn{
    margin-top: 20rpx;
    text-align: center;
    img{
      width: 48rpx;
      height: 48rpx;
    }
  }
}
.menbers{
  padding: 20rpx 30rpx;
  .director{
    float: left;
    width: 200rpx;
    padding-right: 18rpx;
    border-right: 1px solid #dddddd;
    height: 590rpx;
    .zi{
      height: 50rpx;
      font-size: 30rpx;
    }
    .d-box{
      width: 190rpx;
      img{
        width: 200rpx;
        height: 300rpx;
      }
      .name{
        font-size: 28rpx;
        @include t-ellipsis;
      }
    }
  }
  .actors{
    overflow: hidden;
    height: 590rpx;
    padding-left: 10rpx;
    .wrap{
      position: relative;
    }
    .zi{
      height: 50rpx;
      font-size: 30rpx;
    }
    .a-box{
      width: 48%;
      display: inline-block;
      padding: 0 8rpx;
      .real{
        margin-bottom: 20rpx;
        img{
          width: 220rpx;
          height: 220rpx;
        }
        div{
          @include t-ellipsis;
          font-size: 28rpx;
          text-align: center;
        }
      }
      .role{
        text-align: center;
        img{
          width: 160rpx;
          height: 160rpx;
        }
        .role-name{
          @include t-ellipsis;
          font-size: 28rpx;
          text-align: center;
        }
      }
    }
    .a-box.left{
      position: absolute;
      right: 0;
      top: 0;
    }
  }
}
.images{
  padding: 20rpx 30rpx 50rpx 30rpx;
  height: 450rpx;
  .biao{
    font-size: 34rpx;
    @include vertical-center(80rpx)
  }
  .sw{
    height: 400rpx;
  }
  .slide-image{
    width: 100%;
    height: 350rpx;
  }
}
</style>