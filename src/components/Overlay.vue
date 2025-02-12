<template>
    <div id="mask" class="overlay"></div>
</template>

<script setup>

</script>

<style scoped>
.overlay {
    position: fixed;
    top: 0;
    left : 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(1px);
    z-index: 98;
}
</style>