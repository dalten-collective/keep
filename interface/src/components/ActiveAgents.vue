<template>
  <div class="tw-w-screen">

    <div class="tw-flex tw-space-between tw-mb-4">
      <div class="tw-grow">
        <h3 class="tw-text-3xl tw-font-silom">Active Agents</h3>
      </div>
      <div>
        <v-btn
          :loading="activePending"
          :disabled="activePending"
          color="white"
          variant="tonal"
          class="tw-inline-block text-success"
          @click="getActive"
        >
          <v-icon start>mdi-cached</v-icon>
          refresh
        </v-btn>
      </div>
    </div>

    <div v-if="!agents || agents.length === 0">No keep agents on this ship</div>

    <div v-else>
      <div v-if="activeAgents.length === 0">No active agents</div>
      <div v-else v-for="agent in activeAgents" :key="agent" class="tw-my-2">
        <KeepAgent
          :agent-name="agent.agentName"
          class="tw-p-2 tw-my-4 tw-bg-white tw-border tw-rounded-keep"
        />
      </div>
    </div>

    <div v-if="agents && agents.length == 0">
      TODO: No agents recognized
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
      console.log("scrying ", this.scryApp, this.scryPath);
      const scry: Scry = { app: this.scryApp, path: this.scryPath };
      this.$store.dispatch("keep/scry", scry);
    },
    closeAgentAirlock() {
      this.$store.dispatch("ship/closeKeepAirlock");
    },

    getActive() {
      // TODO:
      this.activePending = true;
      setTimeout(() => {
        this.activePending = false;
      }, 400);
    },
  },
});
</script>
