<template>
  <div class="tw-w-screen">
    <div class="tw-flex tw-space-between tw-mb-4">
      <div class="tw-grow">
        <h3 class="tw-text-3xl tw-font-silom">Installed Desks</h3>
        <p class="tw-my-2">
          Agents/Apps on your ship need to be prepared for use with %keep and
          then <span class="tw-font-mono">ACTIVATED</span> before you can back
          them up.
        </p>
        <p class="tw-my-2">
          <router-link class="tw-underline" :to="{ name: 'learn' }"
            >Learn more</router-link
          >
          about how %keep wraps agents for backup.
        </p>
      </div>
      <!--
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
      -->
    </div>

    <div class="tw-my-4">
      <div v-if="safeInstalledDesks && safeInstalledDesks.length > 0">
        <h3 class="tw-text-lg tw-mb-4">Installed Desks</h3>
        <p class="tw-my-2">
          These are the desks you have installed on your ship.
          <span class="tw-font-mono">PREPARE</span> the desk to make it ready
          for activation.
        </p>
        <div class="tw-flex tw-flex-col">
          <div
            v-for="d in safeInstalledDesks"
            :key="d"
            class=""
          >
            <div class="tw-flex tw-flex-col tw-justify-between tw-p-4 tw-border tw-my-2">
              {{ deskName(d) }}
              <div v-for="a in agentsInDesk(d)" :key="a">
                {{ a.agent }}
                  <div v-if="deskCopying(a.agent)">
                    <v-btn
                      v-bind="props"
                      color="success"
                      size="x-small"
                      disabled
                      icon="mdi-thumb-up"
                    />
                  </div>
                  <div v-else>
                <v-btn
                  color="success"
                  size="x-small"
                  @click="copyDepsFor(deskName(d), a.agent)"
                  :loading="preparePending"
                  >Prepare</v-btn
                >
                  </div>
              </div>

              <div v-if="false">
                <div>%{{ d }}</div>
                <div>
                  <div v-if="deskCopying(d)">
                    <v-btn
                      v-bind="props"
                      color="success"
                      size="x-small"
                      disabled
                      icon="mdi-thumb-up"
                    />
                  </div>
                  <div v-else>
                    <v-btn
                      color="success"
                      size="x-small"
                      @click="copyDepsFor(d)"
                      :loading="preparePending"
                      >Prepare</v-btn
                    >
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <h3 class="tw-text-lg tw-mb-4">Installed Desks</h3>
        <p class="tw-my-2">You don't have any desks installed on this ship</p>
      </div>
    </div>

    <v-divider class="tw-my-4" />

    <div v-if="safeInstalledDesks && safeInstalledDesks.length > 0">
      <h3 class="tw-text-lg tw-mb-4">Agents to Activate</h3>
      <div v-if="!agents || agents.length === 0">
        No %keep-wrapped agents on this ship. Are you sure you've
        <router-link class="tw-underline" :to="{ name: 'learn' }"
          >wrapped</router-link
        >
        some prepared agents?
      </div>

      <div v-else>
        <div v-if="inactiveAgents.length === 0">
          No inactive agents. All prepared desks have their agents wrapped.
        </div>
        <div v-else v-for="agent in inactiveAgents" :key="agent">
          <KeepAgent
            :agent-name="agent.agentName"
            style="border: 1px dashed black; padding: 1em"
          />
        </div>
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
import { CopyDepsPayload } from "@/types";

export default defineComponent({
  name: "HomeView",
  components: {
    KeepAgent,
  },
  computed: {
    ...mapGetters("keep", ["agents", "inactiveAgents"]),
    ...mapState("ship", ["installedDesks"]),
    ...mapState("keep", ["desks", "agents"]),
    installedButNotCopying() {
      // TODO: return installedDesks minus copying-to
      return this.installedDesks;
    },
    copyingDepsAgents() {
      return this.agents;
    },
    safeInstalledDesks(): Array<string> {
      const badBoys = [
        "keep",
        "garden",
        "kids",
        "webterm",
        "base",
        "landscape",
        "bitcoin",
      ];
      return this.installedDesks.filter((d) => {
        return !badBoys.includes(d);
      });
    },
  },
  data() {
    return {
      scryApp: "",
      scryPath: "",
      activePending: false,
      preparePending: false,
    };
  },
  methods: {
    deskCopying(agentName) {
      if (this.copyingDepsAgents.includes(agentName)) {
        return true;
      }
      return false;
    },

    deskName(desk) {
      return Object.keys(desk)[0]
    },
    agentsInDesk(desk) {
      return Object.keys(desk).map((deskName) => desk[deskName]).flat()
    },

    copyDepsFor(deskName: string, agentName: string) {
      console.log('d ', deskName, ' a ', agentName)
      this.preparePending = true;
      const payload: CopyDepsPayload = {
        copy: {
          desk: deskName,
          dude: agentName,
        }
      };

      this.$store.dispatch("keep/copyDeps", payload).finally(() => {
        this.preparePending = false;
      });
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
