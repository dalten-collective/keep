<template>
  <div>
    <header class="tw-mb-4 tw-flex tw-justify-between">
      <h3 class="tw-text-2xl">%{{ agentName }}</h3>
      <!-- DEBUG TODO: <v-btn @click="deactivateAgent">Deactivate</v-btn> -->
    </header>

    <section v-if="!live" class="tw-flex tw-flex-col">
      <v-btn color="success" v-if="!live" @click="activateAgent"
        >Activate</v-btn
      >
    </section>

    <section v-else class="tw-flex tw-flex-col">
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
            <RestoreButton
              :ship="null"
              :status="diskBackup"
              :agent-name="agentName"
            />
          </div>
        </article>

        <h4 class="tw-text-xl tw-mb-4">Live backup targets</h4>

        <article class="tw-mt-6" v-if="backupsByShip.length == 0">
          <h3 class="tw-text-lg">
            No on-network backup targets configured
          </h3>
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
              :status="target[1]"
              :agent-name="agentName"
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
          responded. Either they don't have %keep installed or they
          haven't accepted your request yet.
        </p>
        <ul class="my-2 tw-list-disc">
          <li v-for="p in pending" :key="p.ship" class="tw-ml-4">
            <span class="tw-font-mono tw-italic tw-text-gray-400">{{
              $filters.sigShip(p.ship)
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
  OnceRequest,
  ManyRequest,
  UnsetManyRequest,
  RestoreRequest,
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
    inactive: {
      type: Boolean,
      default: false,
    },
  },
  components: { BackupButton, RestoreButton, AddBackupTargetButton },
  data() {
    return {
      newTarget: "",
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
    diskBackup() {
      const status = {
        auto: this.ourStatus.auto.filter((s) => s.ship === null),
        saved: this.ourStatus.saved.filter((s) => s.ship === null),
        pending: this.ourStatus.pending.filter((s) => s.ship === null).map((s) => s),
      };

      return status;
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
        let ship;
        if (s.ship) {
          ship = s.ship;
        } else {
          ship = this.ourShip;
        }
        shipList.add(ship);
      });
      this.ourStatus.auto.forEach((s) => {
        let ship;
        if (s.ship) {
          ship = s.ship;
        } else {
          ship = this.ourShip;
        }
        shipList.add(ship);
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

      return status.sort((a, b) => {
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
    },

    pending() {
      return this.ourStatus.pending;
    },
  },
  methods: {
    doLocalBackup() {
      const request: LocalBackupRequest = {
        agentName: this.agentName,
      };
      this.$store.dispatch("keep/backupLocal", request);
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
