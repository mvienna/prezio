<template>
  <q-btn
    unelevated
    no-caps
    no-wrap
    class="bg-accent"
    text-color="primary"
    size="12px"
    :class="
      isAvatarOnly ? 'q-pa-none round-borders' : 'q-pa-xs q-pl-md bg-blue-1'
    "
    :round="isAvatarOnly"
  >
    <template #default>
      <div v-if="!isAvatarOnly" class="q-mr-md">
        {{ user.name }}
      </div>

      <UserAvatar
        :user="user"
        :size="isAvatarOnly ? '36px' : '30px'"
        color="primary"
      />

      <q-menu
        anchor="bottom right"
        self="top right"
        transition-show="jump-down"
        transition-hide="jump-up"
        :offset="[0, 8]"
        class="q-pa-sm"
        style="border-radius: 12px"
        fit
      >
        <div class="column q-gutter-sm">
          <q-item
            v-for="item in userMenuLinks"
            :key="item.name"
            :to="item.link"
            dense
            :disable="item.disable"
            class="items-center text-semibold justify-start rounded-borders q-px-lg q-py-sm"
            :class="
              item.name ===
              userMenuLinks.find(
                (link) => link.link === ROUTE_PATHS.AUTH.LOGOUT
              ).name
                ? 'text-red'
                : 'text-primary'
            "
          >
            <q-icon
              :name="item.icon"
              class="q-mr-sm text-semibold"
              size="20px"
            />
            <div
              :class="
                item.name ===
                userMenuLinks.find(
                  (link) => link.link === ROUTE_PATHS.AUTH.LOGOUT
                ).name
                  ? 'text-red'
                  : 'text-black'
              "
            >
              {{ item.label }}
            </div>
          </q-item>
        </div>
      </q-menu>
    </template>
  </q-btn>
</template>

<script setup>
import { ROUTE_PATHS } from "src/constants/routes";
import UserAvatar from "components/user/UserAvatar.vue";
import { useAuthStore } from "stores/auth";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

defineProps({
  isAvatarOnly: { type: Boolean },
});

/*
 * user
 */
const { user } = storeToRefs(useAuthStore());

const userMenuLinks = ref([
  {
    name: "profile",
    label: t("mainLayout.header.userMenuLinks.profile"),
    icon: "r_account_circle",
    link: ROUTE_PATHS.USER.PROFILE,
  },
  {
    name: "my_plan",
    label: t("mainLayout.header.userMenuLinks.myPlan"),
    icon: "r_track_changes",
    link: "/",
    disable: true,
  },
  {
    name: "payments",
    label: t("mainLayout.header.userMenuLinks.payments"),
    icon: "r_wallet",
    link: "/",
    disable: true,
  },
  {
    name: "logout",
    label: t("mainLayout.header.userMenuLinks.logout"),
    icon: "r_logout",
    link: ROUTE_PATHS.AUTH.LOGOUT,
  },
]);
</script>

<style scoped lang="scss">
.q-btn {
  border-radius: 10px;
}
</style>
