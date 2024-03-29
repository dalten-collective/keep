<template>
  <v-dialog v-model="backupOpen" fullscreen :scrim="false" scrollable>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="success" text="white" @click="openBackup">
        <v-icon start>mdi-content-save</v-icon>
        Backup
      </v-btn>
    </template>

    <v-card class="tw-w-96 tw-border-4 tw-border-primary tw-bg-white tw-p-4">
      <v-card-title>
        <div class="tw-flex tw-flex-row tw-justify-between">
          <h2 class="tw-text-2xl">Backup <span v-if="!ship">to disk</span></h2>
          <div>
            <span
              @click="backupOpen = !backupOpen"
              class="tw-text-sm tw-cursor-pointer tw-underline"
              >Close</span
            >
          </div>
        </div>
      </v-card-title>

      <v-card-text>
        <div class="tw-mt-2">
          <section class="tw-my-2 tw-mb-4 tw-text-sm">
            <p v-if="ship" class="tw-mb-2">
              Settings for %{{ agentName }}'s backups with
              <span v-if="ship" class="tw-font-mono">{{
                $filters.sigShip(ship)
              }}</span>
            </p>
            <p v-else class="tw-mb-2">
              Settings for %{{ agentName }}'s backups to local disk
            </p>

            <section v-if="isRecurringBackup || haveSaved" class="tw-my-2">
              <article class="tw-border tw-rounded-keep tw-p-4 tw-mb-4">
                <div class="keep-info-items">
                  <v-chip
                    label
                    color="surface"
                    class="keep-info-label"
                    size="small"
                    >Last backup</v-chip
                  >
                  <!-- not sure why this guard is needed: -->
                  <div
                    class="keep-info-data"
                    v-if="status.saved && status.saved[0]"
                  >
                    {{
                      $filters.sectToDate(status.saved[0].time).toLocaleString()
                    }}
                  </div>
                </div>

                <div class="keep-info-items" style="max-width: 46rem">
                  <v-chip
                    label
                    color="surface"
                    class="keep-info-label"
                    size="small"
                    >Recurring</v-chip
                  >
                  <div class="keep-info-data">
                    <span v-if="isRecurringBackup">
                      {{ autoBackupPrint }}
                    </span>
                    <span v-else> Not performing automatic backups </span>
                  </div>
                </div>

                <div
                  class="keep-info-items"
                  style="max-width: 46rem"
                >
                  <v-chip
                    label
                    color="surface"
                    class="keep-info-label"
                    size="small"
                    >Destination</v-chip
                  >
                  <div class="keep-info-data">
                  <span v-if="!ship" class="tw-font-mono"
                      >.urb/put/keep/{{ agentName }}</span
                    >
                  <span v-if="ship" class="tw-font-mono">{{
                    $filters.sigShip(ship)
                  }}</span>
                  </div>
                </div>
              </article>
            </section>
          </section>

          <section
            class="tw-mb-2 tw-bg-surface tw-rounded-keep tw-shadow-inner tw-p-4"
          >
            <h4 class="tw-text-lg tw-mb-2">One-time backup</h4>
            <div v-if="ship" class="tw-flex tw-flex-col sm:tw-flex-row">
              <div class="mr-4 sm:tw-mb-0 tw-mb-4">
                <v-btn
                  color="success"
                  text="white"
                  :loading="backupPending || autoSetPending"
                  :disabled="backupPending || autoSetPending"
                  @click="backupOnce"
                >
                  Backup Once
                </v-btn>
              </div>
              <div class="tw-mb-2">
                <p>
                  Backup %{{ agentName }} to
                  <span class="tw-font-mono">{{ $filters.sigShip(ship) }}</span>
                  one time, now.
                </p>
                <p v-if="isRecurringBackup">
                  Since you already have recurring backups enabled, this will
                  also re-start the frequency timer from right now.
                </p>
              </div>
            </div>
            <div v-else class="tw-flex tw-flex-col sm:tw-flex-row">
              <div class="mr-4 sm:tw-mb-0 tw-mb-4">
                <v-btn
                  color="success"
                  text="white"
                  :loading="backupPending || autoSetPending"
                  :disabled="backupPending || autoSetPending"
                  @click="doLocalBackup"
                >
                  Backup to Disk
                </v-btn>
              </div>
              <div class="tw-mb-2">
                <p>Backup %{{ agentName }} to local disk one time, now.</p>
                <p v-if="isRecurringBackup">
                  Since you already have recurring backups enabled, this will
                  also re-start the frequency timer from right now.
                </p>
              </div>
            </div>

            <hr class="tw-my-4" />

            <h4 class="tw-text-lg tw-mb-2">Recurring backup</h4>
            <v-form
              ref="recurringForm"
              v-model="recurringValid"
              class="tw-flex tw-flex-col"
            >
              <div v-if="ship">
                <div class="tw-my-2 tw-flex tw-flex-row">
                  <template v-if="isRecurringBackup">
                    Currently backing up {{ autoBackupPrint }}.
                  </template>
                  <template v-else>
                    Not backing up on a schedule yet.
                  </template>
                </div>
                <div class="tw-flex tw-flex-col tw-flex-col-reverse sm:tw-flex-row">
                  <div class="sm:mr-4">
                    <v-btn
                      color="success"
                      text="white"
                      :loading="backupPending || autoSetPending"
                      @click="testMany"
                      :disabled="
                        backupPending || autoSetPending || !recurringValid
                      "
                    >
                      <template v-if="isRecurringBackup">
                        Change Frequency
                      </template>
                      <template v-else> Set Recurring backup </template>
                    </v-btn>
                  </div>
                  <div class="tw-flex-grow">
                    <v-text-field
                      label="Frequency (seconds)"
                      v-model="freq"
                      :rules="[
                        (v) => !!v || 'Required',
                        (v) => v >= 120 || 'Must be at least 120',
                      ]"
                    />
                  </div>
                  <div class="tw-flex-grow"></div>
                </div>

                <div v-if="isRecurringBackup" class="sm:tw-mt-0 tw-mt-4">
                  <v-btn color="success" @click="unsetMany"
                    >Stop recurring backups</v-btn
                  >
                </div>
              </div>

              <div v-else>
                <div class="tw-my-2 tw-flex tw-flex-row">
                  <template v-if="isRecurringBackup">
                    Currently backing up {{ autoBackupPrint }}.
                  </template>
                  <template v-else>
                    Not backing up to disk on a schedule yet.
                  </template>
                </div>
                <div class="tw-flex tw-flex-col tw-flex-col-reverse sm:tw-flex-row">
                  <div class="sm:mr-4">
                    <v-btn
                      color="success"
                      text="white"
                      :loading="backupPending || autoSetPending"
                      @click="doLocalBackupMany"
                      :disabled="
                        backupPending || autoSetPending || !recurringValid
                      "
                    >
                      <template v-if="isRecurringBackup">
                        Change Frequency
                      </template>
                      <template v-else> Set Recurring disk backup</template>
                    </v-btn>
                  </div>

                  <div class="tw-flex-grow">
                    <v-text-field
                      label="Frequency (seconds)"
                      v-model="freq"
                      :rules="[
                        (v) => !!v || 'Required',
                        (v) => v >= 120 || 'Must be at least 120',
                      ]"
                    />
                  </div>
                  <div class="tw-flex-grow"></div>
                </div>

                <div v-if="isRecurringBackup" class="sm:tw-mt-0 tw-mt-4">
                  <v-btn color="success" @click="unsetLocalMany"
                    >Stop recurring backups</v-btn
                  >
                </div>
              </div>
            </v-form>

            <div>
              <div v-if="backupPending">
                <v-alert type="info" variant="tonal">
                  Backup has started. You might notice your ship hanging while
                  this completes... You can close this page - or watch.
                </v-alert>
              </div>
              <div v-if="showDone">
                <v-alert type="success" variant="tonal">
                  <span v-if="ship"> Backup request sent! </span>
                  <span v-else>
                    Backup to disk complete! Check
                    <span class="tw-font-mono"
                      >.urb/put/keep/{{ agentName }}</span
                    >
                  </span>
                </v-alert>
              </div>
              <div v-if="autoSetPending">
                <v-alert type="info" variant="tonal">
                  Recurring backup has started. You might notice your ship
                  hanging while this completes... You can close this page - or
                  watch.
                </v-alert>
              </div>
              <div v-if="autoOffPending">
                <v-alert type="info" variant="tonal">
                  Turning off automatic backups...
                </v-alert>
              </div>
              <div v-if="showAutoSetDone">
                <v-alert type="success" variant="tonal">
                  Recurring backups set!
                  <span v-if="!ship">
                    Check
                    <span class="tw-font-mono"
                      >.urb/put/keep/{{ agentName }}</span
                    >
                  </span>
                </v-alert>
              </div>
              <div v-if="showAutoOffDone">
                <v-alert type="success" variant="tonal">
                  Recurring backups turned off!
                </v-alert>
              </div>
            </div>
          </section>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapGetters } from "vuex";
import type { PropType } from "vue";
import { siggedShip } from "@/api/keep";

import {
  OnceRequest,
  ManyRequest,
  UnsetManyRequest,
  RestoreRequest,
  KeepAgentSubscriptionStatus,
  PendingStatus,
  SavedStatus,
  ManyPayload,
  BackupPayload,
  Ship,
} from "../types";

interface TargetStatus {
  pending: Array<PendingStatus>;
  saved: Array<SavedStatus>;
}

export default defineComponent({
  props: {
    ship: {
      type: String as PropType<Ship> | null,
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
      backupShip: "",
      freq: "",
      backupOpen: false,
      backupPending: false,
      showDone: false,
      recurringValid: false,
      autoSetPending: false,
      showAutoSetDone: false,
      autoOffPending: false,
      showAutoOffDone: false,
    };
  },

  mounted() {
    if (this.isRecurringSaved) {
      this.freq = this.status.auto[0].freq;
    }
  },

  watch: {
    backupOpen(val) {
      if (!val) {
        // closing
        // reset things
        this.backupPending = false;
        this.showDone = false;
        this.showAutoSetDone = false;
        this.autoSetPending = false;
        this.showAutoOffDone = false;
      } else {
        this.backupShip = this.ship;
      }
    },
    isRecurringSaved(is) {
      if (is) {
        this.freq = this.status.auto[0].freq;
      }
    },
  },

  computed: {
    // ...mapGetters("peat", ["isRecurringSaved"]),
    haveFreq() {
      if (this.isRecurringBackup) {
        return this.status.auto[0].freq;
      }
      return 240;
    },
    isRecurringBackup() {
      if ("auto" in this.status && this.status.auto.length > 0) {
        return true;
      }
      return false;
    },
    haveSaved() {
      if ("saved" in this.status && this.status.saved.length > 0) {
        return true;
      }
      return false;
    },

    autoBackupPrint() {
      if (!this.isRecurringBackup) {
        return "";
      }
      return `every ${this.status.auto[0].freq} seconds`;
    },
  },

  methods: {
    validateRecurring() {
      this.$refs.recurringForm.validate();
    },

    doLocalBackup() {
      const payload: BackupPayload = {
        once: {
          from: this.agentName,
          to: null,
        },
      };
      this.$store.dispatch("keep/backupLocal", payload)
        .then((r) => {})
        .finally(() => {
          this.backupPending = false;
          this.showDone = true;
        });
    },

    doLocalBackupMany() {
      this.validateRecurring();
      if (!this.recurringValid) {
        return;
      }
      this.autoSetPending = true;
      this.showDone = false;
      this.showAutoSetDone = false;
      this.showAutoOffDone = false;

      const payload: ManyPayload = {
        many: {
          from: this.agentName,
          to: null,
          freq: parseInt(this.freq),
        }
      };
      this.$store
        .dispatch("keep/localMany", payload)
        .then((r) => {})
        .finally(() => {
          this.autoSetPending = false;
          this.showAutoSetDone = true;
        });
    },

    openBackup() {
      this.backupOpen = true;
    },

    backupOnce() {
      this.backupPending = true;
      this.showDone = false;
      this.showAutoSetDone = false;

      const payload: BackupPayload = {
        once: {
          from: this.agentName,
          to: siggedShip(this.backupShip),
        },
      };
      this.$store.dispatch("keep/backupRemote", payload)
        .then((r) => {})
        .finally(() => {
          this.backupPending = false;
          this.showDone = true;
        });
    },

    testMany() {
      this.validateRecurring();
      if (!this.recurringValid) {
        return;
      }
      this.autoSetPending = true;
      this.showDone = false;
      this.showAutoSetDone = false;
      this.showAutoOffDone = false;

      const payload: ManyPayload = {
        many: {
          from: this.agentName,
          to: siggedShip(this.backupShip),
          freq: parseInt(this.freq),
        },
      };
      this.$store
        .dispatch("keep/backupRemote", payload)
        .then((r) => {})
        .finally(() => {
          this.autoSetPending = false;
          this.showAutoSetDone = true;
        });
    },

    unsetMany() {
      this.autoOffPending = true;
      this.showDone = false;
      this.showAutoSetDone = false;
      this.showAutoOffDone = false;

      const payload: ManyPayload = {
        many: {
          from: this.agentName,
          to: siggedShip(this.backupShip),
          freq: null,
        },
      };

      this.$store
        .dispatch("keep/backupRemote", payload)
        .then((r) => {})
        .finally(() => {
          this.autoOffPending = false;
          this.showAutoOffDone = true;
        });
    },

    unsetLocalMany() {
      this.autoOffPending = true;
      this.showDone = false;
      this.showAutoSetDone = false;
      this.showAutoOffDone = false;

      const payload: ManyPayload = {
        many: {
          from: this.agentName,
          to: null,
          freq: null,
        },
      };

      this.$store
        .dispatch("keep/backupRemote", payload)
        .then((r) => {})
        .finally(() => {
          this.autoOffPending = false;
          this.showAutoOffDone = true;
        });
    },

    singleBackup() {
      this.backupPending = true;
      // TODO:
      const payload = {
        // resource: {
        //   entity: this.ship,
        //   name: this.resource,
        // },
        frequency: "just-doin-single",
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
  },
});
</script>
