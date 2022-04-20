<template>
  <div>
    Keep
    <pre>
      agents: {{ agents }}
    </pre>
    <button @click="testBackup">Test Backup</button>
    <button @click="testRestore">Test Restore</button>
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
    testBackup() {
      console.log('backing up')
      this.$store.dispatch("keep/testBackup");
    },
    testRestore() {
      console.log('restoring')
      this.$store.dispatch("keep/testRestore");
    },
  },
});
</script>
