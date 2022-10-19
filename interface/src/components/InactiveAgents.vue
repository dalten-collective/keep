<template>
  <div class="tw-w-screen">
    <div class="tw-flex tw-space-between tw-mb-4">
      <div class="tw-grow">
        <h3 class="tw-text-3xl tw-mb-6 tw-font-silom">Agent Configuration</h3>
        <p class="tw-mt-2">
          Agents/Apps on your ship need to be prepared for use with
          %keep before you can back them up.
        </p>
        <p>
          <router-link class="tw-underline" :to="{ name: 'learn' }"
            >Learn more</router-link
          >
          about how %keep wraps agents for backup.
        </p>
      </div>
    </div>

    <v-divider/>

    <div class="tw-my-4 tw-mt-8">
      <div v-if="installedDesks.length > 0">
        <div>
          <h3 class="tw-text-lg tw-mb-4">Installed Desks</h3>
          <p class="tw-my-2">
            These are the desks you have installed on your ship.
            <span class="tw-font-mono">PREPARE</span> the desk's agents to ready them for backup.
          </p>
        </div>

        <div class="tw-flex tw-flex-row tw-justify-end">
          <div>
            <v-switch
              v-model="viewingAdvanced"
              label="Advanced"
              color="info"
            />
          </div>
        </div>

        <div class="tw-mb-4" v-if="viewingAdvanced">
          <v-alert type="warning">
            Careful! These are core Urbit agents. Backing up and restoring their state may be dangerous.
          </v-alert>
        </div>

        <div class="tw-flex tw-flex-col">
          <div v-if="safeInstalledDesks.length === 0" :key="d" class="tw-my-2">
            <p class="tw-my-2">
              You don't have any Keep-appropriate desks installed on this ship
            </p>
          </div>

          <div v-for="d in safeInstalledDesks" :key="d" class="tw-my-2">
            <div v-if="agentsInDesk(d).length > 1">
              <div
                class="tw-flex tw-flex-col tw-justify-between tw-p-4 tw-border tw-rounded-keep tw-shadow-md"
              >
                <h2 class="tw-text-xl tw-mb-4">
                  %{{ deskName(d) }}'s agents:
                </h2>

                <div class="tw-flex tw-flex-wrap tw-justify-start">
                  <div v-for="a in agentsInDesk(d)" :key="a" class="tw-p-6 tw-border tw-m-1 tw-flex tw-justify-start tw-items-center">
                    <h3 class="tw-text-lg tw-mr-6">
                      {{ a.agent }}
                    </h3>

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
                </div>

              </div>
            </div>

            <div v-else-if="agentsInDesk(d).length === 1">

              <div
                class="tw-flex tw-justify-start tw-items-center tw-p-4 tw-rounded-keep tw-border tw-shadow-md"
              >
                <h2 class="tw-text-xl tw-mr-6">
                  %{{ deskName(d) }}
                </h2>

                <div v-for="a in agentsInDesk(d)" :key="a">
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
              </div>
            </div>

          </div>
        </div>
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
          No inactive agents. All prepared desks have their agents
          wrapped.
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

      const nonKeepDesks = this.installedDesks.filter((d) => {
        return this.deskName(d) !== "keep";
      });

      if (this.viewingAdvanced) {
        return nonKeepDesks
      } else {
        return nonKeepDesks.filter((d) => {
          return !badBoys.includes(this.deskName(d));
        });
      }
    },
  },
  data() {
    return {
      scryApp: "",
      scryPath: "",
      activePending: false,
      preparePending: false,
      viewingAdvanced: false,
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
      return Object.keys(desk)[0];
    },
    agentsInDesk(desk) {
      return Object.keys(desk)
        .map((deskName) => desk[deskName])
        .flat();
    },

    copyDepsFor(deskName: string, agentName: string) {
      this.preparePending = true;
      const payload: CopyDepsPayload = {
        copy: {
          desk: deskName,
          dude: agentName,
        },
      };

      this.$store.dispatch("keep/copyDeps", payload).finally(() => {
        this.preparePending = false;
      });
    },

    testScry() {
      const scry: Scry = { app: this.scryApp, path: this.scryPath };
      this.$store.dispatch("keep/scry", scry);
    },
    closeAgentAirlock() {
      this.$store.dispatch("ship/closeKeepAirlock");
    },
  },
});
</script>
