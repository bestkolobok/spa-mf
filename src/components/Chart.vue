<template>
    <div class="conteiner">
        <bar-chart 
            ref="BarChart" 
            :options="options" 
            :chart-data="chartData"
            :height="180" 
        />
        <v-container grid-list-md text-xs-center>
            <v-layout row wrap>
                <v-flex xs3>
                    <v-tooltip top max-width="200px">
                        <v-switch
                            slot="activator"
                            :label="relativeSwitch ? 'Відносна шкала' : 'Абсолютна шкала'"
                            :input-value="relativeSwitch"
                            @click="onRelativeSwitch"
                            v-if="sortedTransactions.length > 1"
                        ></v-switch>
                        <span>Відображення масштабу: Абсолютне - відносно найбільшого значення всіх трансакцій;
                        Відносне - відносно найбільшого значення на поточній сторінці</span>
                    </v-tooltip>
                </v-flex>
                <v-flex xs9>
                    <div class="text-xs-center" v-if="sortedTransactions.length > 1">
                        <v-pagination :length="sortedTransactions.length" v-model="currentPage" @input="changePage"></v-pagination>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import {HTTP} from '@/common/http.js'
import BarChart from '@/common/BarChart.vue'

export default {
    name: 'Chart',
    components: { BarChart },
    data () {
        return {
            transactions: [],
            sortedTransactions: [],
            itemOnPage: 10,
            currentPage: 1,
            relativeSwitch: false,
            chartData: {
                labels: [],
                datasets: [
                    {
                        label: [],
                        backgroundColor: [],
                        data: []
                    }
                ]
            },
            options: {
                legend: false,
                tooltips: {
                    // mode: 'nearest'
                },
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            beginAtZero: true,
                            callback: function(value, index, values) {
                                return  value + ' грн.'
                            }
                        }
                    }],
                    xAxes: [{
                        display: false,
                        // ticks: {
                        //     autoSkip: false,
                        //     suggestedMin: 0,
                        //     callback: function(value, index, values) {
                        //         return  value
                        //     }
                        // }
                    }]
                }
            },
        }
    },
    methods: {
        getTransactions(region){
            HTTP.get(`api/transactions/top100?region=${region}`)
            .then(response => {
                this.transactions = response.data
                this.options.scales.yAxes[0].ticks.suggestedMax = this.transactions.length > 0 ? this.transactions[0].amount : undefined
                if(!this.relativeSwitch){this.$eventHub.$emit('renderChart')}
                this.sortTransactions()
            })
            .catch(error => console.error(error))
            
        },
        sortTransactions(){
            this.sortedTransactions = []
            this.transactions.forEach(data => {
                const sorted = this.sortedTransactions
                if(sorted.length === 0 || sorted[sorted.length - 1].length === this.itemOnPage){
                    sorted[sorted.length] = []
                } 
                sorted[sorted.length - 1].push(data)
            })
            this.changePage(1)
            this.updateChart()
        },
        updateChart(){
            this.chartData.datasets[0].data = []
            this.chartData.datasets[0].backgroundColor = []
            this.chartData.labels = []
            if(this.sortedTransactions.length > 0){
                this.sortedTransactions[this.currentPage - 1].forEach(element => {
                    this.chartData.datasets[0].data.push(element.amount)
                    this.chartData.datasets[0].backgroundColor.push('#d54747')
                    this.chartData.labels.push(element.payer_name)
                })
            }
            this.$refs.BarChart.update()
        },
        changePage(page){
            this.currentPage = page
            this.updateChart()
        },
        onRelativeSwitch(){
            this.relativeSwitch = !this.relativeSwitch
            if(!this.relativeSwitch){
                this.options.scales.yAxes[0].ticks.suggestedMax = this.transactions[0].amount
            } else {
                this.options.scales.yAxes[0].ticks.suggestedMax = undefined
            }
            this.$eventHub.$emit('renderChart')
        }
    },
    mounted(){
        this.$eventHub.$on('get-rtansactions', this.getTransactions)
        this.$eventHub.$on('set-quantity', (quantity) => {
            this.itemOnPage = quantity
            this.sortTransactions()
        })
    } 
}
</script>

<style lang="scss" scoped>
    .conteiner{
        margin-top: 30px;
    }
</style>