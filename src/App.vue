<template>
  <v-app id="main-app">
    <app-header class="header"></app-header>
    <v-content class="content-conteiner"> 
      <app-chart></app-chart>
      <app-drop-down></app-drop-down>
    </v-content>
    <app-footer class="footer"></app-footer>
  </v-app>
</template>

<script>
import AppHeader from '@/components/Header.vue'
import AppFooter from '@/components/Footer.vue'
import AppChart from '@/components/Chart.vue'
import AppDropDown from '@/components/DropDown.vue'
export default {
  name: 'App',
  components: { AppHeader, AppFooter, AppChart, AppDropDown },
}
</script>

<style lang="scss" scoped>

</style>
