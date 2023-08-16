<template>
  <q-page>
    <q-input v-model="a" outlined color="primary" />

    <q-checkbox v-model="a" val="red" />

    <q-select
      outlined
      v-model="a"
      :options="['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle']"
      label="Outlined"
    />

    <q-toggle v-model="a">
      <q-tooltip anchor="center right" self="center left" class="arrow-left">
        asdasdasd</q-tooltip
      >
    </q-toggle>

    <q-date v-model="a" />

    <q-btn-dropdown color="primary" label="Dropdown Button" unelevated>
      <q-list>
        <q-item clickable v-close-popup class="text-blue">
          <q-item-section>
            <q-item-label>Photos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section>
            <q-item-label>Videos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section>
            <q-item-label>Articles</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </q-page>
</template>

<script setup>
import { ref } from "vue";

const a = ref();
</script>
