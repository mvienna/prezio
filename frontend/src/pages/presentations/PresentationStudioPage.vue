<template>
  <q-page>
    <!-- websockets connection interrupted -->
    <WebSocketsConnectionInterrupted
      v-if="!isConnectedToWebSockets"
      @reconnect="connectToRoomChannels()"
    />

    <!-- top toolbar -->
    <PresentationStudioToolbarTop />

    <!-- slide -->
    <div class="slide__wrapper row justify-center items-start q-pa-md fit">
      <div class="slide__wrapper__inner row items-start">
        <teleport
          :disabled="!isPresentationPreview"
          :to="isPresentationPreview ? '#presentationPreview' : 'body'"
        >
          <div class="slide relative-position" id="stage-parent">
            <div id="container"></div>

            <!-- slide data (reactions, answers, participants online) -->
            <PresentationStudioRoomData />
          </div>
        </teleport>
      </div>
    </div>

    <!-- context menu-->
    <PresentationStudioElementsContextMenu
      v-if="
        (transformer.default?.nodes()?.length ||
          transformer.custom.shape.node) &&
        slide?.type === SLIDE_TYPES.CONTENT
      "
    />

    <!-- addons -->
    <PresentationAddons
      v-if="isLoaded && slide?.type !== SLIDE_TYPES.CONTENT"
    />

    <!-- actions (results) -->
    <PresentationStudioRoomActions />

    <!-- slide header (invitation link, open sharing modal) -->
    <PresentationStudioSlideHeader />

    <!-- bottom toolbar -->
    <PresentationStudioToolbarBottom />
  </q-page>
</template>

<script setup>
import { onBeforeMount, onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { QSpinnerIos, useMeta, useQuasar } from "quasar";
import { usePresentationsStore } from "stores/presentations";
import { useAuthStore } from "stores/auth";
import Echo from "laravel-echo";
import PresentationStudioToolbarBottom from "components/presentationStudio/toolbar/bottom/PresentationStudioToolbarBottom.vue";
import PresentationStudioToolbarTop from "components/presentationStudio/toolbar/top/PresentationStudioToolbarTop.vue";
import { useStudioStore } from "stores/studio";
import { ROUTE_PATHS } from "src/constants/routes";
import WebSocketsConnectionInterrupted from "components/WebSocketsConnectionInterrupted.vue";
import PresentationStudioSlideHeader from "components/presentationStudio/PresentationStudioSlideHeader.vue";
import PresentationStudioRoomActions from "components/presentationStudio/toolbar/PresentationStudioRoomActions.vue";
import PresentationStudioElementsContextMenu from "components/presentationStudio/PresentationStudioElementsContextMenu.vue";
import { SLIDE_TYPES } from "src/constants/presentationStudio";
import PresentationStudioRoomData from "components/presentationStudio/PresentationStudioRoomData.vue";
import PresentationAddons from "components/presentation/addons/PresentationAddons.vue";

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const $q = useQuasar();

const router = useRouter();

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation, slide, participants, isPresentationPreview } =
  storeToRefs(presentationsStore);

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const studioStore = useStudioStore();
const {
  layers,
  selection,
  mode,
  MODE_OPTIONS,
  transformer,
  isLoaded,
  history,
} = storeToRefs(studioStore);

/*
 * canvas setup
 */
onBeforeMount(() => {
  $q.loading.show({
    spinner: QSpinnerIos,
    message: t("loading.fetchingData"),
  });
});

onMounted(async () => {
  /*
   * fetch presentation data
   */
  await presentationsStore
    .fetchPresentationData(router.currentRoute.value.params.presentation_id)
    .catch((error) => {
      $q.notify({
        message: error,
        color: "red",
        icon: "r_crisis_alert",
      });

      router.push(ROUTE_PATHS.PRESENTATIONS_BROWSER);
    });

  /*
   * load studio
   */
  await studioStore.loadStudio();

  /*
   * establish connection to room channels
   */
  connectToRoomChannels();

  /*
   * hide loader
   */
  $q.loading.hide();
});

watch(
  () => slide.value,
  () => {
    studioStore.loadStudio();
    history.value.undo = [];
    history.value.redo = [];
  },
);

/*
 * webhooks
 */
const isConnectedToWebSockets = ref(true);

const connectToRoomChannels = () => {
  const channel = window.Echo.channel(
    `public.room.${presentation.value.room.id}`,
  );

  window.Echo = new Echo({
    ...window.Echo.options,
    auth: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "X-CSRF-Token": "CSRF_TOKEN",
      },
    },
  });

  window.Echo.join(`presence.room.${presentation.value.room.id}`)
    .here((users) => {
      participants.value = users.filter(
        (item) => item.id !== user.value?.id && item.room_id,
      );
    })
    .joining((userJoined) => {
      participants.value.push(userJoined);
    })
    .leaving((userLeft) => {
      participants.value = participants.value.filter(
        (item) => item.id !== userLeft?.id && item.room_id,
      );
    });

  window.Echo.connector.pusher.connection.bind("connected", () => {
    isConnectedToWebSockets.value = true;
  });

  window.Echo.connector.pusher.connection.bind("disconnected", () => {
    isConnectedToWebSockets.value = false;
  });

  /*
   * listen for new reactions
   */
  channel.listen("PresentationRoomNewReactionEvent", (event) => {
    if (!presentation.value.room) {
      presentation.value.room = {};
    }

    presentation.value.room.reactions = event.reactions;
  });

  /*
   * listen for new submitted answers
   */
  channel.listen("PresentationRoomAnswersSubmittedEvent", (event) => {
    slide.value.answers = [...slide.value.answers, ...event.answers];
    presentationsStore.syncCurrentSlideWithPresentationSlides();
  });

  channel.listen("PresentationRoomAnswerUpdatedEvent", (event) => {
    const answerIndex = slide.value.answers.findIndex(
      (answer) => answer.id === event.data.id,
    );
    slide.value.answers[answerIndex] = event.data;
  });

  /*
   * listen for room termination
   */
  channel.listen("PresentationRoomTerminatedEvent", () => {});
};

/*
 * meta
 */
const metaOptions = {
  title: t("meta.presentation.studio.title"),
  titleTemplate: (title) => `${title} - ${t("meta.app")}`,

  // meta tags
  meta: {
    description: {
      name: "description",
      content: t("meta.presentation.studio.description"),
    },
    keywords: {
      name: "keywords",
      content: t("meta.presentation.studio.keywords"),
    },
    equiv: {
      "http-equiv": "Content-Type",
      content: "text/html; charset=UTF-8",
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogTitle: {
      property: "og:title",
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogTitle) {
        return `${ogTitle} - ${t("meta.app")}`;
      },
    },
  },
};

if (window.location.host === process.env.STAGING_HOST) {
  metaOptions.meta.robots = {
    name: "robots",
    content: "noindex, nofollow",
  };
}

useMeta(metaOptions);
</script>

<style lang="scss">
.slide__wrapper {
  .slide__wrapper__inner {
    flex: 1;
    padding-top: 55px;
    max-width: calc((100vh - 58px - 55px - 60px - 32px) * 16 / 9);
    width: 100%;

    .slide {
      width: 100%;
      height: auto;
      aspect-ratio: 16 / 9;
      background: $white;
      border-radius: 8px;
      overflow-x: hidden;
    }
  }
}
</style>

<style lang="scss">
.chaport-container {
  display: block;
}
</style>
