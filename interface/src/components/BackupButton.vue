<template>
  <v-dialog v-model="backupOpen">
    <template v-slot:activator="{ props }">

      <v-hover v-if="isRecurringBackup" v-slot="{ isHovering, props }">
        <v-btn
          v-bind="props" color="success"
          text="white"
          @click="openBackup"
          v-if="isHovering"
        >
          <v-icon start>mdi-content-save</v-icon>
          Backup once or change frequency
        </v-btn>
        <v-btn
          v-bind="props" color="success"
          text="white"
          @click="openBackup"
          v-else
        >
          <v-icon start>mdi-cached</v-icon>
          exporting frequently
        </v-btn>
      </v-hover>

      <v-btn
        v-else
        v-bind="props" color="success"
        text="white"
        @click="openBackup"
      >
        <v-icon start>mdi-content-save</v-icon>
        backup
      </v-btn>

    </template>

    <v-card class="tw-w-96 tw-border-4 tw-border-primary tw-bg-surface tw-p-4">
      <v-card-title>
        <div class="tw-flex tw-flex-row tw-justify-between">
          <h2 class="tw-text-2xl">Backup</h2>
          <div>
            <span
              @click="backupOpen = !backupOpen"
              class="tw-text-sm tw-cursor-pointer tw-underline"
              >Close</span
            >
          </div>
        </div>
      </v-card-title>

    <input
      type="text"
      placeholder="ship to backup/restore with"
      v-model="backupShip"
    />
    <button @click="testOnce()">Test Once</button>
    <button @click="testRestore()">Test Restore</button>
    <br />
    <input
      type="text"
      placeholder="ship to backup to"
      v-model="backupShip"
    />
    <input type="number" placeholder="frequency" v-model="freq" />
    <button @click="testMany()">Test Many</button>
    <button @click="unsetMany()">Unset Many</button>

      <v-card-text>
        <div class="tw-mt-2">
          <div class="tw-mb-2">
            <span class="tw-font-bold">One-time export</span>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="x-small"
                  class="tw-ml-1 tw-cursor-pointer tw-mb-2 tw-opacity-50"
                  >mdi-help-circle-outline</v-icon
                >
              </template>
              <span
                >TODO:
              </span>
            </v-tooltip>
          </div>
          <div>
            <div class="tw-my-2">
              <span class="tw-italic">Backup <span class="tw-font-mono tw-not-italic">TODO: ship</span>'s TODO: agent once</span>
            </div>
            <v-btn color="success" text="white" :loading="backupPending" @click="singleBackup">
              Backup
            </v-btn
            >
          </div>
        </div>

        <hr class="tw-my-4" />

        <div>
          <div class="tw-mb-2">
            <span class="tw-font-bold">Recurring backups</span>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="x-small"
                  class="tw-ml-1 tw-cursor-pointer tw-mb-2 tw-opacity-50"
                  >mdi-help-circle-outline</v-icon
                >
              </template>
              <span>TODO:</span>
            </v-tooltip>
          </div>

          <v-form>
              <v-row>
                <v-col cols="12">
                  <v-select
                    :items="daysOptions"
                    label="Days"
                    v-model="frequencyDays"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-select
                    :items="hoursOptions"
                    label="Hours"
                    v-model="frequencyHours"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-select
                    :items="minutesOptions"
                    label="Minutes"
                    v-model="frequencyMinutes"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>

              <div>
                <div class="tw-my-4">
                  <div>
                    <span class="tw-mr-2">{{ displayFrequency }}</span>
                    <span class="tw-text-gray-400">({{ hoonedFrequcency }})</span>
                  </div>
                </div>
                <div class="tw-mb-1">
                  <v-btn color="success" :loading="backupPending" text="white" @click="frequentBackup">
                    Backup frequently
                  </v-btn>
                </div>
              </div>
              <div v-if="backupPending">
                <v-alert type="info" variant="tonal">
                  Backup has started. You might notice your ship hanging while this completes... You can close this page - or watch.
                </v-alert>
              </div>
              <div v-if="showDone">
                <v-alert type="success" variant="tonal">
                  Backup complete! Check your 
                  <span class="tw-font-mono">.urb/put/{{ship}}/{{ resource }}.</span> directory.
                </v-alert>
              </div>
          </v-form>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import type { PropType } from "vue";

import {
  OnceRequest,
  ManyRequest,
  UnsetManyRequest,
  RestoreRequest,
  KeepAgentSubscriptionStatus,
} from "../types";

export default defineComponent({
  // props: ["resource", "ship"],
  props: {
    backupStatus: {
      type: Object as PropType<KeepAgentSubscriptionStatus>,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      backupShip: "",
      freq: 100,
      backupOpen: false,
      backupPending: false,
      showDone: false,
      frequencyDays: 0,
      frequencyHours: 12,
      frequencyMinutes: 30,
    };
  },

  watch: {
    backupOpen(val) {
      if (!val) { // closing
        // reset things
        this.backupPending = false;
        this.showDone = false;
      }
    },
  },

  computed: {
    // ...mapGetters("peat", ["isRecurringSaved"]),
    isRecurringBackup() {
      if (this.backupStatus.auto.length > 0) {
        return true;
      }
      return false;
    },

    daysOptions(): Array<number> {
      return [0].concat(
        Array(30)
          .fill(1)
          .map((x, y) => x + y)
      );
    },
    hoursOptions(): Array<number> {
      return [0].concat(
        Array(24)
          .fill(1)
          .map((x, y) => x + y)
          .filter((x) => x >= 12)
      );
    },
    minutesOptions(): Array<number> {
      return [0].concat(
        Array(60)
          .fill(1)
          .map((x, y) => x + y)
      );
    },
    displayFrequency(): string {
      if (this.frequencyDays || this.frequencyHours || this.frequencyMinutes) {
        const days = this.frequencyDays
          ? `${this.frequencyDays} day${this.frequencyDays == 1 ? "" : "s"}`
          : "";
        const hours = this.frequencyHours
          ? `${this.frequencyHours} hour${this.frequencyHours == 1 ? "" : "s"}`
          : "";
        const minutes = this.frequencyMinutes
          ? `${this.frequencyMinutes} minute${
              this.frequencyMinutes == 1 ? "" : "s"
            }`
          : "";
        return `Every ${days} ${hours} ${minutes}`;
      } else {
        return "";
      }
    },

    hoonedFrequcency(): string {
      return this.formatFreqAsHoon({
        days: this.frequencyDays,
        hours: this.frequencyHours,
        minutes: this.frequencyMinutes
      })
    },
  },

  methods: {
    openBackup() {
      this.backupOpen = true;
    },

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

    formatFreqAsHoon(freq: { days: number, minutes: number, hours: number }) {
      const d = freq.days ? `${"d" + freq.days}` : "";
      const h = freq.hours ? `${"h" + freq.hours}` : "";
      const m = freq.minutes
        ? `${"m" + freq.minutes}`
        : "";
      const worm = [d, h, m].filter(Boolean); // trim out empties
      return `~${worm.join(".")}`;
    },

    singleBackup() {
      this.backupPending = true;
      // TODO:
      const payload = {
        // resource: {
        //   entity: this.ship,
        //   name: this.resource,
        // },
        frequency: "fuck-you",
      };
      // TODO:
      this.backupPending = false;
      // this.$store.dispatch("peat/exportResource", payload)
      //   .then((r) => {
      //   }).finally(() => {
      //     this.backupPending = false;
      //     this.showDone = true;
      //   });
    },

    frequentBackup() {
      this.backupPending = true;
      const payload = {
        // resource: {
        //   entity: this.ship,
        //   name: this.resource,
        // },
        frequency: this.hoonedFrequcency,
      };
      // TODO:
      this.backupPending = false;
      // this.$store.dispatch("peat/exportResource", payload)
      //   .then((r) => {
      //   }).finally(() => {
      //     this.backupPending = false;
      //     this.showDone = true;
      //     // TODO: update the `saved` with this new guy?
      //   });
    },
  },
});
</script>
