<template>
  <v-card>

    <div class="d-flex" :class="mobileClasses">
      <div class="flex-row d-flex">
        <v-tabs
          v-model="tab"
          :direction="onSmall ? 'horizontal' : 'vertical'"
          color="info"
          class="tw-bg-secondary"
        >
          <v-tab value="active">
            <v-icon start>mdi-flare</v-icon>
            Active Agents
          </v-tab>
          <v-tab value="inactive">
            <v-icon start>mdi-folder</v-icon>
            Inactive Agents
          </v-tab>
        </v-tabs>
      </div>

      <v-window v-model="tab">
        <v-window-item value="active" class="tw-w-xl">
          <v-card class="tw-grow tw-p-4 tw-bg-white tw-border-r tw-border-t tw-border-l tw-border-b tw-border-secondary tw-rounded-none tw-rounded-r-lg">
            <div class="tw-flex tw-flex-row tw-my-8">
              <ActiveAgents class="tw-grow"/>
            </div>
          </v-card>
        </v-window-item>

        <v-window-item value="inactive" class="tw-w-xl">
          <v-card class="tw-grow tw-p-4 tw-bg-white tw-border-r tw-border-t tw-border-l tw-border-b tw-border-secondary tw-rounded-none tw-rounded-r-lg">
            <div class="tw-flex tw-flex-row tw-my-8">
              <v-card>
                TODO
              </v-card>
            </div>
          </v-card>
        </v-window-item>
      </v-window>
    </div>

  </v-card>
</template>

<script lang="ts">
import { useDisplay } from 'vuetify'

import { defineComponent } from "vue";

import { mapGetters } from "vuex";
import { Scry } from "@urbit/http-api";

import ActiveAgents from "@/components/ActiveAgents.vue";

import KeepAgent from "@/components/KeepAgent.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    KeepAgent, ActiveAgents
  },
  computed: {
    ...mapGetters("keep", ["agents", "activeAgents", "inactiveAgents"]),
    mobileClasses() {
      const smol = this.onSmall ? true : false
      return {
        'tw-flex-col': smol,
        'tw-flex-row': !smol,
      }
    },

    onSmall() {
      const display = useDisplay()
      return display.smAndDown.value
    },
  },
  data() {
    return {
      scryApp: "",
      scryPath: "",
      activePending: false,
      tab: "active",
    };
  },
  methods: {
    testScry() {
      console.log("scrying ", this.scryApp, this.scryPath);
      const scry: Scry = { app: this.scryApp, path: this.scryPath };
      this.$store.dispatch("keep/scry", scry);
    },
    closeAgentAirlock() {
      this.$store.dispatch("ship/closeKeepAirlock");
    },

    getActive() {
      // TODO:
      this.activePending = true;
      setTimeout(() => {
        this.activePending = false;
      }, 400)
    },
  },
});
</script>
