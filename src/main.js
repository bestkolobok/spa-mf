// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Config from './common/config'
// import '@/assets/styles/reset.scss';
import 'vuetify/dist/vuetify.min.css'

// import Vuetify from 'vuetify'
import {
    Vuetify,
    VApp,
    VAvatar,
    VBtn,
    VBtnToggle,
    VBottomSheet,
    VCard,
    VCarousel,
    VDatePicker,
    VDialog,
    VDivider,
    VFooter,
    VForm,
    VIcon,
    VGrid,
    VList,
    VMenu,
    VNavigationDrawer,
    VParallax,
    VPagination,
    VSwitch,
    VTabs,
    VToolbar,
    VTooltip,
    VTextField,
    transitions,
    // directives
} from 'vuetify'
import directives from 'vuetify/es5/directives'
import '../node_modules/vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
    components: {
        VApp,
        VAvatar,
        VBtn,
        VBtnToggle,
        VBottomSheet,
        VCard,
        VCarousel,
        VDatePicker,
        VDialog,
        VDivider,
        VFooter,
        VForm,
        VIcon,
        VGrid,
        VList,
        VMenu,
        VNavigationDrawer,
        VParallax,
        VPagination,
        VSwitch,
        VTabs,
        VToolbar,
        VTooltip,
        VTextField,
        transitions
    },
    theme: {
        primary: '#516696',
        secondary: '#f0f1f3',
        accent: '#d54747',
        error: '#FF5252',
        info: '#f6b83d',
        success: '#E1BEE7',
        warning: '#FFC107'
    }
})
Vue.use(directives)

// Vue.use(Vuetify)

Vue.config.productionTip = false
Vue.prototype.$eventHub = new Vue()

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>',
    data: {
        Config: Config
    }
})