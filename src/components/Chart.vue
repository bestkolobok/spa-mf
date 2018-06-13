<template>
    <div class="conteiner">

    </div>
</template>

<script>
/* eslint-disable */
import {HTTP} from '@/common/http.js'

export default {
    name: 'Chart',
    data () {
        return {
            transactions: []
        }
    },
    methods: {
        getTransactions(region){
            const catchResponse = (response) => {
                this.transactions = response.data
                // console.log('response', response.data)
            }
            HTTP.get(`api/transactions/top100?region=${region}`)
            .then(response => catchResponse(response))
            .catch(error => console.error(error))
        },
    },
    mounted(){
        this.$eventHub.$on('get-rtansactions', this.getTransactions)
    } 
}
</script>

<style lang="scss" scoped>
    .conteiner{
        min-height: 60vh;
    }
</style>