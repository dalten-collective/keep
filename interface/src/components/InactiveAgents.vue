<template>
  <div class="tw-w-screen">

    <div class="tw-flex tw-space-between tw-mb-4">
      <div class="tw-grow">
        <h3 class="tw-text-3xl tw-font-silom">Inactive Agents</h3>
        <!--
        <p class="tw-my-2">
          These agents are properly wrapped and ready for %keep, but are not yet <span class="tw-font-bold">live</span>. Activate them here to begin backing up.
        </p>
        <p class="tw-my-2">
          <router-link class="tw-underline" :to="{ name: 'learn' }">Learn more</router-link> about wrapping.
        </p>
        -->
      </div>
      <div>
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
      </div>
    </div>

    <div class="tw-my-4">
      <h3 class="tw-text-lg tw-mb-4">Installed Desks</h3>
      <p class="tw-my-2">
        These are the desks you have installed on your ship. Keep needs to prepare these desks before it can back up their agents.
      </p>
      <div class="tw-grid xs:tw-grid-cols-1 md:tw-grid-cols-3 tw-gap-1">
        <div v-for="d in installedDesks" class="tw-grid-col-span-1 tw-border tw-rounded-keep tw-p-4">
          <div class="tw-flex tw-justify-between">
            <div>
              %{{ d }}
            </div>
            <div>
              <div v-if="deskCopying(d)">
                <v-btn v-bind="props" color="success" size="x-small" disabled icon="mdi-thumb-up" />
              </div>
              <div v-else>
                <v-btn color="success" size="x-small" @click="copyDepsFor(d)">Prepare</v-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!agents || agents.length === 0">
      No keep agents on this ship
      <hr />
    </div>

    <div v-else>
      <div v-if="inactiveAgents.length === 0">
        No inactive agents
        <hr />
      </div>
      <div v-else v-for="agent in inactiveAgents" :key="agent">
        <KeepAgent
          :agent-name="agent.agentName"
          style="border: 1px dashed black; padding: 1em"
        />
      </div>
    </div>

    <!--
    <input type="text" v-model="agentToActivate" />
    <br />
    <input type="text" placeholder="scry app" v-model="scryApp" />
    <input type="text" placeholder="scry path" v-model="scryPath" />
    <button @click="testScry">
      Scry (to {{ scryApp }} with {{ scryPath }})
    </button>
    -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { mapGetters, mapState } from "vuex";
import { Scry } from "@urbit/http-api";

import KeepAgent from "@/components/KeepAgent.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    KeepAgent,
  },
  computed: {
    ...mapGetters("keep", ["agents", "inactiveAgents"]),
    ...mapState("ship", ["installedDesks"]),
    ...mapState("keep", ["desks"]),
    installedButNotCopying() {
      // TODO: return installedDesks minus copying-to
      return this.installedDesks
    },
    copyingDepsAgents() {
      return this.desks;
    },
  },
  data() {
    return {
      scryApp: "",
      scryPath: "",
      activePending: false,
    };
  },
  methods: {
    deskCopying(deskName) {
      if (this.copyingDepsAgents.includes(deskName)) {
        return true
      }
      return false
    },

    copyDepsFor(deskName) {
      console.log('copying deps for ', deskName)
      this.$store.dispatch('keep/copyDeps', deskName);
    },

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
      }, 400);
    },
  },
});
</script>
