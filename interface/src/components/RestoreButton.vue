<template>
  <v-dialog v-model="restoreOpen">
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props" color="success"
        text="white"
        @click="openRestore"
      >
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

        <hr class="tw-my-4" />

        <div>
          <div class="tw-mb-2">
            <span class="tw-font-bold">Restore resource</span>
            <v-tooltip location="top">
              <template v-slot:activator="{ props }">
                <v-icon
                  v-bind="props"
                  size="x-small"
                  class="tw-ml-1 tw-cursor-pointer tw-mb-2 tw-opacity-50"
                  >mdi-help-circle-outline</v-icon
                >
              </template>
              <span>The resource will be re-created with a new name (which can be the same as the old name) in the group of your choosing.</span>
            </v-tooltip>
          </div>
          <v-form ref="form" v-model="formValid">
              <div v-if="false">
              <!--
              <v-row>
                <v-col cols="12">
                  <v-select
                    :items="groupOptions"
                    label="New group"
                    required
                    v-model="newGroup"
                    :loading="adminPending"
                    :disabled="groupOptions.length === 0"
                    :rules="[(v) => !!v || 'Must choose a group']"
                    persistent-hint
                    :hint="groupOptions.length === 0 ? 'You aren\'t the admin of any groups' : ''"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="New resource name"
                    v-model="newResourceName"
                    :rules="nameRules"
                    hide-details="auto"
                  />
                </v-col>
              </v-row>
              -->
              </div> <!-- false -->
              <v-row>
                <v-col cols="12">
                  <div class="tw-mb-1">
                    <v-btn
                      color="success"
                      text="white"
                      @click="restore"
                      :loading="restorePending"
                    >Restore {{ ship }}'s {{ resource }}</v-btn
                    >
                  </div>
                  <div v-if="restorePending">
                    <v-alert type="info" variant="tonal">
                      Restore has started. You might notice your ship hanging while this completes... You can close this page - or watch.
                    </v-alert>
                  </div>
                  <div v-if="showDone">
                    <v-alert type="success" variant="tonal">
                      Restore complete! Check Groups.
                    </v-alert>
                  </div>
                </v-col>
              </v-row>
          </v-form>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { RestoreRequest } from "../types";
// import { Admin } from "@/types";

export default defineComponent({
  // props: ["resource", "ship", "currentGroup"],
  props: {
    ship: {
      type: String as PropType<Ship>,
      default: "",
    },
    agentName: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      formValid: false,
      restoreOpen: false,
      restorePending: false,
      showDone: false,
      newResourceName: '',
      adminPending: false,
      nameRules: [
        (v: string) => !!v || 'Resource name is required',
        (v: string) => /^[\w-]+$/.test(v) || 'Must use kebab-case-for-name; no special characters',
        (v: string) => /^[a-zA-Z].*$/.test(v) || 'First character must be a letter'
      ],
    };
  },

  watch: {
    restoreOpen(val: boolean) {
      // if (val && this.groupOptions.length === 0) {
      //   // this.getAdmin()
      // }
      if (!val) { // closing
        // reset things
        this.restorePending = false;
        this.showDone = false;
        this.newResourceName = '';
      }
    },
  },

  computed: {
    // ...mapState("peat", ["admin"]),
    // groupOptions() {
    //   return this.admin.map((a: Admin) => a.name)
    // }
  },

  mounted() {
    // this.newResourceName = this.resource
  },

  methods: {
    validateForm() {
      this.$refs.form.validate()
    },

    restore() {
      // this.validateForm()

      // if (!this.formValid) {
      //   return
      // }

      this.restorePending = true;
      const request: RestoreRequest = {
        ship: this.ship,
        agentName: this.agentName,
      };
      this.$store.dispatch("keep/mendFromShip", request);
      this.restorePending = false;
    },
  },
});
</script>
