<template>
    <h2>Profile</h2>
    <img :src="userImg" alt="Profile picture">
    <h3>{{ userName }}</h3>
    <h4>{{ userEmail }}</h4>
    <button @click="onLogout">logout</button>
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

</script>