<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options'],
  methods: {
    update () {
      this.$data._chart.update()
    },
    newRender(){
      this.$data._chart.destroy()
      this.renderChart(this.chartData, this.options)
    }
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
    this.$eventHub.$on('renderChart', this.newRender)
  }
}
</script>
