<template>
  <div id='app'>
      <Post/>
    </div>
</template>

<script>
import Post from './components/Post';

export default {
  name: 'App',

  components: {
    Post,
  },

  data: () => ({
    //
  }),
};
</script>

<style lang='scss'>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>