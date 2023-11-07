<template>
  <q-btn
    flat
    :icon="room?.is_submission_locked ? 'r_lock' : 'r_lock_open'"
    no-caps
    :label="
      room?.is_submission_locked
        ? $t(
            `presentationRoom.footer.submissionLock.${
              room?.is_submission_locked ? 'off' : 'on'
            }`
          )
        : ''
    "
    class="q-ml-sm"
    :style="!room?.is_submission_locked ? 'width: 46px' : ''"
    @click="toggleSubmissionLockSetting()"
  >
    <q-tooltip
      anchor="top middle"
      self="bottom middle"
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      {{
        $t(
          `presentationRoom.footer.submissionLock.toggle.${
            room?.is_submission_locked ? "on" : "off"
          }`
        )
      }}
    </q-tooltip>
  </q-btn>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { startCountdown, stopCountdown } from "src/helpers/countdown";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { room, slideSettings } = storeToRefs(presentationsStore);

/*
 * toggle submission lock setting
 */
const toggleSubmissionLockSetting = () => {
  room.value.is_submission_locked = !room.value.is_submission_locked;

  if (!room.value.is_submission_locked && slideSettings.value.isLimitedTime) {
    startCountdown(slideSettings.value.timeLimit);
  } else {
    stopCountdown();
  }

  presentationsStore.sendPresentationRoomUpdateEvent(
    undefined,
    undefined,
    undefined,
    undefined,
    {
      countdown: !room.value.is_submission_locked
        ? slideSettings.value.timeLimit
        : 0,
      is_submission_locked: room.value.is_submission_locked,
    }
  );
};
</script>
