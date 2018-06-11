<template>
  <v-app id="inspire" dark>
    <app-header></app-header>
      <v-content class="content-conteiner__inside" id="scroll-target"> 
        <router-view class="router-conteiner"></router-view>
      </v-content>
    <app-footer class="footer"></app-footer>
  </v-app>
</template>

<script>
import AppHeader from '@/components/Header.vue'
import AppFooter from '@/components/Footer.vue'
export default {
  name: 'App',
  components: { AppHeader, AppFooter, DrawerLeft, DrawerRight },
  data () {
    return {

    }
  },
  methods:{

  }
}
</script>

<style>
  a {
    text-decoration: none!important;
  }
</style>

<style lang="scss" scoped>

</style>
