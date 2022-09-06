<template>
  <div class="tw-w-screen">
    <div class="tw-flex tw-space-between tw-mb-4">
      <div class="tw-grow">
        <h3 class="tw-text-3xl tw-font-silom">Kept Backups</h3>
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

export default defineComponent({
  computed: {
    ...mapState("keep", ["backups"]),
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
    return {};
  },
  methods: {},
});
</script>
