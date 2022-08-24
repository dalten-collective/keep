<template>
  <div>
    {{ backupsByShip }}
    <header class="tw-mb-4">
      <h3 class="tw-text-2xl">{{ agentName }}</h3>
    </header>

    <section class="tw-flex tw-flex-col">
      <article>
        <h4 class="tw-text-lg">Live backup targets</h4>

        <article v-if="backupsByShip.length == 0">
          No backup targets configured
        </article>

        <article
          v-else
          v-for="target in backupsByShip"
          :key="target[0]"
          class="tw-flex tw-flex-row tw-justify-between tw-mb-4 tw-border tw-border-peat tw-p-4"
        >
          <div>
            <v-tooltip location="top" v-if="target[1].auto.length > 0">
              <template v-slot:activator="{ props }">
                <v-chip
                  v-bind="props"
                  variant="outlined"
                  label
                  color="info"
                  class="mr-2"
                >
                  <span class="mr-2 tw-font-mono">~{{ target[0] }}</span>
                  <v-icon color="info"> mdi-cached </v-icon>
                </v-chip>
              </template>
              <span>Recurring backups enabled</span>
            </v-tooltip>
            <v-chip
              v-else
              v-bind="props"
              variant="outlined"
              label
              color="info"
              class="mr-2"
            >
              ~{{ target[0] }}
            </v-chip>
          </div>
          <div>
            <BackupButton :ship="target[0]" :agent-name="agentName" :status="target[1]" />
          </div>
        </article>
      </article>
    </section>

    <footer class="tw-flex tw-flex-col md:tw-flex-row tw-justify-between">
      <div class="tw-flex tw-flex-col tw-align-middle tw-mb-4 md:tw-mb-0">
        <!--
        <BackupButton :backup-status="ourStatus" />
        -->
      </div>
      <RestoreButton />
    </footer>

    <v-text-field
      v-model="newTarget"
    >
    </v-text-field>
    <v-btn @click="doOnce">backup</v-btn>

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
    return {
      newTarget: '',
    };
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
    backupsByShip() {
      const shipList = new Set();
      // TODO: test structure:
      // const ourStatus = {
      //   auto: [
      //     { freq: 1000, ship: "zod" },
      //     { freq: 9000, ship: "sum" },
      //   ],
      //   saved: [
      //     { ship: "zod", time: 1660857853 },
      //     { ship: "sum", time: 9999999999 },
      //   ],
      // };

      this.ourStatus.saved.forEach((s) => {
        shipList.add(s.ship);
      });
      this.ourStatus.auto.forEach((s) => {
        shipList.add(s.ship);
      });
      const status = [];

      shipList.forEach((ship) => {
        const shipStatus = {
          auto: this.ourStatus.auto
            .filter((a) => a.ship === ship)
            .map((a) => {
              return { freq: a.freq };
            }),
          saved: this.ourStatus.saved
            .filter((s) => s.ship === ship)
            .map((s) => {
              return { time: s.time };
            }),
        };
        status.push([ship, shipStatus]);
      });

      return status;
    },
  },
  methods: {
    doOnce() {
      const request: OnceRequest = {
        agentName: 'keep', // TODO: why this?
        ship: this.newTarget,
      };
      this.$store.dispatch("keep/testOnce", request);
    },

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
