import "bootstrap/dist/css/bootstrap.css"
import { createApp } from 'vue'
import App from './App.vue'
import * as VueRouter from "vue-router"
import LoginPage from "./pages/LoginPage.vue"
import MainPage from "./pages/MainPage.vue"

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

import { firebaseConfig } from "./env.js" 

// Initialize Firebase
initializeApp(firebaseConfig)
// const analytics = getAnalytics(app);

createApp(App)
.use(VueRouter.createRouter({
    history: VueRouter.createWebHistory(process.env.BASE_URL),
    routes: [{
        path: "/login",
        component: LoginPage,
    },{
        path: "/",
        component: MainPage,
    }]
}))
.mount('#app')

import "bootstrap/dist/js/bootstrap.js"