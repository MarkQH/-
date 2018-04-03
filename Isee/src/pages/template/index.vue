<template>
  <div>
    
  </div>
</template>

<script>
import card from '@/components/card'

export default {
  components: {
    card
  },

  data () {
    return {
      mid: null,
      cityId: null
    }
  },

  mounted () {
    this.cityId = this.$root.$mp.query.locationId
    this.mid = this.$root.$mp.query.movieId
    console.log(this.cityId)
  }
}
</script>

<style>
.log-list {
  display: flex;
  flex-direction: column;
  padding: 40rpx;
}

.log-item {
  margin: 10rpx;
}
</style>