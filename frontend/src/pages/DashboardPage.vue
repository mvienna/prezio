<template>
  <q-page>
    <pre>
      {{ user }}
    </pre>

    <q-btn
      label="logout"
      unelevated
      color="primary"
      @click="
        async () => {
          await authStore.logout();
          await router.push(ROUTE_PATHS.AUTH.LOGIN);
        }
      "
    />
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useAuthStore } from "stores/auth";
import { ROUTE_PATHS } from "src/constants/routes";
import { useRouter } from "vue-router";

const user = storeToRefs(useAuthStore());
const authStore = useAuthStore();

const router = useRouter();
</script>
