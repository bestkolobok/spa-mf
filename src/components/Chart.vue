<template>
    <div class="conteiner">
        <bar-chart 
            ref="BarChart" 
            :options="options" 
            :chart-data="chartData" 
            :height="180" 
        />
    </div>
</template>

<script>
/* eslint-disable */
import {HTTP} from '@/common/http.js'
import BarChart from '@/common/BarChart.vue'

export default {
    name: 'Chart',
    components: { BarChart },
    data () {
        return {
            transactions: [],
            chartData: {
                labels: ['Новый1', 'Новый2'],
                datasets: [
                {
                    label: [],
                    backgroundColor: [],
                    data: []
                }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            beginAtZero: true
                        }
                    }]
                }
            },
        }
    },
    methods: {
        getTransactions(region){
            const catchResponse = (response) => {
                this.transactions = response.data
                 
                // console.log('response', response.data)
            }
            HTTP.get(`api/transactions/top100?region=${region}`)
            .then(response => this.updateChart(response.data))
            .catch(error => console.error(error))
        },
        updateChart(transactoins){
            this.chartData.datasets[0].data = []
            this.chartData.datasets[0].backgroundColor = []
            this.chartData.labels = []
            transactoins.forEach(element => {
                this.chartData.datasets[0].data.push(element.amount)
                this.chartData.datasets[0].backgroundColor.push('#00ff00')
                this.chartData.labels.push(element.payer_name)
            })
            this.$refs.BarChart.update()
        }
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