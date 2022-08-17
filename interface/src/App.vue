<template>
  <v-app class="tw-font-silom">
  <v-app-bar extend color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="navDrawer = !navDrawer"></v-app-bar-nav-icon>
    </template>

    <v-app-bar-title>
      <router-link :to="{ name: 'work' }">Keep</router-link>
    </v-app-bar-title>
  </v-app-bar>

    <v-navigation-drawer v-model="navDrawer" bottom temporary color="primary">
      <v-list color="primary">
        <v-list-item color="info" v-for="i in items" :key="i.name" :to="{ name: i.route }">
          {{ i.name }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="tw-container tw-mx-auto tw-my-8">
      <router-view></router-view>
      <button @click="startMainAirlock">Start Main airlock(s)</button>
      <button @click="closeMainAirlock">Close keep airlock</button>
      <button @click="closeAgentAirlocks">Close all agent airlocks</button>
      <div>
        messages:
        <ul>
          <li v-for="m in messages" :key="m">{{ m }}</li>
        </ul>
      </div>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      // logo,
      navDrawer: false,
      items: [
        {
          name: "Work",
          value: "work",
          route: "work",
        },
        {
          name: "Learn",
          value: "learn",
          route: "learn",
        },
      ]
    }
  },
  mounted() {
    this.startMainAirlock();
  },
  unmounted() {
    this.closeMainAirlock();
    this.closeAgentAirlocks();
  },
  computed: {
    messages() {
      return this.$store.state.message.messages;
    }
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
