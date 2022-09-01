<template>
  <div>
    Messages:
    {{ messages }}
  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    ...mapState("message", ["messages"]),
  },
});
</script>
