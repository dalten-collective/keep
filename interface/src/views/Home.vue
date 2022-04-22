<template>
  <div>
    <h1>Keep</h1>
    <div v-if="agents.length > 0">
      <div v-for="agent in agents" :key="agent">
        <h3>{{ agent }}</h3>
        <button @click="testBackup(agent)">Test Backup</button>
        <button @click="testRestore(agent)">Test Restore</button>
      </div>
    </div>
    <div v-else>No keep agents on this ship</div>
    <hr />
    <input type="text" v-model="agentToActivate" />
    <button @click="activateAgent">Activate {{ agentToActivate }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { mapGetters } from "vuex";

export default defineComponent({
  name: "HomeView",
  components: {},
  computed: {
    ...mapGetters("keep", ["agents"]),
  },
  data() {
    return {
      agentToActivate: "gora",
    };
  },
  methods: {
    testBackup(agent) {
      console.log("backing up");
      this.$store.dispatch("keep/testBackup", { agentName: agent });
    },
    testRestore(agent) {
      console.log("restoring");
      this.$store.dispatch("keep/testRestore", { agentName: agent });
    },
    activateAgent() {
      console.log("activating");
      this.$store.dispatch("keep/activate", {
        agentName: this.agentToActivate,
      });
    },
  },
});
</script>
