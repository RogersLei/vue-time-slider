<template>
  <div id="app">
    <timeline-slider :range="[1588223700, 1588226700]" :show-stops="true" :selectRange="[1588226300, 1588226700]"></timeline-slider>
  </div>
</template>

<script>

export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
