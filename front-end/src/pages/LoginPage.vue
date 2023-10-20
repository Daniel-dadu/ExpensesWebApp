<template>
    <h3 class="text-center" style="margin-top: 2rem;">Personal Finances App</h3>
    <button @click="onLogin" class="btn btn-outline-light google-login-btn">
        <img src="../assets/google.svg" alt="">
        <span>Login with Google</span>
    </button>
</template>

<script setup>
import { onMounted } from "vue"
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"
import { useRouter } from "vue-router"

const router = useRouter()

onMounted(() => {
    if(window.localStorage.length !== 0) {
        router.push("/")
    }
})

const googleProvider = new GoogleAuthProvider()
const auth = getAuth()

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

<style>
.google-login-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.google-login-btn span {
    font-size: 1.5rem;
}
.google-login-btn img {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(101deg) brightness(103%) contrast(101%);
    margin-bottom: 0.3rem;
    margin-right: 0.7rem;
    width: 2rem;
}

.google-login-btn:hover img {
    filter: invert(12%) sepia(21%) saturate(342%) hue-rotate(168deg) brightness(91%) contrast(92%);
}
</style>