<template>
  <div>
    Keep
    <div v-for="agent in agents">
      <h3>{{ agent }}</h3>
      <button @click="testBackup(agent)">Test Backup</button>
      <button @click="testRestore(agent)">Test Restore</button>
    </div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { mapGetters } from "vuex";

export default defineComponent({
  name: "Home",
  components: {},
  computed: {
    ...mapGetters("keep", ["agents"]),
  },
  methods: {
    testBackup(agent) {
      console.log('backing up')
      this.$store.dispatch("keep/testBackup", { agentName: agent });
    },
    testRestore(agent) {
      console.log('restoring')
      this.$store.dispatch("keep/testRestore", { agentName: agent });
    },
  },
});
</script>
