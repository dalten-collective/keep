<template>
  <v-app class="tw-font-silom">
    <v-app-bar extend color="primary">
      <template v-slot:prepend>
        <v-app-bar-nav-icon
          @click="navDrawer = !navDrawer"
        ></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>
        <router-link :to="{ name: 'work' }">Keep</router-link>
      </v-app-bar-title>

      <template v-slot:append>
        <a
          href="https://quartus.co"
          target="_blank"
          style="position: relative; top: 25px"
        >
          <div style="position: relative">
            <v-img :src="logo" contain height="75" width="75" />
          </div>
        </a>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="navDrawer" bottom temporary color="primary">
      <v-list color="primary">
        <v-list-item
          color="info"
          v-for="i in items"
          :key="i.name"
          :to="{ name: i.route }"
        >
          {{ i.name }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main class="tw-container tw-mx-auto tw-my-8">
      <router-view></router-view>
      <!--
      <button @click="startMainAirlock">Start Main airlock(s)</button>
      <button @click="closeMainAirlock">Close keep airlock</button>
      <button @click="closeAgentAirlocks">Close all agent airlocks</button>
      <div>
        messages:
        <ul>
          <li v-for="m in messages" :key="m">{{ m }}</li>
        </ul>
      </div>
      -->
    </v-main>
    <Message style="position: fixed; bottom: 0;" class="tw-fixed tw-bottom-0 tw-right-0 tw-w-full tw-p-2 tw-opacity-100 sm:tw-w-1/3"/>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Message from "@/components/Message.vue"
import logo from "@/assets/quartus-logo-white-square-no-text.png";

export default defineComponent({
  components: { Message },
  data() {
    return {
      logo,
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
      ],
    };
  },
  mounted() {
    this.startMainAirlock();
    this.getDesks();
  },
  unmounted() {
    this.closeMainAirlock();
    this.closeAgentAirlocks();
  },
  computed: {
  },
  methods: {
    startMainAirlock() {
      this.$store.dispatch("ship/openKeepAirlock");
    },
    getDesks() {
      const scry: Scry = { app: 'keep', path: '/desks' };
      this.$store.dispatch("keep/scry", scry)
        .then((r) => {
          console.log('scried ', r)
          this.$store.dispatch("ship/setDesks", r)
        })
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
