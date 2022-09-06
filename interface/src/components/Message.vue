<template>
  <div
    class="bg-white tw-border tw-border-gray-200 tw-rounded-t-lg tw-shadow-xl tw-opacity-100 sm:tw-rounded-tl-lg"
  >
    <div v-if="messages && messages.length > 0">
      <div v-if="collapsed">
        <div
          class="tw-flex tw-justify-space-between tw-items-center tw-my-1 tw-text-gray-700 tw-bg-white tw-rounded-md"
        >
          <div class="tw-absolute tw-flex tw-justify-end tw-cursor-pointer" @click="collapsed = false">
            <div>
              {{ messages.length }} message{{
                messages.length == 1 ? "" : "s"
              }}
            </div>
            <div
              v-if="newMessages"
              class="tw-relative tw-rounded-full tw-right-1 tw-bg-info tw-h-2 tw-w-2 tw-animate-pulse"
            ></div>
          </div>
          <v-spacer />
          <div>
            <v-btn
              size="small"
              icon="mdi-chevron-up"
              variant="text"
              @click="collapsed = false"
            ></v-btn>
            <v-btn
              size="small"
              icon="mdi-delete-sweep"
              variant="text"
              @click="clearAll"
            ></v-btn>
          </div>
        </div>
      </div>
      <div v-else>
        <div
          class="tw-flex tw-justify-space-between tw-items-center tw-my-1 tw-text-gray-700 tw-bg-white tw-rounded-md"
        >
          <div class="tw-absolute tw-flex tw-justify-end tw-cursor-pointer" @click="collapsed = true">
            {{ messages.length }} message{{
              messages.length == 1 ? "" : "s"
            }}
          </div>
          <v-spacer />
          <v-btn
            size="small"
            icon="mdi-chevron-down"
            variant="text"
            @click="collapsed = true"
          ></v-btn>
          <v-btn
            size="small"
            icon="mdi-delete-sweep"
            variant="text"
            color="error"
            @click="clearAll"
          ></v-btn>
        </div>
        <ul class="tw-overflow-y-scroll tw-max-h-[70vh]">
          <li
            class="tw-p-2 tw-my-1 tw-font-bold tw-text-white tw-shadow-md tw-rounded-md"
            :class="typeClass(m.type)"
            v-for="m in orderedMessages"
            :key="m.time"
          >
            <div class="tw-flex tw-justify-between">
              <div>
                <div>
                  {{ m.msg }}
                </div>
                <div class="tw-mr-4 tw-text-xs">
                  {{ $filters.sectToDate(m.time).toLocaleString() }}
                </div>
              </div>

              <div
                class="tw-px-2 tw-ml-4 tw-cursor-pointer"
                @click="clearMessage(m)"
              >
                X
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div v-else>No messages</div>
  </div>
</template>

<script lang="ts">
import { mapState } from "vuex";

import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    ...mapState("message", ["messages"]),
    messageCount() {
      if (this.messages) {
        return this.messages.length;
      }
      return 0;
    },

    orderedMessages() {
      return this.messages.slice().sort(({ time: b }, {time: a}) => {
        return a > b ? 1 : a < b ? -1 : 0
      })
    },
  },
  data() {
    return {
      collapsed: true,
      newMessages: false,
    };
  },

  watch: {
    messageCount(val, oldVal) {
      // When there are new messages and we don't already have the tray open
      if (val > oldVal && this.collapsed) {
        this.newMessages = true;
      }
    },
    collapsed(val, oldVal) {
      // Clear the 'new' status after opening
      if (val == false && oldVal == true) {
        this.newMessages = false;
      }
    },
  },

  methods: {
    clearAll() {
      this.$store.dispatch("message/clearMessages");
    },
    // TODO: remove
    addMessages() {
      const messages = [
        {
          msg: "test",
          time: 12344,
        },
        {
          msg: "test 2",
          time: 12345,
        },
        {
          msg: "test 3",
          time: 12346,
        },
      ];
      messages.forEach((m) => {
        this.$store.dispatch("message/addMessage", m);
      });
    },
    collapse() {
      this.collapsed = true;
    },
    clearMessage(m) {
      this.$store.dispatch("message/clearMessage", m);
    },

    typeClass(msgType) {
      switch (msgType) {
        case "succ":
          return "tw-bg-success";
        case "fail":
          return "tw-bg-error";
        case "pend":
          return "tw-bg-warning";
        default:
          return "tw-bg-gray-400";
      }
    },
  },
});
</script>
