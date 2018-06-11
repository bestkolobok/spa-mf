<template>
    <v-container class="content" grid-list-lg fluid>
        <v-layout  row justify-space-between wrap>
            <v-flex xs12>
                <v-layout class="button-row" justify-space-between mt-2 wrap>
                    <v-flex 
                        text-xs-center
                        xs12 sm4 mt-1 wrap 
                        v-for="item in cardItems" 
                        :key="item.id"
                        @click="navigateTo(item.categoryPath)"
                        d-flex
                    >
                        <div class="button-row__button accent elevation-24" mx-2>
                            <span class="headline" >{{item.categoryName}}</span>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-layout class="nowPlayingArea" justify-space-between mt-3 wrap>
                    <v-flex class="content" 
                        xs12 sm6 md6 
                        v-for="item in mediaItems" 
                        :key="item.id" 
                        @click="navigateTo(item.categoryPath)"
                    >
                        <div
                            class="content__card" 
                            :class="i === item.count ? 'content__card--active' : ''"
                            v-for="(subItem,i) in item.media" 
                            :key="subItem.id"
                        >
                            <div class="content__wrapper elevation-24">
                                <img 
                                    class="content__image"
                                    :src="'https://image.tmdb.org/t/p/w600_and_h900_bestv2' + subItem.poster_path" :alt="subItem.title || subItem.name"
                                >
                                <div class="content__shadow-top primary"></div>
                                <div class="content__shadow-bottom"></div>
                                <div class="content__title">
                                    <span class="headline">{{item.title}}</span>
                                </div>
                                <div class="content__name">
                                    <span class="title">{{subItem.title || subItem.name}}</span>
                                </div>
                            </div>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
/* eslint-disable */
import Fetch from '@/common/fetch.js'
export default {
    name: 'LastRowFixed',
    data: () => ({
        cardItems: [
            {categoryName: "Фильмы", categoryPath: "/movies", categoryImage: require('../assets/img/movies.jpg')},
            {categoryName: "Сериалы", categoryPath: "/series", categoryImage: require('../assets/img/series.jpg')},
            {categoryName: "Актеры", categoryPath: "/actors", categoryImage: require('../assets/img/actors.jpg')}
        ],
        mediaItems: [
            {title: "Фильмы сейчас в прокате", media: [], count: 0, categoryPath: "/movies/nowPlaying"},
            {title: "Сериалы сейчас на ТВ", media: [], count: 0, categoryPath: "/series/onTheAir"}
        ]
    }),
    methods: {
        navigateTo: function (nav) {
            this.$router.push({
            path: nav
            })
        },
        getRandomMedia(){
            Fetch.getMoviesNowPlaying(1, '').then(data => this.mediaItems[0].media = data.results)
            Fetch.getSeriesOnTheAir(1, '').then(data => this.mediaItems[1].media = data.results)
            let count = 0
            setInterval(()=>{
                this.mediaItems[0].count = count
                this.mediaItems[1].count = count
                count++
                if(count === 20){count = 0}
            }, 4000)
        }
    },
    created () {
        this.getRandomMedia()
    }
  
}
</script>

<style lang="scss" scoped>
.content{
    max-width: 960px;
    .button-row{
        &__button{
            display: flex;
            align-content: center;
            justify-content: center!important;
            height: 50px;
            border-radius: 6px;
            cursor: pointer;
            span{
                align-self: center;
                letter-spacing: 15px;
            }
        }
    }
    .nowPlayingArea{
        .content{
            position: relative;
            height: 60vh;
            width: 100%;
            &__card{
                opacity: 0;
                position: absolute;
                width: calc(100% - 16px);
                height: calc(100% - 16px);
                transition: opacity 2s linear;
                cursor: pointer;
            }
            &__card--active{
                opacity: 1;
            }
            &__wrapper{
                position: relative;
                width: 100%;
                height: 99%;
                overflow: hidden;
            }
            &__image{
                position: absolute;
                top: -100px;
                width: 100%;
            }
            &__shadow-top{
                position: absolute;
                top: 0;
                width: 100%;
                height: 15%;
                opacity: 0.4;
            } 
            &__shadow-bottom{
                position: absolute;
                bottom: 0;
                width: 100%;
                height: 50%;
                opacity: 1;
                background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.71) 47%, rgba(0,0,0,1) 100%);
            }
            &__title{
                display: flex;
                position: absolute;
                top: 16px;
                width: 100%;
                justify-content: center;
            }
            &__name{
                display: flex;
                position: absolute;
                bottom: 22px;
                width: 100%;
                justify-content: center;
            }
        }
    }

    &__area{
        max-width: 80%;
        overflow-x: hidden;
    }
}
</style>