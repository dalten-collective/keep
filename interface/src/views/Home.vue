<template>
  <div>
    <h1>Keep</h1>

    <div v-if="!agents || agents.length === 0">No keep agents on this ship</div>

    <div v-else>
      <h2>Wrappers Active</h2>
      <div v-if="activeAgents.length === 0">No active agents</div>
      <div v-else v-for="agent in activeAgents" :key="agent">
        <KeepAgent
          :agent-name="agent.agentName"
          style="border: 1px solid black; padding: 1em"
        />
      </div>

      <hr />
      <h2>Wrappers Inactive</h2>
      <div v-if="inactiveAgents.length === 0">No inactive agents</div>
      <div v-else v-for="agent in inactiveAgents" :key="agent">
        <KeepAgent
          :agent-name="agent.agentName"
          style="border: 1px dashed black; padding: 1em"
        />
      </div>
    </div>

    <div v-if="agents && agents.length > 0"></div>

    <hr />
    <input type="text" v-model="agentToActivate" />
    <br />
    <input type="text" placeholder="scry app" v-model="scryApp" />
    <input type="text" placeholder="scry path" v-model="scryPath" />
    <button @click="testScry">
      Scry (to {{ scryApp }} with {{ scryPath }})
    </button>
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
    ...mapGetters("keep", ["agents", "activeAgents", "inactiveAgents"]),
  },
  data() {
    return {
      scryApp: "",
      scryPath: "",
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
  },
});
</script>
