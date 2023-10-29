<template>
  <q-card flat class="q-pa-sm">
    <q-card-section class="q-pa-lg">
      <div class="row no-wrap items-center justify-between">
        <div class="text-h6 text-semibold">
          {{ $t("presentationLayout.header.share.title") }}
        </div>

        <div>
          <q-btn
            color="grey"
            round
            flat
            icon="r_close"
            size="12px"
            style="border-radius: 50%"
            @click="$emit('cancel')"
          />
        </div>
      </div>

      <div class="row no-wrap q-mt-md">
        <div class="full-height">
          <q-tabs
            v-model="tab"
            align="justify"
            class="bg-white text-black text-white"
            inline-label
            vertical
          >
            <q-tab
              v-for="tab in tabOptions"
              :key="tab.name"
              :name="tab.name"
              :disable="tab.disable"
              no-caps
            >
              <div>
                <q-icon :name="tab.icon" size="22px" />
                <div class="text-caption q-mt-xs">{{ tab.label }}</div>
              </div>
            </q-tab>
          </q-tabs>
        </div>

        <q-tab-panels v-model="tab" animated vertical style="width: 100%">
          <q-tab-panel name="inviteAudience">
            <!-- link -->
            <div class="text-semibold">
              {{
                $t("presentationLayout.header.share.inviteAudience.link.title")
              }}
            </div>

            <div class="q-pt-sm row no-wrap q-gutter-md">
              <div
                class="bg-grey-2 q-py-sm q-px-md row no-wrap items-center"
                style="width: 100%; border-radius: 8px"
              >
                <span class="cursor-not-allowed text-grey-8">
                  {{ host }}/room/
                </span>
                <b class="cursor-pointer">
                  {{ presentation?.room?.token }}

                  <q-popup-edit
                    v-if="presentation?.room?.token"
                    v-model="presentation.room.token"
                    v-slot="scope"
                    ref="qPopupEditProxy"
                    @update:model-value="
                      () => {
                        presentationsStore
                          .sendPresentationRoomUpdateEvent(
                            presentation.id,
                            presentation.room.id,
                            null,
                            presentation.room.token
                          )
                          .then(() => {
                            qrCodeElement = null;
                            handleQrCodeGeneration();
                          })
                          .catch((error) => {
                            presentation.room.token = error.details.token;

                            $q.notify({
                              message: error.message,
                              color: 'red',
                              icon: 'r_crisis_alert',
                            });
                          });
                      }
                    "
                  >
                    <q-input
                      v-model="scope.value"
                      dense
                      type="text"
                      autofocus
                      :min="1"
                      :max="10"
                      mask="XXXXXXXXXX"
                      hide-bottom-space
                      :rules="[(val) => !!val || $t('errors.fieldIsRequired')]"
                      @keyup.enter="scope.set"
                    />
                  </q-popup-edit>
                </b>

                <q-space />

                <q-icon
                  name="r_edit"
                  color="primary"
                  class="q-ml-sm cursor-pointer"
                  @click="() => $refs.qPopupEditProxy.show()"
                />
              </div>

              <div>
                <q-btn
                  outline
                  color="primary"
                  no-caps
                  no-wrap
                  :icon-right="isRoomLinkCopied ? 'r_done' : 'r_copy'"
                  :label="
                    $t(
                      'presentationLayout.header.share.inviteAudience.link.copy'
                    )
                  "
                  @click="handleRoomLinkCopyToClipboard()"
                />
              </div>
            </div>

            <!-- qr -->
            <div class="text-semibold q-mt-lg">
              {{
                $t("presentationLayout.header.share.inviteAudience.qr.title")
              }}
            </div>

            <div ref="qrCodeElement" class="q-mt-sm"></div>

            <q-btn
              outline
              color="primary"
              :label="
                $t('presentationLayout.header.share.inviteAudience.qr.download')
              "
              no-caps
              icon-right="r_download"
              style="width: 150px"
              @click="handleQrCodeDownload()"
            />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { usePresentationsStore } from "stores/presentations";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { copyToClipboard } from "quasar";
import { generateQrCode } from "src/helpers/qrUtils";

const { t } = useI18n({ useScope: "global" });

/*
 * stores
 */
const presentationsStore = usePresentationsStore();
const { presentation } = storeToRefs(presentationsStore);

/*
 * tabs
 */
const tabOptions = [
  {
    name: "inviteAudience",
    label: t("presentationLayout.header.share.inviteAudience.title"),
    icon: "r_devices",
    disable: !presentation.value?.room,
  },
  {
    name: "addEditor",
    label: t("presentationLayout.header.share.addEditor.title"),
    icon: "r_person_add",
    disable: true,
  },
  {
    name: "shareSlides",
    label: t("presentationLayout.header.share.shareSlides.title"),
    icon: "r_ios_share",
    disable: true,
  },
  {
    name: "publish",
    label: t("presentationLayout.header.share.publish.title"),
    icon: "r_public",
    disable: true,
  },
];

const tab = ref(tabOptions[0].name);

/*
 * room link
 */
const host = window.location.origin;

const isRoomLinkCopied = ref(false);
const roomLinkCopiedTimeout = ref();

const roomLink = computed(() => {
  return `${host}/room/${presentation.value?.room?.token}`;
});

const handleRoomLinkCopyToClipboard = () => {
  clearTimeout(roomLinkCopiedTimeout.value);
  copyToClipboard(roomLink.value);
  isRoomLinkCopied.value = true;

  roomLinkCopiedTimeout.value = setTimeout(() => {
    isRoomLinkCopied.value = false;
  }, 3000);
};

/*
 * qr
 */
const qrCodeElement = ref();
const qrCode = ref();

const handleQrCodeDownload = () => {
  qrCode.value.download({ name: "qr", extension: "png" });
};

onMounted(() => {
  handleQrCodeGeneration();
});

const handleQrCodeGeneration = () => {
  qrCode.value = generateQrCode(
    150,
    150,
    roomLink.value,
    window.location.origin + "/logo.png",
    "#FFFFFF",
    "#000000"
  );
  qrCode.value.append(qrCodeElement.value);
};
</script>

<style scoped lang="scss">
.q-card {
  width: 100%;
  max-width: 700px;
  border-radius: 16px !important;
}

::v-deep(.q-tab) {
  border-radius: 16px;
  padding: 8px;
  width: 100px;
  white-space: pre-wrap;

  &.q-tab--active {
    background: $blue-1;
    color: $primary;

    .q-tab__content {
      div {
        font-weight: 600;
      }
    }
  }

  .q-tab__indicator {
    display: none;
  }
}

::v-deep(.q-tab-panel) {
  padding: 0;
  padding-left: 16px;
}

.q-btn {
  width: 100%;
}
</style>
