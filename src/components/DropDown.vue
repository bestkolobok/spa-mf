<template>
  <div class="text-xs-center">
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
            <v-flex xs8>
                <v-menu class="dropdown" offset-y full-width auto min-width="80%" content-class="dropdown__list">
                    <v-btn class="dropdown__btn" slot="activator" color="primary" dark>{{ selectedRegion }}</v-btn>
                    <v-list>
                        <v-list-tile v-for="(region, index) in regions" :key="index" @click="selectRegion(region)">
                        <v-list-tile-title>{{ region.regionName }}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-flex>
            <v-flex xs4>
                <v-menu class="quantity" offset-y full-width min-width="20%" content-class="quantity__list">
                    <v-btn class="quantity__btn" slot="activator" color="primary" dark>На графіку {{ selectedQuantity }} трансакцій</v-btn>
                    <v-list>
                        <v-list-tile v-for="(quantity, index) in quantityArr" :key="index" @click="selectQuantity(quantity)">
                        <v-list-tile-title>{{ quantity }}</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </v-flex>
        </v-layout>
    </v-container>
  </div>
</template>

<script>
import {HTTP} from '@/common/http.js'
export default {
    name: 'DropDown',
    data () {
        return {
            regions: [],
            selectedRegion: 'Виберіть регіон',
            selectedQuantity: 10,
            quantityArr: [10, 20, 50, 100]
        }
    },
    methods: {
        getRegions(){
            const catchResponse = (response) => {
                this.regions = response.data
            }
            HTTP.get('regions')
            .then(response => catchResponse(response))
            .catch(error => console.error(error))
        },
        selectRegion(region){
            this.selectedRegion = region.regionName
            this.$eventHub.$emit('get-rtansactions', region.regionCode)
        },
        selectQuantity(quantity){
            this.selectedQuantity = quantity
            this.$eventHub.$emit('set-quantity', quantity)
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
            width: 100%;
        }
    }
</style>