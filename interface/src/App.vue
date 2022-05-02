<template>
  <router-view />
  <button @click="startMainAirlock">Start Main airlock(s)</button>
  <button @click="closeMainAirlock">Close keep airlock</button>
  <button @click="closeAgentAirlocks">Close all agent airlocks</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  mounted() {
    this.startMainAirlock();
  },
  unmounted() {
    this.closeMainAirlock();
    this.closeAgentAirlocks();
  },
  methods: {
    startMainAirlock() {
      this.$store.dispatch("ship/openKeepAirlock");
    },

    closeMainAirlock() {
      this.$store.dispatch("ship/closeKeepAirlock");
    },

    closeAgentAirlocks() {
      this.$store.dispatch("ship/closeAgentAirlocks");
    },
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0 auto;
  max-width: 50vw;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
