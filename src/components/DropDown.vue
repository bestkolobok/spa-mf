<template>
    <div>

    </div>
</template>

<script>
/* eslint-disable */
import Fetch from '@/common/fetch.js'
export default {
    name: 'DropDown',
    data () {
        return {
            regions: null
        }
    },
    methods: {
        getRegions(){
            const catchResponse = (response) => {
                this.regions = response
                console.log('response', response)
            }
            Fetch.getRegion().then(data => catchResponse(data))
        },
    }, 
    mounted(){
        this.getRegions()

        // fetch('http://api.spending.gov.ua/api/v2/regions', {
        //     mode: 'cors', 
        //     protocol:'http:',
        //     headers: {
        //         // 'Accept': "application/json, text/plain, */*", "Content-Type": "application/x-www-form-urlencoded"
        //     }})
        // .then(function(response) {
        //     return response.json()
        // }).then(function(json) {
        //     console.log('parsed json', json)
        // }).catch(function(ex) {
        //     console.log('parsing failed', ex)
        // })


    }
}
</script>

<style lang="scss" scoped>

</style>