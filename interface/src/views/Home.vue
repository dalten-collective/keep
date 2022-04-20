<template>
  <div>
    Keep
    <pre>
      agents: {{ agents }}
    </pre>
    <button @click="testPoke">Test Poke</button>
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
    testPoke() {
      this.$store.dispatch("keep/testPoke")
    },
  },
});
</script>
