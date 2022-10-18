<template>
  <div class="tw-w-screen">

    <div class="tw-flex tw-space-between tw-mb-4">
      <div class="tw-grow">
        <h3 class="tw-text-3xl tw-mb-6 tw-font-silom">Kept Agents</h3>
      </div>
    </div>

    <div v-if="!agents || agents.length === 0">
      <v-alert type="warning">
        No appropriate agents installed or configured yet. <router-link class="tw-underline" :to="{ name: 'learn' }">Learn more</router-link>
      </v-alert>
    </div>

    <div v-else>
      <div v-if="agents.length === 0">No active agents</div>
      <div v-else v-for="agent in orderedAgents" :key="agent" class="tw-my-2">
        <KeepAgent
          :agent-name="agent"
          class="tw-p-2 tw-my-6 tw-bg-white tw-border tw-shadow-md tw-rounded-keep"
        />
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { mapGetters } from "vuex";
import { Scry } from "@urbit/http-api";

import KeepAgent from "@/components/KeepAgent.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    KeepAgent,
  },
  computed: {
    ...mapGetters("keep", ["agents", "activeAgents"]),
    orderedAgents() {
      return this.agents.slice().sort((a, b) => {
        if (a.agentName < b.agentName) {
          return -1;
        }
        if (a.agentName > b.agentName) {
          return 1;
        }

        return 0;
      });
    },
  },
  data() {
    return {
      scryApp: "",
      scryPath: "",
      activePending: false,
    };
  },
  methods: {
    testScry() {
      const scry: Scry = { app: this.scryApp, path: this.scryPath };
      this.$store.dispatch("keep/scry", scry);
    },
    closeAgentAirlock() {
      this.$store.dispatch("ship/closeKeepAirlock");
    },
  },
});
</script>
