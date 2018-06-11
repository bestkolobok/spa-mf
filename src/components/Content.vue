<template>
  <div id="search-container">
    <div class="item-page">
      <v-dialog 
        v-model="itemPageVisible" 
        class="item-page__area" 
        width="1200px" 
        :fullscreen="$vuetify.breakpoint.xsOnly"
      >
        <item-page v-if="itemPageVisible"></item-page>
      </v-dialog>
    </div>
      
    <v-container fluid grid-list-lg class="itemcards-area">
      <v-layout row wrap>
        <v-flex class="itemcard-conteiner" xs12 sm6 md3 v-for="(item, i) in movieItems" :key="item.id">
          <film-card :item="item" :keyItem="i"> </film-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
/* eslint-disable */
import Fetch from '@/common/fetch.js'
import FilmCard from '@/components/FilmCard.vue'
import ItemPage from '@/components/ItemPage.vue'

export default {
  name: 'Content',
  components: { 
    FilmCard,
    Fetch, 
    ItemPage 
  },
  // props: ['searchData'],
  data () {
    return {
      movieItems: null,
      oldSearchData: '',
      // oldRouteName: '',
      sortQuery: '',
      genresSelected:'',
      genreSetString: '',
      // genresMovies: '',
      // genresSeries: '',
      // routeName: this.$route.name,
      itemPageVisible: false,
      watchCurrentItem: null
    }
  },
  mounted () {
    this.$eventHub.$on('close-window', this.closeItemPage);
    this.$eventHub.$on('go-to-item', this.openItemPage);
    this.$eventHub.$on('genre-select', this.genresSelectCategory);
    this.$eventHub.$on('start-search', this.getSearch);
    this.getCategory(1, this.$route);
    this.$eventHub.$on('change-page', this.changePage);
  },
  
  methods: {
    setPages(totalPages, currentPage){
      this.$eventHub.$emit('set-total-pages', totalPages)
      this.$eventHub.$emit('update-fetch-page', currentPage)
      this.$eventHub[this.$route.name + 'total'] = totalPages || this.$eventHub[this.$route.name + 'total']
      this.$eventHub[this.$route.name + 'currentPage'] = currentPage || this.$eventHub[this.$route.name + 'currentPage']
    },

    getSearch(changePage, inputData){
      const page = changePage !== null ? changePage : 1

      if(inputData !== null || changePage !== null){
        const searchData = inputData || this.oldSearchData
        const queryId = this.$eventHub.searchQueryCollection.indexOf(searchData)
        // console.log("queryId", queryId)
        const catchResponse = (searchResponse) => {
          // console.log("FETCH search", searchResponse)
          this.$eventHub[this.$route.name + page + 'query_' + searchDataLength] = searchResponse
          this.movieItems = searchResponse.results
          this.setPages(searchResponse.total_pages, searchResponse.page)
        } 
        
        // if (this.oldSearchData !== searchData){this.$eventHub[this.$route.name + 'currentPage'] = 1}
        const page = this.$eventHub[this.$route.name + 'currentPage']
        if(queryId !== -1 && this.$eventHub[this.$route.name + page + 'query_' + queryId]){
          // console.log("catchResponse", this.$eventHub[this.$route.name + page + 'query_' + queryId])
          catchResponse(this.$eventHub[this.$route.name + page + 'query_' + queryId])
        }else
        {
          this.oldSearchData = searchData
          this.$eventHub.searchQueryCollection.push(searchData)
          var searchDataLength = this.$eventHub.searchQueryCollection.length - 1
          // console.log("FETCH push(searchData)", this.$eventHub.searchQueryCollection)
          if (this.$route.name === "searchMovies"){Fetch.getSearchCollection(page, "movie", searchData).then(data => catchResponse(data))} else 
          if (this.$route.name === "searchSeries"){Fetch.getSearchCollection(page, "tv", searchData).then(data => catchResponse(data))} else
          if (this.$route.name === "searchActors"){Fetch.getSearchCollection(page, "person", searchData).then(data => catchResponse(data))} else
          {Fetch.getSearchCollection(page, "multi", searchData).then(data => catchResponse(data))}
        }
      }
    },
    
    getCategory(changePage, route){
      const page = changePage !== null ? changePage : 1
      const catchResponse = (response) => {
        // console.log("FETCH category", response)
        this.$eventHub[route.name + page + 'genre' + this.genreSetString] = response
        this.movieItems = response.results
        this.setPages(response.total_pages, response.page)
      }
      // if (this.oldRouteName !== route.name){this.$eventHub[route.name + 'currentPage'] = 1}

      if(typeof this.$eventHub[route.name + page + 'genre' + this.genreSetString] !== 'undefined'){
        catchResponse(this.$eventHub[route.name + page + 'genre' + this.genreSetString])
      } else { 
        if (route.name === "movies"){Fetch.getItemCollection(page, "discover/movie", this.genresSelected).then(data => catchResponse(data))}
        if (route.name === "series"){Fetch.getItemCollection(page, "discover/tv", this.genresSelected).then(data => catchResponse(data))}
        if (route.name === "actors"){Fetch.getItemCollection(page, "person/popular", this.genresSelected).then(data => catchResponse(data))}
        if (route.name === "moviesUpcoming"){Fetch.getMoviesUpcoming(page, this.genresSelected).then(data => catchResponse(data))}
        if (route.name === "moviesNowPlaying"){Fetch.getMoviesNowPlaying(page, this.genresSelected).then(data => catchResponse(data))}
        if (route.name === "moviesPopular"){Fetch.getMoviesPopular(page, this.genresSelected).then(data => catchResponse(data))}
        if (route.name === "moviesTopRated"){Fetch.getMoviesTopRated(page, this.genresSelected).then(data => catchResponse(data))}
        if (route.name === "seriesPopular"){Fetch.getSeriesPopular(page, this.genresSelected).then(data => catchResponse(data))}
        if (route.name === "seriesOnTheAir"){Fetch.getSeriesOnTheAir(page, this.genresSelected).then(data => catchResponse(data))}
        if (route.name === "seriesTopRated"){Fetch.getSeriesTopRated(page, this.genresSelected).then(data => catchResponse(data))}
        if (route.name === "bookmarks"){
          this.movieItems = this.$eventHub.bookmarks
          this.setPages(1, 1)
        }
        if (route.name === "viewed"){
          this.movieItems = this.$eventHub.viewed
          this.setPages(1, 1)
        }
      }
      
    },
    changePage(page){
      if(this.$route.path.indexOf("search") !== -1){this.getSearch(page, null)}else{this.getCategory(page, this.$route)}
    },
    genresSelectCategory(data, item){
      console.log('genresSelectCategory', data, item)
      this.genreSetString = data.join('_');
      // if(item === "movie"){
      //   this.genresMovies = data.join(',')
      // }
      // if(item === "tv"){
      //   this.genresSeries = data.join(',')
      // }

      this.genresSelected = '&with_genres=' + data.join(',')
      this.getCategory(null, this.$route)
    },
    openItemPage(){
      // this.cuttentItem = item;
      this.itemPageVisible = true;
      // this.$eventHub["current_items"] = this.movieItems;
    },
    closeItemPage(){
      this.itemPageVisible = false;
    }
  },
  watch: {
    '$route' (to, from) { 
      if(to.path.indexOf("search") === -1){this.getCategory(null, to)}
       
      // if (to.name.indexOf("movies") !== -1 && this.genresMovies !== ''){this.genresSelected = '&with_genres=' + this.genresMovies}
      // if (to.name.indexOf("series") !== -1 && this.genresSeries !== ''){this.genresSelected = '&with_genres=' + this.genresSeries}
      },
    movieItems(val){
      this.$eventHub["current_items"] = this.movieItems;
      if(this.itemPageVisible){this.$eventHub.$emit('update-item-page')}
    }
  }
}
</script>

<style lang="scss" scoped>
  #search-container{
    // width: 100%;
    // .itemcards-area{
    //   width: calc(100% - 64px);
    // }
  }
  // .item-page{
  //   &__area{
  //     overflow: hidden; 
  //     height: 100%;
  //   }
  // }
  // .itemcard-conteiner{
  //   padding: 0!important;
  //   margin: 8px;
  // }
</style>