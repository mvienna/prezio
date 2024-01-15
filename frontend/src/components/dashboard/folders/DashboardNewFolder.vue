<template>
  <q-card flat>
    <q-form @submit.prevent="$emit('submit', form)">
      <q-card-section
        :class="presentations?.length ? 'q-pa-lg' : 'q-px-lg q-pt-lg'"
      >
        <!-- icon -->
        <q-btn
          color="background"
          text-color="primary"
          unelevated
          icon="icon-folder_add"
          round
          size="1.15em"
          class="q-mb-3xs"
        />

        <!-- title -->
        <div class="text-16 text-semibold q-my-md">
          {{ $t("dashboard.newFolder.title") }}
        </div>

        <!-- name -->
        <q-input
          v-model="form.name"
          :placeholder="$t('dashboard.newFolder.fields.name')"
          outlined
          dense
          autofocus
          :maxlength="100"
          color="primary"
          :rules="[nameRule]"
          lazy-rules
          no-error-icon
          hide-bottom-space
        >
          <template #append>
            <div class="row items-center text-no-wrap text-caption">
              {{ 100 - form.name?.length }}
            </div>
          </template>
        </q-input>
      </q-card-section>

      <template v-if="presentations?.length">
        <q-separator />

        <q-card-section class="q-pa-lg">
          <!-- add presentations -->
          <div class="text-16 text-semibold q-mb-sm">
            {{ $t("dashboard.newFolder.fields.addPresentations.title") }}
          </div>

          <div class="text-grey-9">
            {{ $t("dashboard.newFolder.fields.addPresentations.description") }}
          </div>
        </q-card-section>

        <div class="relative-position full-width">
          <div
            class="row no-wrap q-gutter-md scroll-x scroll--hidden q-px-lg"
            ref="presentationCardsContainer"
          >
            <q-card
              v-for="presentation in presentations"
              :key="presentation.id"
              flat
              class="presentation_card"
              :class="
                form.presentationsIds?.includes(presentation.id)
                  ? 'presentation_card--active'
                  : ''
              "
              @click="handlePresentationCardToggle(presentation)"
            >
              <!-- presentation preview -->
              <q-img
                :src="
                  presentation.preview?.preview_url ||
                  presentation.preview?.original_url ||
                  presentation.preview
                "
              />

              <!-- presentation name -->
              <div class="text-center ellipsis q-mt-sm text-12">
                {{ presentation.name }}
              </div>
            </q-card>
          </div>

          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <div
              v-if="isScrollLeftAvailable"
              class="absolute q-ml-sm"
              style="top: 50%; left: 0; transform: translateY(-50%)"
            >
              <q-btn
                outline
                color="grey"
                round
                size="10px"
                icon="r_chevron_left"
                class="round-borders bg-white"
                @click="scrollNextLeft()"
              />
            </div>
          </transition>

          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
          >
            <div
              v-if="isScrollRightAvailable"
              class="absolute q-mr-sm"
              style="top: 50%; right: 0; transform: translateY(-50%)"
            >
              <q-btn
                outline
                color="grey"
                round
                size="10px"
                icon="r_chevron_right"
                class="round-borders bg-white"
                @click="scrollNextRight()"
              />
            </div>
          </transition>
        </div>
      </template>

      <q-card-section class="q-pa-lg">
        <div class="row no-wrap q-gutter-lg">
          <!-- cancel -->
          <q-btn
            outline
            no-caps
            :label="$t('dashboard.newFolder.cancel')"
            class="q-py-sm"
            style="width: 100%"
            @click="$emit('cancel')"
          />

          <!-- confirm -->
          <q-btn
            unelevated
            no-caps
            :loading="isLoading"
            :label="$t('dashboard.newFolder.create')"
            class="q-py-sm"
            style="width: 100%"
            color="primary"
            type="submit"
          />
        </div>
      </q-card-section>
    </q-form>
  </q-card>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

/*
 * emits
 */
const emit = defineEmits(["cancel", "submit"]);

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  isLoading: { type: Boolean },
  presentations: { type: Array, default: null },
});

/*
 * form
 */
const form = ref({
  name: "",
  description: "",
  presentationsIds: [],
});

// name validation
const nameRule = (value) => {
  if (!value) {
    return t("dashboard.newFolder.fields.errors.name.required");
  }
  return true;
};

/*
 * select presentations
 */
const handlePresentationCardToggle = (presentation) => {
  if (form.value.presentationsIds?.includes(presentation.id)) {
    form.value.presentationsIds = form.value.presentationsIds.filter(
      (id) => id !== presentation.id
    );
  } else {
    form.value.presentationsIds.push(presentation.id);
  }
};

/*
 * presentations navigation
 */
const presentationCardsContainer = ref();

const isScrollLeftAvailable = ref(false);
const isScrollRightAvailable = ref(true);

const scrollNextLeft = () => {
  presentationCardsContainer.value.scrollTo({
    left: presentationCardsContainer.value.scrollLeft - 162,
    behavior: "smooth",
  });
};

const scrollNextRight = () => {
  presentationCardsContainer.value.scrollTo({
    left: presentationCardsContainer.value.scrollLeft + 162,
    behavior: "smooth",
  });
};

const scrollListener = () => {
  isScrollLeftAvailable.value =
    presentationCardsContainer.value?.scrollLeft > 0;
  isScrollRightAvailable.value =
    presentationCardsContainer.value.scrollLeft +
      presentationCardsContainer.value.clientWidth <
    presentationCardsContainer.value.scrollWidth;
};

onMounted(() => {
  presentationCardsContainer.value.addEventListener("scroll", scrollListener);
});
</script>

<style scoped lang="scss">
.q-card {
  width: 100%;
  max-width: 500px;
  border-radius: 16px !important;
}

.presentation_card {
  width: 164px;
  min-width: 164px;
  aspect-ratio: 16/9;
  cursor: pointer;
  border-radius: 0 !important;

  .q-img {
    border: 1px solid $grey-2;
    outline: 1px solid transparent;

    transition: 0.2s;
    border-radius: 8px;
    width: 100%;
    height: 100%;
  }

  &:hover {
    .q-img {
      border-color: $accent;
      outline-color: $accent;
    }
  }

  &.presentation_card--active {
    .q-img {
      border-color: $primary;
      outline-color: $primary;
    }
  }
}
</style>
