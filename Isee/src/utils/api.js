import request from './req'

var cityUrl = 'https://api.map.baidu.com/geocoder/v2/'
var url = 'https://api-m.mtime.cn/'
var callbackUrl = 'https://m.mtime.cn/Service/callback.mi/'

const api = {
  getCity: (jd, wd) => request.get(cityUrl, {
    ak: '5lU4********************0OT6',
    location: jd + ',' + wd,
    output: 'json'
  }),
  getLocation: () => request.get(url + 'Showtime/HotCitiesByCinema.api'),
  getHotMovie: (locationId) => request.get(url + 'Showtime/LocationMovies.api', {
    locationId: locationId
  }),
  getCommingMovie: (locationId) => request.get(url + 'Movie/MovieComingNew.api', {
    locationId: locationId
  }),
  getMovieDetail: (movieId, locationId) => request.get(callbackUrl + 'movie/Detail.api', {
    movieId: movieId,
    locationId: locationId
  })
}

export default api
