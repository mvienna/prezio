<template>
  <div class="websockets_connection_interrupted_banner">
    <div class="websockets_connection_interrupted_banner__container">
      <div>
        <div class="text-semibold text-h7">
          {{ $t("websockets.connection.interrupted.title") }}
        </div>
        <div
          class="text-sm q-mt-sm"
          v-html="$t('websockets.connection.interrupted.description')"
        ></div>
      </div>

      <q-space />

      <q-btn
        unelevated
        color="white"
        text-color="black"
        :label="$t('websockets.connection.interrupted.reconnect')"
        no-caps
        no-wrap
        class="q-ml-md"
        @click="$emit('reconnect')"
      />
    </div>
  </div>
</template>

<script setup>
defineEmits(["reconnect"]);
</script>

<style scoped lang="scss">
.websockets_connection_interrupted_banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  z-index: 2000;

  background: $red;
  color: $white;

  padding: 16px;

  .websockets_connection_interrupted_banner__container {
    max-width: 1000px;
    margin: 0 auto;

    display: flex;
    align-items: center;

    @media screen and (max-width: 900px) {
      flex-direction: column;

      .q-btn {
        margin-top: 16px;
        margin-left: 0;
        width: 100%;
      }
    }
  }
}
</style>
