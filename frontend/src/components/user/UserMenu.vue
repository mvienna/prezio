<template>
  <q-btn
    flat
    no-caps
    no-wrap
    class="text-black"
    :class="
      isAvatarOnly ? 'q-pa-none round-borders' : 'q-px-xs rounded-borders'
    "
    :style="`border-radius: ${isAvatarOnly ? '50%' : '19px 8px 8px 19px'};`"
    :round="isAvatarOnly"
  >
    <template #default>
      <div class="row no-wrap items-center">
        <UserAvatar
          :user="user"
          :size="isAvatarOnly ? '36px' : '30px'"
          color="primary"
        />

        <template v-if="!isAvatarOnly">
          <div class="q-ml-sm">
            {{ user.name }}
          </div>

          <q-icon
            name="r_expand_less"
            class="q-ml-xs"
            :style="isMenuExpanded ? 'transform: rotate(180deg);' : ''"
          />
        </template>
      </div>

      <q-menu
        v-model="isMenuExpanded"
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

const isMenuExpanded = ref(false);

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
.q-icon {
  transition: 0.2s;
}
</style>
