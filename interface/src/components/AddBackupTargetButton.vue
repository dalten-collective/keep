<template>
  <v-dialog v-model="open" :scrim="false" scrollable>
    <template v-slot:activator="{ props }">
      <v-btn v-bind="props" color="success" text="white" @click="openModal">
        <v-icon start>mdi-content-save</v-icon>
        Add backup target
      </v-btn>
    </template>

    <v-card class="tw-w-96 tw-border-4 tw-border-primary tw-bg-surface tw-p-4">
      <v-card-title>
        <div class="tw-flex tw-flex-row tw-justify-between">
          <h2 class="tw-text-2xl">Add Backup Target</h2>
          <div>
            <span
              @click="open = !open"
              class="tw-text-sm tw-cursor-pointer tw-underline"
              >Close</span
            >
          </div>
        </div>
      </v-card-title>

      <v-card-text>
        <div class="tw-mt-2">
          <div class="tw-mb-2">
            <span class="tw-font-bold"
              >Begin sending backups to another ship (or your own).</span
            >
          </div>

          <v-form ref="form" v-model="formValid">
            <!--
            <v-select
              label="Choose a %pal"
              disabled
            />
            -->

            <div class="tw-mb-2">
              <v-text-field
                label="~sampel-palnet"
                v-model="backupShip"
                required
                :rules="[(v) => !!v || 'Cannot be blank']"
              />
            </div>

            <div>
              <v-btn
                color="success"
                text="white"
                :loading="addPending"
                :disabled="addPending || !formValid"
                @click="addTarget"
              >
                Add Target
              </v-btn>
            </div>
            <div class="tw-my-2">
              <v-alert type="info" variant="tonal" class="tw-text-sm">
                If the target ship doesn't yet have %keep installed, they'll need to install it before backups will start.
              </v-alert>
            </div>

          </v-form>

          <div class="my-2">
            <div v-if="showDone">
              <v-alert type="success" variant="tonal">
                Backup initiaited to <span class="tw-font-mono">{{ $filters.sigShip(backupShip) }}</span>! You can close this.
              </v-alert>
            </div>
            <div v-if="showFail">
              <v-alert type="error" variant="tonal">
                Something went wrong with that...
              </v-alert>
            </div>
          </div>

        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { OnceRequest, BackupPayload } from "../types";
import { siggedShip } from "@/api/keep";

export default defineComponent({
  props: {
    agentName: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      formValid: false,
      open: false,
      backupShip: "",
      addPending: false,
      showDone: false,
      showFail: false,
    };
  },

  watch: {
    open(val) {
      if (!val) {
        // closing
        // reset things
        this.addPending = false;
        this.showDone = false;
      } else {
        this.backupShip = "";
      }
    },
  },

  computed: {},

  methods: {
    openModal() {
      this.open = true;
    },

    validateForm() {
      this.$refs.form.validate();
    },

    addTarget() {
      // TODO: don't add if already on invites list.
      // show error
      this.addPending = true;

      const payload: BackupPayload = {
        once: {
          from: this.agentName,
          to: this.backupShip,
        },
      };
      this.$store.dispatch("keep/backupRemote", payload)
        .then((r) => {
          // TODO: this doesn't return anything.
          console.log("backup done ", r);
          this.showDone = true;
        })
        .catch((e) => {
          console.log('error in component ', e)
          this.showFail = true;
        })
        .finally(() => {
          this.addPending = false;
        });
    },
  },
});
</script>
