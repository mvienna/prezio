<template>
  <q-layout view="lHh LpR lFf">
    <template v-if="isHost">
      <!-- host left drawer -->
      <PresentationRoomLayoutHostDrawerLeft />

      <!-- host header -->
      <PresentationRoomLayoutHostHeader />
    </template>

    <!-- participant header -->
    <PresentationRoomLayoutParticipantHeader v-else />

    <!-- router view -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/auth";
import { computed } from "vue";
import PresentationRoomLayoutHostDrawerLeft from "components/layouts/presentation/room/backstage/host/PresentationRoomBackstageLayoutHostDrawerLeft.vue";
import PresentationRoomLayoutParticipantHeader from "components/layouts/presentation/room/backstage/participant/PresentationRoomBackstageLayoutParticipantHeader.vue";
import PresentationRoomLayoutHostHeader from "components/layouts/presentation/room/backstage/host/PresentationRoomBackstageLayoutHostHeader.vue";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation } = storeToRefs(presentationsStore);

const { user } = storeToRefs(useAuthStore());

/*
 * role
 */
const isHost = computed(() => {
  if (user.value && presentation.value) {
    return user.value.id === presentation.value.user_id;
  }

  return false;
});
</script>
