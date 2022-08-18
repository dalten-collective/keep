<template>
  <div>
    <h3 class="tw-text-2xl">{{ agentName }}</h3>
    <section class="tw-flex tw-flex-col">
      <div v-if="ourStatus.saved.length > 0">
        {{ ourStatus.saved }}
      </div>
      <div v-if="ourStatus.auto.length > 0">
        auto status: {{ ourStatus.auto }}
      </div>
      <div v-if="ourStatus.pending.length > 0">
        pending status: {{ ourStatus.pending }}
      </div>
    </section>
    <footer class="tw-flex tw-flex-col md:tw-flex-row tw-justify-between">
      <div class="tw-flex tw-flex-col tw-align-middle tw-mb-4 md:tw-mb-0">
        <BackupButton :backupStatus="ourStatus" />
      </div>
      <RestoreButton />
    </footer>
    <v-btn v-if="!live" @click="activateAgent">Activate</v-btn>
    <v-btn v-else @click="deactivateAgent">Deactivate</v-btn>
    <br />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import {
  OnceRequest,
  ManyRequest,
  UnsetManyRequest,
  RestoreRequest,
} from "../types";

import BackupButton from "@/components/BackupButton.vue";
import RestoreButton from "@/components/RestoreButton.vue";

export default defineComponent({
  name: "KeepAgent",
  props: {
    agentName: {
      type: String,
      required: true,
    },
  },
  components: { BackupButton, RestoreButton },
  data() {
    return {};
  },
  computed: {
    ...mapGetters("keep", ["agents", "agentStatus"]),
    ourStatus() {
      const status = this.agentStatus(this.agentName);
      if (status) {
        return status;
      }
      return null;
    },
    live() {
      if (!this.ourStatus) {
        return false;
      }
      return !!this.ourStatus.live;
    },
  },
  methods: {
    activateAgent() {
      console.log("activating");
      this.$store.dispatch("keep/activate", {
        agentName: this.agentName,
      });
    },
    deactivateAgent() {
      console.log("deactivating");
      this.$store.dispatch("keep/deactivate", {
        agentName: this.agentName,
      });
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
