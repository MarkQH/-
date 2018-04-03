<script>
export default {
  mpType: 'app'
}
</script>

<style lang="scss">
@import '~@/styles/style.scss';
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: '#f6f6f6';
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
img{
  width: 100%;
  height: 100%;
  display: inline-block;
}
.more-tip{
  @include more-tip;
}
.fd-l{
  float: left;
}
.fd-r{
  float: right;
}
.clearfix:after{
  clear: both;
  content: '';
  visibility: hidden;
  height: 0;
  display: block;
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
.fade-in
{
	animation:fadein 1s both;
	-webkit-animation:fadein 1s both;
}

@keyframes fadein
{
	from {opacity: 0;}
	to {opacity: 1}
}

@-webkit-keyframes fadein
{
	from {opacity: 0;}
	to {opacity: 1}
}
</style>
