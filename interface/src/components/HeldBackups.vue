<template>
  <div class="tw-w-screen">
    <div class="tw-flex tw-space-between tw-mb-4">
      <div class="tw-grow">
        <h3 class="tw-text-3xl tw-mb-6 tw-font-silom">Kept Backups</h3>
        <p class="tw-my-2">
          These are the backups you hold for other ships on the network.
        </p>
      </div>
      <div>
        <!--
        <v-btn
          :loading="activePending"
          :disabled="activePending"
          color="white"
          variant="tonal"
          class="tw-inline-block text-success"
          @click="getActive"
        >
          <v-icon start>mdi-cached</v-icon>
          refresh
        </v-btn>
        -->
      </div>
    </div>

    <div class="tw-my-4 tw-bg-surface tw-shadow-inner tw-p-4 tw-rounded-keep tw-border">
      <div v-if="whitelist.on">
        <v-alert class="tw-mb-6" density="compact" variant="tonal" type="success">
          Whitelist is ON. You will only accept backups from approved ships.
        </v-alert>

        <div class="tw-my-4">
          <div v-if="whitelist.in.length > 0">
            <h3 class="tw-text-lg tw-my-4">Approved ships:</h3>
          <v-chip v-for="s in whitelist.in" :key="s" class="tw-mr-2 tw-mb-1">
              {{ $filters.sigShip(s) }}
            <v-icon @click="disallow(s)" class="tw-cursor-pointer tw-ml-1">
              mdi-close-circle-outline
            </v-icon>
          </v-chip>
          </div>
          <div v-else>
            No ships on whitelist yet.
          </div>

          <div>
            <v-form ref="whitelistForm" class="tw-mb-4" v-model="whitelistValid">
              <div class="tw-flex tw-my-2 tw-align-center">
                <v-text-field
                  v-model="addShip"
                  label="Add ship to whitelist"
                  placeholder="~sampel-palnet"
                  :rules="[(v) => !!v || 'Cannot be blank']"
                  @keyup.enter.prevent="addToWhitelist"
                />
                <v-btn
                  type="submit"
                  icon="mdi-thumb-up-outline"
                  color="success"
                  class="tw-ml-2"
                  @click.prevent="addToWhitelist" :disabled="!whitelistValid || whiteAddPending" :loading="whiteAddPending" />
              </div>

            <div>
              <v-alert v-if="showSuccess" type="success" variant="tonal">
                Whitelist modified
              </v-alert>
              <v-alert v-if="showError" type="error" variant="tonal">
                Something went wrong with that
              </v-alert>
            </div>

            </v-form>
          </div>
        </div>

        <div class="tw-mt-4">
          <v-btn block @click="wyteOff" color="error">Deactivate Whitelist</v-btn>
        </div>
      </div>

      <div v-else>
        <v-alert density="compact" variant="tonal" type="error">
          Whitelist is OFF. Warning: Any ship on the network can freely store backups with you!
        </v-alert>
        <p class="tw-mt-2 tw-text-sm">
          Consider activating the whitelist to control which ships you'll allow to store backups with you.
        </p>
        <div class="tw-mt-2">
          <v-btn block @click="wyteOn" color="success">Activate whitelist</v-btn>
        </div>
      </div>
    </div>

    <div class="tw-p-2 tw-my-4 tw-bg-white">
      <article
        v-for="s in backupsByShip"
        :key="s[0]"
        class="tw-flex tw-flex-col tw-justify-between tw-mb-4 tw-border tw-rounded-keep tw-p-4"
      >
        <header class="tw-flex tw-flex-row tw-mb-4">
          <v-chip variant="outlined" label color="info" class="mr-2">
            <span class="mr-2 tw-font-mono">{{
              $filters.sigShip(s[0])
            }}</span>
          </v-chip>
        </header>

        <section class="tw-my-2">
          <article
            v-for="a in s[1].agents"
            :key="a[0]"
            class="tw-border tw-rounded-keep tw-p-4 tw-mb-4"
          >
            <div class="keep-info-items">
              <v-chip
                label
                color="surface"
                class="keep-info-label"
                size="small"
                >Agent name</v-chip
              >

              <div class="keep-info-data">%{{ a[0] }}</div>
            </div>

            <div class="keep-info-items" style="max-width: 46rem">
              <v-chip
                label
                color="surface"
                class="keep-info-label"
                size="small"
                >Last backup</v-chip
              >
              <div class="keep-info-data">
                {{ $filters.sectToDate(a[1]).toLocaleString() }}
              </div>
            </div>
          </article>
        </section>
      </article>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { mapState } from "vuex";
import { Scry } from "@urbit/http-api";

import { Ship } from "@/types";

export default defineComponent({
  computed: {
    ...mapState("keep", ["backups", "whitelist"]),
    backupsByShip() {
      const shipList = new Set();
      this.backups.forEach((b) => {
        shipList.add(b.ship);
      });

      const ships = [];

      shipList.forEach((ship) => {
        const shipBackups = {
          agents: this.backups
            .filter((b) => b.ship === ship)
            .map((b) => {
              return [b.agent, b.time];
            })
            .sort((b, a) => {
              return a[1] - b[1];
            }), // sort by backups by time
        };
        ships.push([ship, shipBackups]);
      });
      // Sort by ship type, then alpha
      return ships.sort((a, b) => {
        // compare lengths (ship type)
        if (a[0].length < b[0].length) {
          return -1;
        }
        if (a[0].length > b[0].length) {
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
  },
  data() {
    return {
        addShip: '',
        whitelistValid: false,
        showError: false,
        showSuccess: false,
      };
  },
  methods: {
    addToWhitelist() {
      if (this.addShip === '') {
        return;
      }

      this.$refs.whitelistForm.validate();

      if (!this.whitelistValid) {
        return
      }

      this.allow(this.addShip);
    },

    allow(ship: Ship) {
      this.showError = false;
      this.showSuccess = false;
      this.whiteAddPending = true;

      this.$store
        .dispatch("keep/wyteAllow", ship)
        .then((r) => {
            this.showSuccess = true;
          })
        .catch((e) => {
          console.log(e)
          this.showError = true;
        })
        .finally(() => {
          this.addShip = '';
          this.whiteAddPending = false;
          this.$refs.whitelistForm.reset()
        });
    },

    disallow(ship: Ship) {
      this.showError = false;
      this.showSuccess = false;

      this.$store
        .dispatch("keep/wyteDisallow", ship)
        .then((r) => {
            this.showSuccess = true;
          })
        .catch((e) => {
          this.showError = true;
          console.log(e)
        })
        .finally(() => {
            this.$refs.whitelistForm.reset()
        });
    },

    wyteOn() {
      this.$store
        .dispatch("keep/wyteOn")
        .then((r) => {})
        .finally(() => {
          // this.backupPending = false;
          // this.showDone = true;
        });
    },
    wyteOff() {
      this.$store
        .dispatch("keep/wyteOff")
        .then((r) => {})
        .finally(() => {
          // this.backupPending = false;
          // this.showDone = true;
        });
    },
  },
});
</script>
