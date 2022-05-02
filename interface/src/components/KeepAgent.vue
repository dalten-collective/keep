<template>
  <div>
    <h3>{{ agentName }}</h3>
    <pre>
      {{ ourStatus }}
    </pre>
    <input type="text" placeholder="ship to backup to" v-model="backupShip" />
    <button @click="testBackup(agent)">Test Backup</button>
    <button @click="testRestore(agent)">Test Restore</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";

export default defineComponent({
  name: "KeepAgent",
  props: {
    agentName: {
      type: String,
      required: true,
    },
  },
  components: {},
  data() {
    return {
      backupShip: "",
    };
  },
  computed: {
    ...mapGetters("keep", ["agents", "agentStatus"]),
    ourStatus() {
      return this.agentStatus(this.agentName);
    },
  },
  methods: {
    testBackup() {
      console.log("backing up");
      this.$store.dispatch("keep/testBackup", {
        agentName: this.agentName,
        ship: this.backupShip,
      });
    },
    testRestore() {
      console.log("restoring");
      this.$store.dispatch("keep/testRestore", {
        agentName: this.agentName,
        ship: this.backupShip,
      });
    },
  },
});
</script>
