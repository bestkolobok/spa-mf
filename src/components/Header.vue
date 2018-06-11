<template>
    <!-- <v-toolbar :clipped-left="$vuetify.breakpoint.mdAndUp" class="primary toolbar" dark app scroll-off-screen :scroll-threshold="50" dense prominent extended> -->
    <v-toolbar 
        v-resize="onResize" 
        class="primary toolbar" 
        dark app dense :prominent="toolbarVisible && extendedVisible" :extended="toolbarVisible && extendedVisible"
        :style="{top: '-' + onScrollStyle + 'px'}"
    >
        <v-toolbar-title :class="visibleSearch ? 'toolbar-title--hidden' : ''" class="ml-0 pl-3 toolbar-title">
            <v-toolbar-side-icon @click.stop="drawerLeftToggle"></v-toolbar-side-icon>
            <router-link to="/"><span v-if="!visibleSearch" class="toolbar-title__text" :class="titleSize">MOOOOVIELAND</span></router-link>
        </v-toolbar-title>

        <v-spacer v-if="!visibleSearch"></v-spacer>

        <v-text-field 
            flat solo-inverted 
            prepend-icon="search" 
            label="Search" 
            class="toolbar-search"
            :class="!visibleSearch ? 'hidden-sm-and-down' : ''"
            v-model="inputData" 
            v-if="hideSearch "
            @keyup.enter="enterSearch"
        ></v-text-field>
        <v-btn icon @click="visibleSearch = true" class="hidden-md-and-up" v-if="!visibleSearch && hideSearch">
            <v-icon>search</v-icon>
        </v-btn>
        <v-btn icon @click.stop="drawerRightToggle" class="hidden-md-and-up" v-if="hideRightDriverButton">
            <v-icon>apps</v-icon>
        </v-btn>
        <v-tabs
            :hide-slider="!activeTabs"
            :slot="extendedVisible ? 'extension' : ''"
            v-model="currentItem"
            fixed-tabs
            color="transparent"
            slider-color="white"
            v-show="toolbarVisible && extendedVisible"
            class="tabs hidden-xs-only"
        >
            <v-tab
                :active-class="activeTabs ? 'tabs__item--active' : ''"
                v-for="item in mediaTypeItems"
                :key="item.id"
                :href="'#tab-' + item"
                :to="item.path"
                ripple
            >
                {{ item.name }}
            </v-tab>
            <v-spacer></v-spacer>
            <v-menu
                class="tabs__div tabs__genre hidden-sm-and-down"
                :class="genreActive"
                :close-on-content-click="false"
                v-model="closeGenresArea"
                origin="center center"
                transition="scale-transition"
                bottom
                v-show="genresToolbarVisible"
            >
                <span class="tabs__item" slot="activator" dark>Жанр</span>
                <v-list class="tabs__genre-list">
                    <v-btn fab small dark color="accent" @click="closeGenresArea = false">
                        <v-icon dark>close</v-icon>
                    </v-btn>
                    <v-btn fab small dark color="error" @click="genreListRemove" v-show="allGenresVisible">
                        <v-icon dark>delete_forever</v-icon>
                    </v-btn>

                    <v-list-tile class="genres-child-elem" v-for="(item, i) in genresName" :key="i" :data-id="item.id" @click="genreListSet" ripple>
                        <v-list-tile-title >{{ item.name }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu> 
            <v-menu
                class="tabs__div tabs__category hidden-sm-and-down"
                :class="categoryActive"
                origin="center center"
                transition="scale-transition"
                bottom
                v-show="genresToolbarVisible"
            >
                <span class="tabs__item" slot="activator" dark>Категория</span>
                <v-list v-show="visibleMovieCategory">
                    <v-list-tile class="movies-child-elem" v-for="(item, i) in movieItems" :key="i" :data-path="item.moviePath" @click="categoryItemsSet">
                        <v-list-tile-title >{{ item.categoryMovie }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
                <v-list v-show="visibleTvCategory">
                    <v-list-tile class="tv-child-elem" v-for="(item, i) in tvItems" :key="i" :data-path="item.tvPath" @click="categoryItemsSet">
                        <v-list-tile-title >{{ item.categoryTv }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu> 
        </v-tabs>
    </v-toolbar>
    
</template>

<script>
import _ from 'lodash'
import Fetch from '@/common/fetch.js'
export default {
    name: 'Header',
    components: { Fetch },
    data(){
        return{
            activeTabs: true,
            hideRightDriverButton: true,
            hideSearch: true,
            visibleSearch: false,
            visibleMovieCategory: false,
            visibleTvCategory: false,
            genresToolbarVisible: false,
            allGenresVisible: false,
            closeGenresArea: false,
            toolbarVisible: true,
            extendedVisible: true,
            genreActive: '',
            categoryActive: '',
            onScrollStyle: 0,
            titleSize:'title',
            genresName: [],
            // genresSelectElement: null,
            selectedGenres: [],
            // categorySelected: '',
            inputData: null,
            searchLabel: '',
            routeName: null,
            routeNameOld: null,
            mediaTypeItems: [
                {name: "Фильмы", path: "/movies"}, 
                {name: "Сериалы", path: "/series"},
                {name: "актеры", path: "/actors"}
            ],
            movieItems: [
                { categoryMovie: 'Все фильмы', moviePath: "/movies"},
                { categoryMovie: 'Премьеры', moviePath: "/movies/upcoming"},
                { categoryMovie: 'Сейчас на экранах', moviePath: "/movies/nowPlaying"},
                { categoryMovie: 'Популярные', moviePath: "/movies/Popular"},
                { categoryMovie: 'Топ 100', moviePath: "/movies/topRated"},
            ],
            tvItems: [
                {categoryTv: 'Все сериалы', tvPath: "/series"},
                {categoryTv: 'Популярные', tvPath: "/series/popular" },
                {categoryTv: 'Сейчас на экранах', tvPath: "/series/onTheAir" },
                {categoryTv: 'Топ 100', tvPath: "/series/topRated" },
            ],
            currentItem: null
        }
    },
    methods: {
        drawerLeftToggle () {
            this.$eventHub.$emit('toggle-drawer-left')
        },
        drawerRightToggle () {
            this.$eventHub.$emit('toggle-drawer-right')
            this.$eventHub.$emit('change-genre-header', this.selectedGenres)
        },
        genreListSet(e){
            const currentId = e.currentTarget.firstChild.dataset.id
            if(this.selectedGenres.indexOf(currentId) === -1){
                this.selectedGenres.push(currentId)
            }else{
                const deleteId = this.selectedGenres.indexOf(currentId)
                this.selectedGenres.splice(deleteId, 1)
            }
            this.genreListMark(this.selectedGenres)
            this.$eventHub.$emit('change-genre-header', this.selectedGenres)
        },
        genreListMark(selectedGenres){
            const child = document.querySelector(".genres-child-elem")
            if(child !== null){
                const elementsGroup = Array.from(child.parentNode.children)
                elementsGroup.forEach(elem => { 
                    const id = elem.firstChild.dataset.id
                    if(elem.classList.contains('success')){elem.classList.remove('success')}
                    if(this.selectedGenres.indexOf(id) !== -1){elem.classList.add('success')} 
                })
            }
            this.allGenresVisible = this.selectedGenres.length > 0 
            this.changeGenre(selectedGenres)
        },
        genreListRemove() {
            this.selectedGenres = []
            this.genreListMark([])
            this.allGenresVisible = false
        },
        categoryItemsSet(e) {
            // const elements = Array.from(e.currentTarget.parentNode.children)
            // elements.forEach(element => { element.classList.remove('success') })
            // if(e.currentTarget.firstChild.dataset.path !== "/movies" && e.currentTarget.firstChild.dataset.path !== "/series"){e.currentTarget.classList.add('success')}
            this.changeCategory(e.currentTarget.firstChild.dataset.path)
            this.categoryItemsMark()
        },
        categoryItemsMark() {
            let child = null
            if(this.visibleMovieCategory){child = document.querySelector(".movies-child-elem")}
            if(this.visibleTvCategory){child = document.querySelector(".tv-child-elem")}
            if(child !== null){
                const elementsGroup = Array.from(child.parentNode.children)
                elementsGroup.forEach(elem => { 
                    const path = elem.firstChild.dataset.path
                    if(elem.classList.contains('success')){elem.classList.remove('success')}
                    if(this.$route.path === path){elem.classList.add('success')} 
                })
            }
        },

        clearInput: _.debounce(function(){
                this.inputData = null
                this.visibleSearch = false
            }, 
            8000, 
            { 
                'leading': false 
            }
        ),

        onSearch(){
            if (this.$route.name.indexOf("movies") !== -1){this.$router.push('/movies/search')} else
            if (this.$route.name.indexOf("series") !== -1){this.$router.push('/series/search')} else
            if (this.$route.name.indexOf("actors") !== -1){this.$router.push('/actors/search')} else
            {this.$router.push(`/search`)}
            
            window.setTimeout(()=>{
                this.$eventHub.$emit('start-search', null, this.inputData);
            }, 0)
        },
        enterSearch(){
            this.onSearch()
            this.visibleSearch = false
        },
        changeCategory(category){
            this.$router.push(category)
        },
        setGenresList(mediaCategory, type){
            if (typeof this.$eventHub['list' + type] !== 'undefined') {
                this.genresName = this.$eventHub['list' + type]
            } else {
                Fetch.setGenresList(mediaCategory).then(data => {
                    this.genresName = data
                    this.$eventHub['list' + type] = data
                })
            }
        },
        changeGenre(id){
            if (this.$route.path.indexOf("movies") !== -1){
                this.$eventHub.$emit('genre-select', id, "movie")
            }else
            if (this.$route.path.indexOf("series") !== -1){
                this.$eventHub.$emit('genre-select', id, "tv")
            }
            this.$eventHub.selectedGenres_current = this.selectedGenres
            this.$eventHub.$emit('page-reset', 1)
            this.routeName = this.routeNameOld
        },
        watchRoutes(to,from){
            if(from !== undefined && !((to.path.indexOf("movies") !== -1 && from.path.indexOf("movies") !== -1) || (to.path.indexOf("series") !== -1 && from.path.indexOf("series") !== -1)) ) {this.genreListRemove()}
            if (to.name === "main" || to.name === "search"){ this.toolbarVisible = false; this.titleSize = "headline"} 
            else {this.toolbarVisible = true; this.titleSize = "title";}

            if (to.path.indexOf("movies") !== -1){this.visibleMovieCategory = true; this.setGenresList('movie', 'movies')}else{this.visibleMovieCategory = false}
            if (to.path.indexOf("series") !== -1){this.visibleTvCategory = true; this.setGenresList('tv', 'series')}else{this.visibleTvCategory = false}
            if (to.path.indexOf("movies") !== -1 || to.name.indexOf("series") !== -1){this.genresToolbarVisible = true}else{this.genresToolbarVisible = false}
            // if (to.name === "movies" || to.name === "series"){this.categorySelected = ''}
            this.searchLabel = to.name.indexOf("movies") !== -1 ? 'фильмов' : to.name.indexOf("series") !== -1 ? 'сериалов' : to.name.indexOf("actors") !== -1 ? 'актеров' : 'по сайту';
            this.categoryItemsMark()
            this.$eventHub.$emit('update-category')
        },
        onResize () {
            this.extendedVisible = window.innerWidth < 600 ? false : true
        },
        changeGenreDrawer(selectedGenres){
            this.genreListMark(selectedGenres)
            this.selectedGenres = selectedGenres
        }
    },
    watch: {
        '$route' (to, from) { 
            this.routeNameOld = from.name;
            this.routeName = to.name;
            this.watchRoutes(to,from)
            this.hideSearch = to.name !== "bookmarks" && to.name !== "viewed"
            this.activeTabs = to.name !== "bookmarks" && to.name !== "viewed"
            this.hideRightDriverButton = to.name !== "bookmarks" && to.name !== "viewed"
        },
        genresName(){
            this.$eventHub.genres_current = this.genresName
            this.$eventHub.$emit('update-genre', this.genresName)
        },
        inputData(){
            if(this.inputData){
                this.onSearchDebounse()
                this.clearInput()
            }
        },
    },
    created(){
        this.onSearchDebounse = _.debounce(this.onSearch, 1000)
    },
    mounted(){
        const to = this.$route
        this.watchRoutes(to)
        this.$eventHub.$on('scroll-header', offset => this.onScrollStyle = offset)
        this.$eventHub.$on('change-genre-drawer', this.changeGenreDrawer)
        this.$eventHub.$on('genres-list-remove', this.genreListRemove)
    }
}
</script>

<style lang="scss" scoped>
    .toolbar{
        .toolbar-title{
            width: 340px;
            &__text{
                color: white;
            }
        }
        .toolbar-title--hidden{
            width: 68px;
        }
        .tabs{
            
            &__div--active{
                border: 1px solid white;
            }

        }
    }
    
</style>

