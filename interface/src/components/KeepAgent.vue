<template>
  <div>
    <h3>{{ agentName }}</h3>
    <pre>
      {{ ourStatus }}
    </pre>
    <input type="text" placeholder="ship to backup/restore with" v-model="backupShip" />
    <button @click="testOnce()">Test Once</button>
    <button @click="testRestore()">Test Restore</button>
    <br/>
    <input type="text" placeholder="ship to backup to" v-model="backupShip" />
    <input type="number" placeholder="frequency" v-model="freq" />
    <button @click="testMany()">Test Many</button>
    <button @click="unsetMany()">Unset Many</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import { OnceRequest, ManyRequest, UnsetManyRequest, RestoreRequest } from "@/types";

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
      freq: 100,
    };
  },
  computed: {
    ...mapGetters("keep", ["agents", "agentStatus"]),
    ourStatus(): string {
      return this.agentStatus(this.agentName);
    },
  },
  methods: {
    testOnce() {
      const request: OnceRequest = {
        agentName: this.agentName,
        ship: this.backupShip,
      };
      this.$store.dispatch("keep/testOnce", request);
    },
    testMany() {
      const request: ManyRequest = {
        agentName: this.agentName,
        ship: this.backupShip,
        freq: this.freq,
      };
      this.$store.dispatch("keep/testMany", request);
    },
    unsetMany() {
      const request: UnsetManyRequest = {
        agentName: this.agentName,
        ship: this.backupShip,
        freq: null,
      };
      this.$store.dispatch("keep/testMany", request);
    },
    testRestore() {
      const request: RestoreRequest = {
        agentName: this.agentName,
        ship: this.backupShip,
      };
      this.$store.dispatch("keep/testRestore", request);
    },
  },
});
</script>
