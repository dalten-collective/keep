<template>
  <v-dialog v-model="restoreOpen" persistent max-width="500px">
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="success" text="white" @click="openRestore">
        <v-icon start>mdi-content-duplicate</v-icon>
        restore</v-btn
      >
    </template>
    <v-card class="tw-w-96 tw-border-4 tw-border-primary tw-bg-surface tw-p-4">
      <v-card-title>
        <div class="tw-flex tw-flex-row tw-justify-between">
          <h2 class="tw-text-2xl">Restore</h2>
          <div>
            <span
              @click="restoreOpen = !restoreOpen"
              class="tw-text-sm tw-cursor-pointer tw-underline"
              >Close</span
            >
          </div>
        </div>
      </v-card-title>

      <v-card-text>
        <div class="tw-mt-2">
          <section class="tw-my-2 tw-mb-4 tw-text-sm">

            <p class="tw-my-2">Double-check these details:</p>

            <div class="keep-info-items tw-grid-cols-3">
              <v-chip label color="surface" class="keep-info-label" size="small"
                >Agent</v-chip
              >
              <div class="keep-info-data">%{{ agentName }}</div>
            </div>
            <div class="keep-info-items tw-grid-cols-3">
              <v-chip label color="surface" class="keep-info-label" size="small"
                >Saved On</v-chip
              >
              <div class="keep-info-data">
                {{ lastBackupOn.toLocaleString() }}
              </div>
            </div>
            <div class="keep-info-items tw-grid-cols-3">
              <v-chip label color="surface" class="keep-info-label" size="small"
                >Source</v-chip
              >
              <div class="keep-info-data">
                {{ $filters.sigShip(ship) }}
              </div>
            </div>

            <v-alert class="tw-my-2" type="warning">
              Warning! This will replace %{{ agentName }}'s current state on
              {{ $filters.sigShip(ourShip) }} with the state saved by
              <span class="tw-font-mono">{{ $filters.sigShip(ship) }}</span>
            </v-alert>
          </section>

          <v-dialog v-model="confirmOpen" persistent max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                color="success"
                text="white"
                @click="confirmRestore"
                :loading="restorePending"
                :disabled="lastBackupSect === 0"
                >Restore</v-btn
              >
            </template>
            <v-card class="tw-bg-white">
              <v-card-title> Are you sure? </v-card-title>
              <v-card-text>
                <div class="tw-my-4">
                  If you confirm, your agent state will be replaced with the
                  backup version. Any changes you've made since the backup will
                  be lost.
                </div>

                <div class="tw-flex tw-justify-around tw-mt-4">
                  <v-btn @click="confirmOpen = false" flat class="mr-4"
                    >Wait, no. Cancel</v-btn
                  >
                  <v-btn
                    color="error"
                    text="white"
                    @click="restore"
                    :loading="restorePending"
                    :disabled="lastBackupSect === 0"
                    >I'm sure, Proceed!</v-btn
                  >
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>

          <div v-if="restorePending" class="tw-mt-2">
            <v-alert type="info" variant="tonal">
              Restore has started. You might notice your ship hanging while this
              completes... You can close this page - or watch.
            </v-alert>
          </div>
          <div v-if="showDone" class="tw-mt-2">
            <v-alert type="success" variant="tonal">
              Restore complete! Launch %{{ agentName }} to check.
            </v-alert>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MendPayload } from "../types";
import type { PropType } from "vue";
import { siggedShip } from "@/api/keep";

import { KeepAgentSubscriptionStatus, Ship } from "../types";

export default defineComponent({
  props: {
    ship: {
      type: String as PropType<Ship>,
      default: "",
    },
    agentName: {
      type: String,
      default: "",
    },
    status: {
      type: Object as PropType<KeepAgentSubscriptionStatus>,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      formValid: false,
      restoreOpen: false,
      restorePending: false,
      showDone: false,
      confirmOpen: false,
    };
  },

  watch: {
    restoreOpen(val: boolean) {
      if (!val) {
        // closing
        // reset things
        this.restorePending = false;
        this.showDone = false;
      }
    },
  },

  computed: {
    lastBackupSect() {
      if ("saved" in this.status && this.status.saved.length > 0) {
        return this.status.saved[0].time;
      }
      return 0;
    },
    lastBackupOn() {
      return this.$filters.sectToDate(this.lastBackupSect);
    },
  },

  mounted() {
    // this.newResourceName = this.resource
  },

  methods: {
    confirmRestore() {
      this.confirmOpen = true;
    },

    validateForm() {
      this.$refs.form.validate();
    },

    restore() {
      this.confirmOpen = false;
      this.restorePending = true;
      const mendPayload: MendPayload = { mend: siggedShip(this.ship) }
      const request = {
        payload: mendPayload,
        agentName: this.agentName,
      };
      this.$store.dispatch("keep/mendFromShip", request)
      .then((r) => {
        this.showDone = true;
      })
      .finally(() => {
        this.restorePending = false;
      })
    },
  },
});
</script>
