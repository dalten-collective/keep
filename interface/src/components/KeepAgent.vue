<template>
  <div>
    <header class="tw-mb-4 tw-flex tw-justify-between">
      <h3 class="tw-text-2xl">%{{ agentName }}</h3>
      <!-- DEBUG TODO: <v-btn @click="deactivateAgent">Deactivate</v-btn> -->
      <pre>wrapper {{ ourWrapperStatus }}</pre>
      <pre>agent {{ ourAgentStatus }}</pre>
    </header>

    <section class="tw-flex tw-flex-col">
      <article>
        <article
          class="tw-flex tw-flex-row tw-justify-between tw-mb-4 tw-border tw-rounded-keep tw-p-4"
        >
          <div class="tw-flex-grow">
            <v-tooltip location="top" v-if="diskBackup.auto.length > 0">
              <template v-slot:activator="{ props }">
                <v-chip
                  v-bind="props"
                  variant="outlined"
                  label
                  color="info"
                  class="mr-2"
                >
                  <span class="mr-2 tw-font-mono">Local Disk</span>
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
              <span class="mr-2 tw-font-mono">Local Disk</span>
            </v-chip>
          </div>

          <div class="tw-flex tw-flex-row tw-justify-end tw-flex-grow">
            <div class="tw-mr-2">
              <BackupButton
                :ship="null"
                :agent-name="agentName"
                :status="diskBackup"
              />
            </div>
            <v-btn @click="redirectToUpload" color="success">
              <v-icon start>mdi-content-duplicate</v-icon>
              restore
            </v-btn>
          </div>
        </article>

        <h4 class="tw-text-xl tw-mb-4">Live backup targets</h4>

        {{ backupsByShip }}

        <article class="tw-mt-6" v-if="backupsByShip.length == 0">
          <h3 class="tw-text-lg">No on-network backup targets configured</h3>
        </article>

        <article
          v-else
          v-for="target in backupsByShip"
          :key="target[0]"
          class="tw-flex tw-flex-row tw-justify-between tw-mb-4 tw-border tw-rounded-keep tw-p-4"
        >
          <div class="tw-flex-grow">
            <v-tooltip location="top" v-if="target[1].auto.length > 0">
              <template v-slot:activator="{ props }">
                <v-chip
                  v-bind="props"
                  variant="outlined"
                  label
                  color="info"
                  class="mr-2"
                >
                  <span class="mr-2 tw-font-mono">{{
                    $filters.sigShip(target[0])
                  }}</span>
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
              <span class="mr-2 tw-font-mono">{{
                $filters.sigShip(target[0])
              }}</span>
            </v-chip>
          </div>

          <div class="tw-flex tw-flex-row tw-justify-end tw-flex-grow">
            <div class="tw-mr-2">
              <BackupButton
                :ship="target[0]"
                :agent-name="agentName"
                :status="target[1]"
              />
            </div>
            <RestoreButton
              :ship="target[0]"
              :agent-name="agentName"
              :status="target[1]"
            />
          </div>
        </article>
      </article>

      <footer
        class="tw-flex tw-flex-col tw-justify-end tw-text-right tw-align-middle md:tw-mb-0"
      >
        <div>
          <AddBackupTargetButton :agent-name="agentName" />
        </div>
      </footer>

      <article v-if="pending.length > 0">
        <h4 class="my-2 tw-text-lg">Outstanding Invites</h4>
        <p class="my-2 tw-text-sm">
          You've initiated a backup to these ships, but they haven't yet
          responded. Either they don't have %keep installed or they haven't
          accepted your request yet.
        </p>
        <ul class="my-2 tw-list-disc">
          <li v-for="p in pending" :key="p.ship" class="tw-ml-4">
            <span class="tw-font-mono tw-italic tw-text-gray-400">{{
              $filters.sigShip(target.ship)
            }}</span>
            <!-- <v-btn>Remove</v-btn> -->
          </li>
        </ul>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import {
  BackupPayload,
  RestoreRequest,
  SavedStatus,
  AutoStatus,
  Ship,
} from "../types";

import BackupButton from "@/components/BackupButton.vue";
import RestoreButton from "@/components/RestoreButton.vue";
import AddBackupTargetButton from "@/components/AddBackupTargetButton.vue";

import { siggedShip } from "@/api/keep";

export default defineComponent({
  name: "KeepAgent",
  props: {
    agentName: {
      type: String,
      required: true,
    },
  },
  components: { BackupButton, RestoreButton, AddBackupTargetButton },
  data() {
    return {
      newTarget: "",
    };
  },
  computed: {
    ...mapGetters("keep", ["agents", "wrapperStatus", "agentStatus"]),
    ourWrapperStatus() {
      console.log("ourstatus ", this.wrapperStatus("gora"));
      const status = this.wrapperStatus(this.agentName);
      if (status) {
        return status;
      }
      return null;
    },

    ourAgentStatus() {
      return this.agentStatus("gora");
    },

    diskBackup() {
      return {
        auto: [],
        saved: [],
        pending: [],
      };
      // TODO

      // const status = {
      //   auto: this.ourStatus.auto.filter((s) => s.ship === null),
      //   saved: this.ourStatus.saved.filter((s) => s.ship === null),
      //   pending: this.ourStatus.pending
      //     .filter((s) => s.ship === null)
      //     .map((s) => s),
      // };

      // return status;
    },
    backupsByShip() {
      // return this.ourAgentStatus.saved.filter((s: SavedStatus) => {
      //   return s.ship !== null;
      // })

      // return AgentStatus items for this agent
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

      let ship: null | Ship;
      this.ourAgentStatus.saved.forEach((s: SavedStatus) => {
        if (s.ship) {
          ship = s.ship;
        } else {
          ship = null;
        }
        shipList.add(ship);
      });
      this.ourAgentStatus.auto.forEach((s: SavedStatus) => {
        if (s.ship) {
          ship = s.ship;
        } else {
          ship = null;
        }
        shipList.add(ship);
      });
      const status: Array<Array<Ship | { auto: AutoStatus; saved: SavedStatus; }>> = [];

      shipList.forEach((ship) => {
        const shipStatus: { auto: AutoStatus; saved: SavedStatus } = {
          auto: this.ourAgentStatus.auto
            .filter((a: AutoStatus) => a.ship === ship)
            .map((a: AutoStatus) => {
              return { freq: a.freq };
            }),
          saved: this.ourAgentStatus.saved
            .filter((s: SavedStatus) => s.ship === ship)
            .map((s: SavedStatus) => {
              return { time: s.time };
            }),
        };
        status.push([ship, shipStatus]);
      });

      if (status.length > 0) {
        // First remove 'us' / null / local disk
        return status
          .filter((s) => s[0] !== null)
          .sort((a, b) => {
            // compare lengths (ship type)
            if (a[0].length < b[0].length) {
              return -1;
            }
            if (a[0].length > b[0].length) {
              return 1;
            }

            // Then order recurring to the top
            if (a[1].auto.length > 0) {
              return -1;
            }
            if (a[1].auto.length === 0) {
              return 1;
            }

            // then alphabetize
            if (a[0] < b[0]) {
              return -1;
            }
            if (a[0] > b[0]) {
              return 1;
            }

            return 0;
          });
      } else {
        return [];
      }
    },

    pending() {
      return false;
      // TODO: how pending?
      // return this.ourStatus.pending;
    },
  },
  methods: {
    redirectToUpload() {
      const locationString = window.location.toString();
      const baseURL = locationString.endsWith("/")
        ? locationString.slice(0, -1)
        : locationString;
      const redirectLocation = `${baseURL}/${this.agentName}/upload`;
      window.open(redirectLocation, "_blank");
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
