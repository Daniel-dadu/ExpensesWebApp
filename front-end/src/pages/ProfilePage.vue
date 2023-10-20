<template>
    <img :src="userImg" class="rounded mx-auto d-block profile-margin-top" alt="Profile picture">
    <h3 class="display-6 text-center profile-margin-top">{{ userName }}</h3>
    <h4 class="lead text-center" style="font-style: italic;">{{ userEmail }}</h4>
    <button 
        type="button" 
        class="btn btn-outline-light btn-center" 
        @click="onLogout"
        style="margin-top: 2rem;"
    >
        Log out
    </button>
    <button 
        type="button" 
        class="btn btn-outline-danger btn-center" 
        @click="onDeleteAccount"
        style="margin-top: 1rem;"
    >
        Delete account and data
    </button>
</template>

<script setup>
import { ref, } from "vue"
import { useRouter } from "vue-router"
import { getAuth, signOut } from "firebase/auth"
const auth = getAuth()

const router = useRouter()

const userImg = ref(window.localStorage.getItem("picture"))
const userName = ref(window.localStorage.getItem("name"))
const userEmail = ref(window.localStorage.getItem("email"))

const onLogout = () => {
    signOut(auth)
    window.localStorage.clear()
    router.push("/login")
}

const onDeleteAccount = () => {
    // TODO: Delete Data
    onLogout()
}
</script>

<style>
.profile-margin-top {
    margin-top: 2rem;
}
.btn-center {
    display: block;
    margin: auto;
}
</style>