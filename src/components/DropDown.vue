<template>
  <div class="text-xs-center">
    <v-menu class="dropdown" offset-y full-width auto min-width="80%" content-class="dropdown__list">
      <v-btn class="dropdown__btn" slot="activator" color="primary" dark>{{ selectedRegion }}</v-btn>
      <v-list>
        <v-list-tile v-for="(region, index) in regions" :key="index" @click="selectRegion(region)">
          <v-list-tile-title>{{ region.regionName }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
/* eslint-disable */
import {HTTP} from '@/common/http.js'
export default {
    name: 'DropDown',
    data () {
        return {
            regions: [],
            selectedRegion: 'Виберіть регіон'
        }
    },
    methods: {
        getRegions(){
            const catchResponse = (response) => {
                this.regions = response.data
                console.log('response', response.data)
            }
            HTTP.get('regions')
            .then(response => catchResponse(response))
            .catch(error => console.error(error))
        },
        selectRegion(region){
            this.selectedRegion = region.regionName
            this.$eventHub.$emit('get-rtansactions', region.regionCode)
        }
    }, 
    mounted(){
        this.getRegions()
    }
}
</script>

<style lang="scss" scoped>
    .dropdown{
        &__btn{
            width: 80%;
        }
        // &__list{
        //     position: relative;
        //     right: 90px;
        // }
    }
</style>