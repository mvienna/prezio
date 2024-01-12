<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-toolbar
        class="absolute-top-left bg-white q-pa-lg"
        :style="`width: ${$q.screen.lt.lg ? '100%' : '50%'}`"
        style="z-index: 2"
      >
        <a :href="landingUrl">
          <q-img
            src="/prezio.svg"
            style="width: 120px; min-width: 120px"
            fit="contain"
          />
        </a>
      </q-toolbar>

      <q-toolbar
        class="absolute-bottom-left bg-white q-pa-lg"
        :style="`width: ${$q.screen.lt.lg ? '100%' : '50%'}`"
        style="z-index: 2"
      >
        <div class="container row justify-between">
          <div>© {{ new Date().getFullYear() }} Prezio</div>

          <a
            :href="landingUrl + ROUTE_PATHS.POLICIES.PRIVACY_POLICY"
            class="link text-black"
          >
            {{ $t("privacyPolicy") }}
          </a>
        </div>
      </q-toolbar>

      <div class="container__wrapper">
        <!-- left -->
        <div class="container">
          <router-view />
        </div>

        <!-- right -->
        <div
          v-if="!$q.screen.lt.lg"
          class="full-width full-height row justify-center items-center q-px-xl"
          style="
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center center;
          "
          :style="`background-image: url(${wallpapers[random]});`"
        ></div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ROUTE_PATHS, SUBDOMAINS } from "src/constants/routes";

const wallpapers = [
  "/assets/images/auth.jpg",
  // "/assets/images/auth1.jpg",
  // "/assets/images/auth2.jpg",
];
const random = Math.floor(Math.random() * wallpapers.length);

/*
 * landing url
 */
const landingUrl =
  // protocol
  window.location.protocol +
  "//" +
  // host
  window.location.host.replace(SUBDOMAINS.app + ".", "");
</script>

<style scoped lang="scss">
.q-page-container {
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: $white;
}

.container__wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100svh;

  @media screen and (max-width: 1000px) {
    grid-template-columns: repeat(1, 1fr);
  }
}

.container {
  max-width: 460px;
  width: 100%;
}
</style>
