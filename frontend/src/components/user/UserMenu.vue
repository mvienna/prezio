<template>
  <q-btn
    flat
    no-caps
    no-wrap
    class="text-black"
    :class="isAvatarOnly ? 'q-pa-none round-borders' : 'q-px-xs rounded-sm'"
    :style="`border-radius: ${isAvatarOnly ? '50%' : '19px'};`"
    :round="isAvatarOnly"
  >
    <template #default>
      <div class="row no-wrap items-center">
        <UserAvatar :user="user" :size="isAvatarOnly ? '36px' : '30px'" />

        <template v-if="!isAvatarOnly">
          <div class="q-ml-sm">
            {{ user.name }}
          </div>

          <q-icon
            name="r_expand_less"
            class="q-ml-xs"
            :style="!isMenuExpanded ? 'transform: rotate(180deg);' : ''"
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
        fit
      >
        <!-- profile -->
        <q-item
          :to="ROUTE_PATHS.PROFILE.INDEX"
          dense
          class="items-center justify-start text-black"
        >
          <q-icon name="icon-account" class="q-mr-sm" size="20px" />
          <div>
            {{ $t("mainLayout.header.userMenuLinks.profile") }}
          </div>
        </q-item>

        <!-- upgrade -->
        <q-item
          :to="ROUTE_PATHS.PROFILE.SUBSCRIPTION"
          dense
          disable
          class="items-center justify-start"
        >
          <q-icon name="icon-bolt" class="q-mr-sm" size="20px" />
          <div>
            {{ $t("mainLayout.header.userMenuLinks.upgrade") }}
          </div>
        </q-item>

        <q-separator class="q-my-sm" />

        <!-- log out -->
        <q-item
          :to="ROUTE_PATHS.AUTH.LOGOUT"
          dense
          class="items-center justify-start text-red"
        >
          <q-icon name="icon-logout" class="q-mr-sm" size="20px" />
          <div class="text-red">
            {{ $t("mainLayout.header.userMenuLinks.logout") }}
          </div>
        </q-item>
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
</script>

<style scoped lang="scss">
.q-icon {
  transition: 0.2s;
}
</style>
