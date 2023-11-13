<template>
  <q-btn
    :label="$t('presentationRoom.footer.chat.title')"
    icon="r_chat"
    flat
    rounded
    no-caps
    :style="`${showRoomChat ? 'background: rgba(255, 255, 255, 0.1);' : ''}`"
  >
    <q-menu
      v-model="showRoomChat"
      target=".room_actions__card"
      anchor="top left"
      self="bottom left"
      transition-show="jump-up"
      transition-hide="jump-down"
      :offset="$q.screen.lt.md ? [0, 8] : [0, 16]"
      style="
        background: rgba(0, 0, 0, 0.5);
        color: white;
        backdrop-filter: blur(4px);
        border-radius: 24px;
      "
      class="q-pa-sm"
    >
      <div class="chat">
        <div class="row no-wrap items-center justify-between q-ma-sm">
          <div class="text-h7 text-semibold">
            {{ $t("presentationRoom.footer.chat.title") }}
          </div>

          <div>
            <q-btn
              icon="r_close"
              color="grey"
              round
              flat
              size="10px"
              style="border-radius: 50%"
              v-close-popup
            />
          </div>
        </div>

        <div
          v-if="room?.messages?.length"
          class="chat__messages q-pb-sm column no-wrap q-gutter-xs scroll--hidden"
        >
          <div
            v-for="item in room.messages.filter(
              (message) => isHost || (!isHost && message.type !== 'system')
            )"
            :key="item.id"
            class="chat__messages__item"
            :class="!item.participant ? 'chat__messages__item--host' : ''"
            @mouseover="item.isHovered = true"
            @mouseleave="item.isHovered = false"
          >
            <div>
              <template
                v-if="
                  item.type === 'default' ||
                  (item.type === 'system' && item.participant)
                "
              >
                <!-- avatar - participant -->
                <span
                  v-if="getParticipantUserData(item)?.avatar"
                  class="q-mr-xs"
                >
                  {{ getParticipantUserData(item).avatar }}
                </span>

                <!-- avatar - host -->
                <span v-else-if="!item.participant" class="q-mr-xs q-pa-xs">
                  <q-icon name="icon-presentation" />
                </span>

                <!-- name -->
                <span
                  class="text-semibold q-mr-sm"
                  :style="`color: ${
                    item.participant
                      ? participantColors?.[item.participant.id]
                      : 'white'
                  }`"
                >
                  {{
                    getParticipantUserData(item)?.name ||
                    (!item.participant
                      ? room?.host?.name || (isHost ? user?.name : "")
                      : "")
                  }}
                </span>
              </template>

              <!-- message -->
              <span
                :class="item.type === 'system' ? 'text-grey-4 text-italic' : ''"
              >
                {{
                  item.type === "system"
                    ? $t(`presentationRoom.footer.chat.system.${item.message}`)
                    : item.message
                }}
              </span>

              <span
                v-if="item.isHovered"
                class="text-grey text-caption q-ml-sm"
              >
                {{ date.formatDate(item.created_at, "DD.MM.YYYY HH:MM") }}
              </span>
            </div>
          </div>
        </div>

        <div
          v-else
          class="chat__messages full-height q-pb-sm column no-wrap q-gutter-xs scroll--hidden justify-center text-center"
        >
          <div class="text-semibold text-h6">
            {{ $t("presentationRoom.footer.chat.noMessages.title") }}
          </div>
          <div class="text-grey-4">
            {{ $t("presentationRoom.footer.chat.noMessages.message") }}
          </div>
        </div>

        <q-space />

        <q-form class="row no-wrap q-gutter-sm" @submit="sendNewMessage()">
          <q-input
            borderless
            v-model="newMessage"
            dense
            maxlength="255"
            color="white"
            class="q-px-sm"
            style="
              width: 100%;
              border-radius: 8px 8px 8px 16px;
              background: rgba(255, 255, 255, 0.1);
            "
            placeholder="Сообщение..."
            :rules="newMessageRules"
            lazy-rules
            hide-bottom-space
            no-error-icon
          >
            <template #append>
              <div class="text-caption text-grey-4">
                {{ 255 - newMessage?.length }}
              </div>
            </template>
          </q-input>

          <q-btn
            icon="r_send"
            round
            unelevated
            type="submit"
            style="
              border-radius: 8px 8px 16px 8px;
              background: rgba(255, 255, 255, 0.1);
            "
          />
        </q-form>
      </div>
    </q-menu>
  </q-btn>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { wordCloudTextColors } from "src/helpers/colorUtils";
import { onBeforeMount, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "boot/axios";
import { date } from "quasar";
import { useAuthStore } from "stores/auth";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, presentation, showRoomChat, isHost } =
  storeToRefs(presentationsStore);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

/*
 * prepare messages
 */
watch(
  () => room.value?.messages,
  () => {
    processMessages();
  }
);

onBeforeMount(() => {
  processMessages();
});

const participantColors = ref({});

const processMessages = () => {
  room.value?.messages?.map((message) => {
    if (participantColors.value?.[message?.participant?.id]) return;

    participantColors.value[message?.participant?.id] =
      wordCloudTextColors[
        Math.floor(Math.random() * wordCloudTextColors.length)
      ];
  });
};

const getParticipantUserData = (message) => {
  return message?.participant?.user_data
    ? JSON.parse(message?.participant?.user_data)
    : {};
};

/*
 * new message
 */
const newMessage = ref("");

const newMessageRules = [
  (val) =>
    (val && val.length) ||
    t("presentationRoom.footer.chat.errors.fieldRequired"),
  (val) =>
    val.length <= 255 || t("presentationRoom.footer.chat.errors.maxLength"),
];

const sendNewMessage = () => {
  api
    .post(
      `/presentation/${presentation.value.id}/room/${room.value.id}/message`,
      {
        message: newMessage.value,
      }
    )
    .then(() => {
      newMessage.value = "";
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style scoped lang="scss">
::v-deep(.q-btn) {
  border-radius: 16px;
}

.chat {
  height: 298px;
  width: 400px;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  .chat__messages {
    overflow-y: scroll;
    max-height: 100%;

    .chat__messages__item {
      border-radius: 8px;
      padding: 8px;
      transition: 0.2s;
      cursor: pointer;

      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .chat__messages__item--host {
      background: rgba(255, 255, 255, 0.1);
    }
  }
}

@media screen and (max-width: 432px) {
  .chat {
    width: calc(100vw - 34px);
  }
}

::v-deep(.q-field__control) {
  border-radius: 8px 8px 8px 16px;
  height: 42px;
}

::v-deep(.q-field__native) {
  color: $white;
}

::v-deep(.q-field__bottom) {
  display: none;
}
</style>
