<template>
  <div style="height: calc(100vh - 68px - 66px - 32px)" class="column no-wrap">
    <div class="text-grey">
      {{ $t("presentationLayout.rightDrawer.tabs.templates.categories.title") }}
    </div>

    <!-- categories -->
    <div class="q-gutter-sm q-mt-xs">
      <q-btn
        v-for="category in categories"
        :key="category.name"
        :icon="category.icon"
        :label="category.label"
        :disable="category.disable"
        color="primary"
        :outline="selectedTemplateCategory !== category.name"
        :unelevated="selectedTemplateCategory === category.name"
        no-caps
        size="12px"
        style="padding: 0 12px; min-height: 28px"
        @click="selectedTemplateCategory = category.name"
      />
    </div>

    <!-- search -->
    <q-input
      v-model="search"
      outlined
      dense
      :placeholder="
        $t('presentationLayout.rightDrawer.tabs.templates.search.placeholder')
      "
      debounce="300"
      class="q-mt-md"
      @update:model-value="fetchTemplates()"
    >
      <template #append>
        <q-icon name="r_search" />
      </template>
    </q-input>

    <!-- templates -->
    <div class="text-grey q-mt-lg">
      {{
        filteredTemplates.length
          ? $t("presentationLayout.rightDrawer.tabs.templates.title")
          : $t(
              "presentationLayout.rightDrawer.tabs.templates.search.noResults.title"
            )
      }}
    </div>

    <div class="templates_grid q-mt-sm">
      <div
        v-for="template in filteredTemplates"
        :key="template.id"
        class="template"
        :class="
          template.user?.id === user.id
            ? 'text-primary text-semibold'
            : 'text-grey'
        "
        @click="handleApplyTemplate(template)"
      >
        <!-- template preview -->
        <q-img :src="template.slide.preview" />

        <!-- template name -->
        <div class="text-center q-py-xs ellipsis">
          {{ template.name }}

          <q-icon
            v-if="template.user?.id === user.id"
            class="text-grey q-ml-xs"
            :name="template.is_private ? 'r_visibility_off' : 'r_visibility'"
          />
        </div>

        <q-tooltip
          v-if="template.user || template.description"
          anchor="top middle"
          self="bottom middle"
          transition-show="jump-up"
          transition-hide="jump-down"
          :offset="[0, 8]"
        >
          <!-- template description -->
          <div v-if="template.description" class="text-center text-semibold">
            {{ template.description }}
          </div>

          <!-- template creator -->
          <div
            v-if="template.user"
            class="text-center"
            :class="template.description ? 'q-mt-sm' : ''"
          >
            {{ template.user.name }}
            <template v-if="template.user.id === user.id">
              {{ $t("you") }}
            </template>
          </div>
        </q-tooltip>
      </div>

      <div
        v-if="!filteredTemplates.length"
        class="template text-grey"
        style="opacity: 0.5"
      >
        <!-- template preview -->
        <div style="aspect-ratio: 16/9">
          <q-img src="/favicon.ico" style="height: 100%" fit="contain" />
        </div>

        <!-- template name -->
        <div class="text-center q-py-xs ellipsis">
          {{
            $t(
              "presentationLayout.rightDrawer.tabs.templates.search.noResults.template"
            )
          }}
        </div>
      </div>
    </div>

    <q-space />

    <div>
      <!-- save as template -->
      <q-btn
        v-if="!slide?.template"
        unelevated
        no-caps
        color="primary"
        :label="
          $t(
            'presentationLayout.rightDrawer.tabs.templates.createOrEdit.create'
          )
        "
        icon-right="r_document_scanner"
        class="full-width q-py-sm"
        @click="showCreateTemplateDialog = true"
      />

      <q-dialog v-model="showCreateTemplateDialog">
        <PresentationStudioTabsTemplatesTabCreateOrEditTemplateDialog
          :title="
            $t(
              'presentationLayout.rightDrawer.tabs.templates.createOrEdit.create'
            )
          "
          :cancel-btn-text="
            $t(
              'presentationLayout.rightDrawer.tabs.templates.createOrEdit.cancel'
            )
          "
          :submit-btn-text="
            $t(
              'presentationLayout.rightDrawer.tabs.templates.createOrEdit.submit'
            )
          "
          :categories="categories"
          @cancel="showCreateTemplateDialog = false"
          @submit="handleCreatingNewTemplate($event)"
        />
      </q-dialog>

      <!-- existing template -->
      <div v-if="slide?.template" class="row no-wrap q-gutter-md">
        <!-- edit template -->
        <q-btn
          unelevated
          no-caps
          color="primary"
          :label="
            $t(
              'presentationLayout.rightDrawer.tabs.templates.createOrEdit.edit'
            )
          "
          icon-right="r_document_scanner"
          style="width: 100%"
          class="q-py-sm"
          @click="showEditTemplateDialog = true"
        />

        <q-dialog v-model="showEditTemplateDialog">
          <PresentationStudioTabsTemplatesTabCreateOrEditTemplateDialog
            :name="slide.template.name"
            :description="slide.template.description"
            :category="slide.template.category"
            :is-private="!!slide.template.is_private"
            :title="
              $t(
                'presentationLayout.rightDrawer.tabs.templates.createOrEdit.edit'
              )
            "
            :cancel-btn-text="
              $t(
                'presentationLayout.rightDrawer.tabs.templates.createOrEdit.cancel'
              )
            "
            :submit-btn-text="
              $t(
                'presentationLayout.rightDrawer.tabs.templates.createOrEdit.submit'
              )
            "
            :categories="categories"
            @cancel="showEditTemplateDialog = false"
            @submit="handleUpdatingTemplate($event)"
          />
        </q-dialog>

        <!-- delete template -->
        <q-btn
          flat
          color="red"
          icon="r_delete"
          class="q-py-sm"
          style="width: 40px"
          @click="handleTemplateDeletion(slide.template)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, ref } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "boot/axios";
import { useCanvasStore } from "stores/canvas";
import { storeToRefs } from "pinia";
import { deselectElement } from "stores/canvas/helpers/select";
import { usePresentationsStore } from "stores/presentations";
import { useQuasar } from "quasar";
import PresentationStudioTabsTemplatesTabCreateOrEditTemplateDialog from "components/presentationStudio/tabs/templates/PresentationStudioTabsTemplatesTabCreateOrEditTemplateDialog.vue";
import { useAuthStore } from "stores/auth";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const { user } = storeToRefs(useAuthStore());

const $q = useQuasar();

/*
 * stores
 */
const canvasStore = useCanvasStore();
const { elements } = storeToRefs(canvasStore);

const presentationsStore = usePresentationsStore();
const { slide } = storeToRefs(presentationsStore);

/*
 * categories
 */
const categories = [
  {
    name: "work",
    label: t("presentationLayout.rightDrawer.tabs.templates.categories.work"),
    icon: "r_work",
  },
  {
    name: "school",
    label: t("presentationLayout.rightDrawer.tabs.templates.categories.school"),
    icon: "r_school",
  },
  {
    name: "fun",
    label: t("presentationLayout.rightDrawer.tabs.templates.categories.fun"),
    icon: "r_celebration",
  },
  {
    name: "holidays",
    label: t(
      "presentationLayout.rightDrawer.tabs.templates.categories.holidays"
    ),
    icon: "r_redeem",
  },
  {
    name: "other",
    label: t("presentationLayout.rightDrawer.tabs.templates.categories.other"),
    icon: "r_more_horiz",
  },
  {
    name: "custom",
    icon: "r_account_circle",
  },
];

const selectedTemplateCategory = ref(categories[0].name);

/*
 * templates
 */
const templates = ref([]);
const search = ref("");

const filteredTemplates = computed(() => {
  return templates.value.filter(
    (item) => item.category === selectedTemplateCategory.value
  );
});

const fetchTemplates = () => {
  api
    .get(`/slide-templates?query=${search.value}`)
    .then((response) => {
      templates.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

onBeforeMount(() => {
  fetchTemplates();
});

/*
 * apply template
 */
const handleApplyTemplate = async (template) => {
  deselectElement();

  slide.value.canvas_data = template.slide.canvas_data;
  await canvasStore.setElementsFromSlide();
  canvasStore.redrawCanvas(undefined, undefined, false);
  canvasStore.saveSlidePreview();

  $q.notify({
    message: t("presentationLayout.rightDrawer.tabs.templates.applied"),
    icon: "r_done",
  });
};

/*
 * create template
 */
const showCreateTemplateDialog = ref(false);

const handleCreatingNewTemplate = (data) => {
  api
    .post("/slide-template", {
      name: data.name,
      description: data.description,
      is_private: !!data.is_private,
      category: data.category,
      slide_id: slide.value.id,
    })
    .then((response) => {
      templates.value.push(response.data);

      slide.value.template = response.data;
      presentationsStore.syncCurrentSlideWithPresentationSlides();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      showCreateTemplateDialog.value = false;
    });
};

/*
 * edit template
 */
const showEditTemplateDialog = ref(false);

const handleUpdatingTemplate = (data) => {
  api
    .patch(`/slide-template/${slide.value.template.id}`, {
      name: data.name,
      description: data.description,
      is_private: data.is_private,
      category: data.category,
    })
    .then((response) => {
      templates.value = templates.value.map((item) => {
        if (item.id === slide.value.template.id) {
          item = {
            ...item,
            name: response.data.name,
            description: response.data.description,
            category: response.data.category,
            is_private: response.data.is_private,
          };
          slide.value.template = response.data;
          presentationsStore.syncCurrentSlideWithPresentationSlides();
        }

        return item;
      });
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      showEditTemplateDialog.value = false;
    });
};

/*
 * delete template
 */
const handleTemplateDeletion = (template) => {
  api
    .delete(`/slide-template/${template.id}`)
    .then(() => {
      templates.value = templates.value.filter(
        (item) => item.id !== template.id
      );

      slide.value.template = null;
      presentationsStore.syncCurrentSlideWithPresentationSlides();
    })
    .catch((error) => {
      console.log(error);
    });
};
</script>

<style scoped lang="scss">
/*
 * templates
 */
.templates_grid {
  display: flex;
  flex-wrap: wrap;
  columns: 3;
  gap: 16px;

  .item:nth-last-child(-n + 3) {
    margin-bottom: 0;
  }
}

.template {
  max-width: 110px;
  width: 100%;
  display: inline-block;
  cursor: pointer;
  transition: 0.2s;
  margin-bottom: 16px;
  border-radius: 8px;

  .q-img {
    border-radius: 8px;
    border: 1.5px solid $grey-2;
    outline: 3px solid transparent;
    transition: 0.2s;
  }

  &:hover {
    .q-img {
      outline: 3px solid $blue-2;
    }
  }

  &.template--active {
    color: $black;

    .q-img {
      border: 1.5px solid $primary;
      outline: 3px solid $blue-2;
    }
  }
}
</style>
