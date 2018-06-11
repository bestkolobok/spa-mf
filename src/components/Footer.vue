<template>
    <v-footer height="auto" class="primary" app>
        <v-layout row justify-center>
            <div class="text-xs-center">
                <v-pagination 
                v-show="pagesButtonVisible"
                :length="stateTotalPages" 
                v-model="currentPage" 
                :total-visible="7" 
                circle color="accent"
                @input="changePage"
                ></v-pagination>
            </div>
        </v-layout>
    </v-footer>
</template>

<script>

export default {
  name: 'Footer',
  data: () => ({
    searchPath: '',
    // storyButtonVisible: false,
    pagesButtonVisible: true,
    currentPage: 1,
    stateTotalPages: 15
  }),
  methods: {

    changePage(state){
      let stateCurrentPage = state || 1
      // this.setTotalPages()
      this.$eventHub[this.$route.name + 'currentPage'] = stateCurrentPage
      this.$eventHub.$emit('change-page', stateCurrentPage)
      this.currentPage = +this.$eventHub[this.$route.name + 'currentPage']
      console.log('stateCurrentPage', stateCurrentPage)
    },
    setTotalPages(total){
      if(+total <= 999 || !total) {
        this.stateTotalPages = +total || 1
      }else{
        this.stateTotalPages = 999
      }
      // if(this.$eventHub[this.$route.name  + 'total'] <= 100) {
      //   this.stateTotalPages = +total || +this.$eventHub[this.$route.name  + 'total'] || 1
      // }else{
      //   this.stateTotalPages = 100
      // }
      // console.log('TotalPages', total)
    },
    setCurrentPage(page){
      this.currentPage = page
    },
    searchStateData(data){
      let item
      for(let key in this.$eventHub){
        if(key.indexOf(data) !== -1){item = true}
      }
      return item
    }
  },
  watch: {
    '$route' (to, from) {
      // this.searchPath = `/${to.name}/search`
      // if(to.name.indexOf("series") !== -1){this.searchPath = `/series/search`} else
      // if(to.name.indexOf("movies") !== -1){this.searchPath = `/movies/search`} else
      // if(to.name.indexOf("actors") !== -1){this.searchPath = `/actors/search`} else
      // {this.searchPath = `/main/search`}

      // if(
      //   to.name.indexOf("series") !== -1 && this.searchStateData('searchSeries1') ||
      //   to.name.indexOf("movies") !== -1 && this.searchStateData('searchMovies1') ||
      //   to.name.indexOf("actors") !== -1 && this.searchStateData('searchActors1') ||
      //   to.name === "main" && this.$eventHub.search1
      //   ){this.storyButtonVisible = true} else {this.storyButtonVisible = false}

      if(to.name === "main"){this.pagesButtonVisible = false} else {this.pagesButtonVisible = true}

      this.currentPage = +this.$eventHub[to.name + 'currentPage'] || 1
      // console.log("ROUTE_NAME", to.name) 
    },
    '$root'(eventHub){
      // console.log("ROOOOOOT CHANGE", eventHub)
    }
  },
  mounted(){
    // this.$eventHub.$on('update-page', page => this.currentPage = page);
    this.$eventHub.$on('update-page', this.changePage)
    this.$eventHub.$on('update-fetch-page', this.setCurrentPage)
    this.$eventHub.$on('page-reset', this.changePage)
    this.$eventHub.$on('set-total-pages', this.setTotalPages)

    this.currentPage = +this.$eventHub[this.$route.name + 'currentPage'] || 1
    if(this.$route.name === "main"){this.pagesButtonVisible = false} else {this.pagesButtonVisible = true}
    // this.setTotalPages()
  },
  updated(){
    // console.log("beforeUpdate")
    // this.currentPage = this.$eventHub[this.$route.name + 'currentPage'];
    this.currentPage = +this.$eventHub[this.$route.name + 'currentPage'] || 1
    // this.$eventHub[this.$route.name + 'currentPage'] = this.currentPage
    // console.log(this.$eventHub[this.$route.name + 'total'])
    // console.log('this.currentPage', this.currentPage)
  }
  
}
</script>

<style lang="scss" scoped>

// .md-toolbar{
//   .md-search-button {
//     position: absolute;
//     left: 20px;
//   }
//   .md-page-buttons {
//     display: flex;
//     margin: auto;
//     align-content: center;
//     span {
//       line-height: 100%;
//       margin: auto;
//     }
//   }
// }
</style>