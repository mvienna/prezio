<template>
  <q-card
    bordered
    flat
    class="absolute-center shadow"
    style="
      z-index: 1;
      border-radius: 24px !important;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      color: white;
    "
  >
    <q-card-section :class="$q.screen.lt.lg ? 'q-pa-lg' : 'q-pa-xl'">
      <div
        class="text-center text-bold"
        :class="$q.screen.lt.lg ? 'text-h6' : 'text-h4'"
      >
        {{ $t("presentationRoom.footer.hideResults.dialog.title") }}
      </div>

      <div
        class="text-black-4 q-mt-md row no-wrap justify-center"
        :class="$q.screen.lt.lg ? '' : 'text-h7'"
      >
        <div
          style="line-height: 24px"
          v-html="
            $t(
              'presentationRoom.footer.hideResults.dialog.description',
              slide?.answers?.length
            )
          "
        ></div>
      </div>

      <q-btn
        unelevated
        color="white"
        text-color="black"
        no-caps
        class="full-width text-semibold"
        :class="$q.screen.lt.lg ? 'q-mt-lg q-py-sm' : 'q-mt-xl q-py-md'"
        :label="$t('presentationRoom.footer.hideResults.dialog.toggle')"
        @click="toggleResultsHiddenSetting()"
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas";

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { slideSettings, slide } = storeToRefs(presentationsStore);

const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

/*
 * toggle results hidden settings
 */
const toggleResultsHiddenSetting = async () => {
  slideSettings.value.isResultsHidden = !slideSettings.value.isResultsHidden;
  await presentationsStore.updateLocalSlide();
  await presentationsStore.saveSlide(undefined, elements.value);
};
</script>
