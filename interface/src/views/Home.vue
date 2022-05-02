<template>
  <div>
    <h1>Keep</h1>
    <div v-if="agents && agents.length > 0">
      <div v-for="agent in agents" :key="agent">
        <KeepAgent :agentName="agent" />
      </div>
    </div>
    <div v-else>No keep agents on this ship</div>
    <hr />
    <input type="text" v-model="agentToActivate" />
    <button @click="activateAgent">Activate {{ agentToActivate }}</button>
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

import KeepAgent from "@/components/KeepAgent.vue"

export default defineComponent({
  name: "HomeView",
  components: {
    KeepAgent,
  },
  computed: {
    ...mapGetters("keep", ["agents"]),
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
    // TODO: remove
    // activateAgent() {
    //   console.log("activating");
    //   this.$store.dispatch("keep/activate", {
    //     agentName: this.agentToActivate,
    //   });
    // },
  },
});
</script>
