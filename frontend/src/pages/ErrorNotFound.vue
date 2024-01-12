<template>
  <div>
    <div class="text-h3 text-semibold" style="line-height: 1.2">
      {{ $t("pages.notFound.title") }}
    </div>

    <div class="q-mt-3xs text-grey-9 text-16">
      {{ $t("pages.notFound.description") }}
    </div>

    <div class="row no-wrap q-mt-lg q-pt-sm">
      <q-btn
        color="grey-9"
        outline
        icon="r_arrow_back"
        :label="$t('pages.notFound.goBack')"
        no-caps
        @click="$router.go(-1)"
      />

      <q-btn
        color="primary"
        unelevated
        :to="ROUTE_PATHS.INDEX"
        icon="icon-home"
        :label="$t('pages.notFound.homepage')"
        no-caps
        class="q-ml-md"
      />
    </div>
  </div>
</template>

<script setup>
import { ROUTE_PATHS } from "src/constants/routes";
</script>

<style lang="scss">
.chaport-container {
  display: none;
}
</style>
