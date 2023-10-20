<template>
    <h1>Login</h1>
    <button @click="onLogin">Login with Google</button>
</template>

<script setup>
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { useRouter } from "vue-router"

const googleProvider = new GoogleAuthProvider()
const auth = getAuth()

const router = useRouter()

const onLogin = () => {
    signInWithPopup(auth, googleProvider)
    .then((result) => {
        window.localStorage.setItem("email", result.user.email)
        window.localStorage.setItem("name", result.user.displayName)
        window.localStorage.setItem("picture", result.user.photoURL)
        window.localStorage.setItem("loginDate", result.user.metadata.lastSignInTime)
        router.push("/")
    })
    .catch((error) => {
        alert("Could not Login. Try again with another account or later.")
        console.log(error)
    })
}
</script>