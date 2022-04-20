<template>
  <div>
    Keep
    <pre>
      agents: {{ agents }}
    </pre>
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
});
</script>
