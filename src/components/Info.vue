<template>
  <div class="info">
    <span class="material-symbols-outlined">info</span>
    <p>{{msg}}</p>
  </div>
</template>

<script setup>
const {msg} = defineProps({
    msg: String
}
)
</script>

<style scoped>
.info {
    background-color: var(--background-3);
    display: flex;
    gap: .5rem;
    font-size: .7em;
    place-items: center;
    justify-content: space-around;
    padding-left: .7rem;
    border-radius: 5px;
    margin-bottom: .2rem;
}
p {
  width: fit-content;
}
</style>