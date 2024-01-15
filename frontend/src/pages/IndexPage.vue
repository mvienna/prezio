<template>
  <q-page>
    <q-header class="bg-transparent" bordered>
      <div class="bg-white">
        <div class="container">
          <q-toolbar class="q-pa-md row no-wrap items-center">
            <!-- logo -->
            <div class="row no-wrap">
              <img src="/prezio.svg" style="height: 38px" />

              <div class="q-ml-sm column">
                <q-badge
                  class="bg-grey-2 text-grey-7"
                  style="font-size: 10px; margin-top: 3px"
                  :label="VERSION"
                />
              </div>
            </div>

            <q-space />

            <template v-if="$q.screen.lt.xl">
              <q-btn
                flat
                round
                :icon="showMobileMenu ? 'r_close' : 'r_menu'"
                class="round-borders"
                color="black"
                @click="showMobileMenu = !showMobileMenu"
              />
            </template>

            <template v-else>
              <!-- hyperlinks -->
              <a href="#features" class="text-16 link text-black">
                {{ $t("landing.hyperlinks.features") }}
              </a>
              <a href="#prices" class="text-16 link text-black q-mx-md">
                {{ $t("landing.hyperlinks.prices") }}
              </a>
              <a href="#faq" class="text-16 link text-black">
                {{ $t("landing.hyperlinks.faq") }}
              </a>

              <q-space />

              <!-- login -->
              <q-btn
                outline
                :label="$t('landing.auth.login')"
                no-caps
                size="16px"
                class="q-mr-md q-px-md"
                style="min-height: 38px"
                :href="appUrl + ROUTE_PATHS.AUTH.LOGIN"
              />

              <!-- signup -->
              <q-btn
                unelevated
                color="primary"
                :label="$t('landing.auth.signup')"
                no-caps
                size="16px"
                class="q-px-md"
                style="min-height: 38px"
                :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
              />
            </template>
          </q-toolbar>
        </div>
      </div>
    </q-header>

    <!-- join room toolbar -->
    <q-slide-transition>
      <q-toolbar
        v-if="showJoinRoomToolbar"
        class="justify-center items-center q-pa-sm no-wrap join_room"
        :class="$q.screen.lt.xl ? 'column' : 'row'"
      >
        <div
          class="text-black"
          :class="$q.screen.lt.xl ? 'q-mb-sm' : 'q-mr-sm'"
        >
          {{ $t("landing.joinRoom.title") }}
        </div>

        <!-- join room with token -->
        <form @submit.prevent="handleRoomSearch()">
          <q-input
            v-model="roomId"
            borderless
            dense
            class="join_room__token_input"
            :class="{ 'join_room__token_input--error': !!roomSearchError }"
            :placeholder="$t('landing.joinRoom.enterCode')"
            :prefix="$t('landing.joinRoom.url')"
            hide-bottom-space
            no-error-icon
          >
            <template #append>
              <!-- join room -->
              <q-btn
                unelevated
                :label="$t('landing.joinRoom.join')"
                color="grey-2"
                text-color="black"
                size="12px"
                no-caps
                class="q-px-sm"
                :loading="isSearchingForRoom"
                @click="handleRoomSearch()"
              />
            </template>
          </q-input>
        </form>

        <!-- close join room toolbar -->
        <q-btn
          v-if="!$q.screen.lt.xl"
          flat
          round
          size="10px"
          color="black"
          icon="r_close"
          class="absolute round-borders"
          style="top: 50%; transform: translateY(-50%); right: 24px"
          @click="showJoinRoomToolbar = false"
        />
      </q-toolbar>
    </q-slide-transition>

    <transition
      appear
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
    >
      <div
        v-if="showMobileMenu"
        class="fixed-full bg-white column no-wrap"
        style="z-index: 9999999999999; margin-top: 75px"
      >
        <div class="column no-wrap q-gutter-lg q-py-lg q-px-lg">
          <!-- hyperlinks -->
          <a
            href="#features"
            class="text-16 link text-black"
            @click="showMobileMenu = false"
          >
            {{ $t("landing.hyperlinks.features") }}
            <q-icon name="r_arrow_forward_ios" class="q-ml-xs" size="14px" />
          </a>
          <a
            href="#prices"
            class="text-16 link text-black"
            @click="showMobileMenu = false"
          >
            {{ $t("landing.hyperlinks.prices") }}
            <q-icon name="r_arrow_forward_ios" class="q-ml-xs" size="14px" />
          </a>
          <a
            href="#faq"
            class="text-16 link text-black"
            @click="showMobileMenu = false"
          >
            {{ $t("landing.hyperlinks.faq") }}
            <q-icon name="r_arrow_forward_ios" class="q-ml-xs" size="14px" />
          </a>
        </div>

        <q-space />

        <div class="column no-wrap q-gutter-md q-py-lg q-px-lg">
          <!-- login -->
          <q-btn
            outline
            :label="$t('landing.auth.login')"
            no-caps
            size="16px"
            class="q-px-md"
            style="min-height: 48px"
            :href="appUrl + ROUTE_PATHS.AUTH.LOGIN"
          />

          <!-- signup -->
          <q-btn
            unelevated
            color="primary"
            :label="$t('landing.auth.signup')"
            no-caps
            size="16px"
            class="q-px-md"
            style="min-height: 48px"
            :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
          />
        </div>
      </div>
    </transition>

    <!-- heroes -->
    <section>
      <div class="container">
        <div class="splitter">
          <div class="column no-wrap">
            <!-- title -->
            <div
              class="text-semibold"
              :class="$q.screen.lt.xl ? 'text-center text-h4' : 'text-h3'"
              style="line-height: 1.2"
            >
              {{ $t("landing.heroes.title.static") }} <br />

              <span
                class="typewrite text-primary"
                data-period="4000"
                :data-type="dynamicTitles"
              >
                <span class="wrap"></span>
              </span>
            </div>

            <!-- description -->
            <div
              class="text-20 q-my-lg q-py-sm"
              :class="$q.screen.lt.xl ? 'text-center ' : ''"
              :style="$q.screen.lt.xl ? 'margin: 24px auto;' : ''"
              style="max-width: 500px"
            >
              {{ $t("landing.heroes.description") }}
            </div>

            <q-space />

            <!-- create presentation -->
            <div :class="$q.screen.lt.xl ? 'row justify-center' : ''">
              <q-btn
                :label="$t('landing.heroes.action')"
                unelevated
                color="primary"
                no-caps
                size="16px"
                :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
              />
            </div>
          </div>

          <!-- heroes illustration -->
          <div :class="$q.screen.lt.xl ? 'q-px-lg q-mt-xl' : ''">
            <q-img
              src="/assets/illustrations/heroes.svg"
              alt="Prezio heroes illustration"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- features -->
    <section class="bg-white">
      <div class="container">
        <div>
          <!-- title -->
          <div
            class="text-h4 text-semibold text-center"
            :class="$q.screen.lt.xl ? 'q-px-lg' : ''"
          >
            {{ $t("landing.features.title") }}
          </div>

          <!-- description -->
          <div class="row justify-center">
            <div
              class="text-center q-mt-3xs q-mb-xl text-grey-9"
              :class="$q.screen.lt.xl ? 'q-px-md text-18' : 'text-20'"
              style="max-width: 900px"
            >
              {{ $t("landing.features.description") }}
            </div>
          </div>

          <div
            class="feature_cards_grid scroll--hidden"
            :class="$q.screen.lt.xl ? 'q-px-lg' : ''"
          >
            <template v-for="n in 3" :key="n">
              <q-card flat class="feature_card">
                <q-card-section>
                  <q-img
                    :src="`assets/images/landing/features/${$t(
                      `landing.features.${n}.img`
                    )}`"
                  />

                  <div class="q-pa-sm q-mt-md">
                    <div class="text-h6 text-semibold q-mb-sm">
                      {{ $t(`landing.features.${n}.title`) }}
                    </div>

                    <div class="">
                      {{ $t(`landing.features.${n}.description`) }}
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </template>
          </div>
        </div>
      </div>
    </section>

    <!-- mechanics -->
    <section id="mechanics">
      <div class="container">
        <div class="q-px-lg">
          <!-- title -->
          <div
            class="text-h4 text-semibold text-center q-mb-xl"
            :class="!$q.screen.lt.lg ? 'q-pb-xl' : ''"
            v-html="$t('landing.mechanics.title')"
          ></div>

          <!-- quiz - pick answer -->
          <div class="splitter">
            <div
              :style="!$q.screen.lt.lg ? 'max-width: 500px' : ''"
              :class="$q.screen.lt.lg ? 'q-mb-md' : ''"
            >
              <!-- title -->
              <div class="text-30 text-semibold">
                {{ $t("landing.mechanics.pickAnswer.title") }}
              </div>

              <!-- description -->
              <div class="q-mt-md text-16 q-mb-lg">
                {{ $t("landing.mechanics.pickAnswer.description") }}
              </div>

              <!-- bullet list -->
              <div class="column no-wrap q-gutter-md">
                <div class="row no-wrap items-center">
                  <div
                    class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                  >
                    <q-icon name="r_done" color="primary" size="16px" />
                  </div>

                  <div class="text-16 q-ml-3xs">
                    {{ $t("landing.mechanics.pickAnswer.list.one") }}
                  </div>
                </div>

                <div class="row no-wrap items-center">
                  <div
                    class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                  >
                    <q-icon name="r_done" color="primary" size="16px" />
                  </div>

                  <div class="text-16 q-ml-3xs">
                    {{ $t("landing.mechanics.pickAnswer.list.two") }}
                  </div>
                </div>

                <div class="row no-wrap items-center">
                  <div
                    class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                  >
                    <q-icon name="r_done" color="primary" size="16px" />
                  </div>

                  <div class="text-16 q-ml-3xs">
                    {{ $t("landing.mechanics.pickAnswer.list.three") }}
                  </div>
                </div>
              </div>
            </div>

            <div
              class="row justify-end"
              :class="$q.screen.lt.lg ? 'q-mt-lg' : ''"
            >
              <div
                style="width: 100%"
                :style="!$q.screen.lt.lg ? 'max-width: 500px;' : ''"
              >
                <q-img
                  src="/assets/images/landing/mechanics/quiz_pick_answer.svg"
                  class="rounded-3xs"
                />
              </div>
            </div>
          </div>

          <!-- quiz - leaderboard -->
          <div class="splitter q-py-xl q-my-xl">
            <div v-if="!$q.screen.lt.lg" style="max-width: 500px; width: 100%">
              <q-img
                src="/assets/images/landing/mechanics/quiz_leaderboard.svg"
                class="rounded-3xs"
              />
            </div>

            <div
              class="row"
              :class="$q.screen.lt.lg ? 'q-mb-md' : 'justify-end'"
            >
              <div :style="!$q.screen.lt.lg ? 'max-width: 500px' : ''">
                <!-- title -->
                <div class="text-30 text-semibold">
                  {{ $t("landing.mechanics.leaderboard.title") }}
                </div>

                <!-- description -->
                <div class="q-mt-md text-16 q-mb-lg">
                  {{ $t("landing.mechanics.leaderboard.description") }}
                </div>

                <!-- bullet list -->
                <div class="column no-wrap q-gutter-md">
                  <div class="row no-wrap items-center">
                    <div
                      class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                    >
                      <q-icon name="r_done" color="primary" size="16px" />
                    </div>

                    <div class="text-16 q-ml-3xs">
                      {{ $t("landing.mechanics.leaderboard.list.one") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                    >
                      <q-icon name="r_done" color="primary" size="16px" />
                    </div>

                    <div class="text-16 q-ml-3xs">
                      {{ $t("landing.mechanics.leaderboard.list.two") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                    >
                      <q-icon name="r_done" color="primary" size="16px" />
                    </div>

                    <div class="text-16 q-ml-3xs">
                      {{ $t("landing.mechanics.leaderboard.list.three") }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="$q.screen.lt.lg" class="q-mt-lg" style="width: 100%">
              <q-img
                src="/assets/images/landing/mechanics/quiz_leaderboard.svg"
                class="rounded-3xs"
              />
            </div>
          </div>

          <!-- quiz - wordcloud -->
          <div class="splitter">
            <div
              :style="!$q.screen.lt.lg ? 'max-width: 500px' : ''"
              :class="$q.screen.lt.lg ? 'q-mb-md' : ''"
            >
              <!-- title -->
              <div class="text-30 text-semibold">
                {{ $t("landing.mechanics.wordcloud.title") }}
              </div>

              <!-- description -->
              <div class="q-mt-md text-16 q-mb-lg">
                {{ $t("landing.mechanics.wordcloud.description") }}
              </div>

              <!-- bullet list -->
              <div class="column no-wrap q-gutter-md">
                <div class="row no-wrap items-center">
                  <div
                    class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                  >
                    <q-icon name="r_done" color="primary" size="16px" />
                  </div>

                  <div class="text-16 q-ml-3xs">
                    {{ $t("landing.mechanics.wordcloud.list.one") }}
                  </div>
                </div>

                <div class="row no-wrap items-center">
                  <div
                    class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                  >
                    <q-icon name="r_done" color="primary" size="16px" />
                  </div>

                  <div class="text-16 q-ml-3xs">
                    {{ $t("landing.mechanics.wordcloud.list.two") }}
                  </div>
                </div>

                <div class="row no-wrap items-center">
                  <div
                    class="row items-center justify-center round-borders q-pa-3xs bg-blue-1"
                  >
                    <q-icon name="r_done" color="primary" size="16px" />
                  </div>

                  <div class="text-16 q-ml-3xs">
                    {{ $t("landing.mechanics.wordcloud.list.three") }}
                  </div>
                </div>
              </div>
            </div>

            <div
              class="row justify-end"
              :class="$q.screen.lt.lg ? 'q-mt-lg' : ''"
            >
              <div
                style="width: 100%"
                :style="!$q.screen.lt.lg ? 'max-width: 500px;' : ''"
              >
                <q-img
                  src="/assets/images/landing/mechanics/quiz_wordcloud.svg"
                  class="rounded-3xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- tools -->
    <section id="tools" class="bg-white">
      <div class="container">
        <div>
          <!-- title -->
          <div
            class="text-h4 text-semibold text-center"
            :class="$q.screen.lt.xl ? 'q-px-lg ' : ''"
          >
            {{ $t("landing.tools.title") }}
          </div>

          <!-- description -->
          <div
            class="row justify-center"
            :class="$q.screen.lt.xl ? 'q-px-lg text-18' : 'text-20'"
          >
            <div
              class="text-center q-mt-3xs q-mb-xl text-grey-9"
              style="max-width: 800px"
            >
              {{ $t("landing.tools.description") }}
            </div>
          </div>

          <!-- bento -->
          <div :class="$q.screen.lt.xl ? 'q-px-lg' : ''">
            <div
              class="no-wrap"
              :class="`${$q.screen.lt.lg ? 'column q-gutter-lg ' : 'row'} ${
                $q.screen.lt.xl && !$q.screen.lt.lg ? 'q-mr-lg' : ''
              }`"
            >
              <!-- studio -->
              <div
                :class="$q.screen.lt.lg ? 'col-12' : 'col-7 q-mr-lg q-pr-sm'"
              >
                <q-card flat class="bg-grey-1 rounded-xl">
                  <q-card-section class="q-pa-lg">
                    <div class="text-30 text-semibold">
                      {{ $t("landing.tools.bento.studio.title") }}
                    </div>
                    <div class="text-16 q-mt-3xs q-mb-lg">
                      {{ $t("landing.tools.bento.studio.description") }}
                    </div>

                    <q-img src="assets/images/landing/tools/studio.png" />
                  </q-card-section>
                </q-card>
              </div>

              <div
                class="column no-wrap items-stretch"
                :class="$q.screen.lt.lg ? 'col-12' : 'col-5'"
              >
                <!-- stock -->
                <div class="q-mb-lg q-pb-sm">
                  <q-card flat class="bg-grey-1 rounded-xl">
                    <q-card-section class="q-px-lg q-pt-lg q-pb-none">
                      <div class="text-30 text-semibold">
                        {{ $t("landing.tools.bento.stock.title") }}
                      </div>

                      <div class="text-16 q-mt-3xs q-mb-lg">
                        {{ $t("landing.tools.bento.stock.description") }}
                      </div>

                      <q-img src="assets/images/landing/tools/stock.png" />
                    </q-card-section>
                  </q-card>
                </div>

                <!-- emojis & gifs -->
                <q-card flat class="bg-grey-1 rounded-xl" style="height: 100%">
                  <q-card-section
                    class="q-px-lg q-pt-lg q-pb-none relative-position overflow-hidden"
                    style="height: 100%"
                    :class="$q.screen.lt.lg ? 'q-pb-xl' : ''"
                  >
                    <div class="text-30 text-semibold">
                      {{ $t("landing.tools.bento.emojisAndGifs.title") }}
                    </div>

                    <div
                      class="text-16 q-mt-3xs q-mb-md"
                      :class="$q.screen.lt.lg ? 'q-pb-xl q-mb-lg' : ''"
                    >
                      {{ $t("landing.tools.bento.emojisAndGifs.description") }}
                    </div>

                    <q-img
                      src="assets/images/landing/tools/sparkles.png"
                      style="width: 120px; bottom: -30px"
                      :style="
                        $q.screen.lt.md
                          ? 'left: 24px; bottom: -16px;'
                          : 'left: 50%; transform: translateX(-50%);'
                      "
                      class="absolute"
                    />
                    <q-img
                      src="assets/images/landing/tools/unicorn.png"
                      style="width: 140px; bottom: -30px; right: 24px"
                      class="absolute"
                    />
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <div
              class="no-wrap"
              :class="`${
                $q.screen.lt.lg
                  ? 'column q-gutter-lg q-pt-lg'
                  : 'row q-mt-lg q-pt-sm'
              } ${$q.screen.lt.xl && !$q.screen.lt.lg ? 'q-mr-lg' : ''}`"
            >
              <!-- online chat -->
              <q-card
                flat
                class="bg-grey-1 rounded-xl"
                :class="$q.screen.lt.lg ? 'col-12' : 'col-5'"
              >
                <q-card-section
                  class="q-pa-lg column no-wrap"
                  style="height: 100%"
                >
                  <div class="text-30 text-semibold">
                    {{ $t("landing.tools.bento.onlineChat.title") }}
                  </div>
                  <div class="text-16 q-mt-3xs">
                    {{ $t("landing.tools.bento.onlineChat.description") }}
                  </div>

                  <q-space />

                  <q-img
                    src="assets/images/landing/tools/online_chat.png"
                    :class="$q.screen.lt.lg ? 'q-mt-md' : ''"
                    style="max-width: 350px; width: 100%"
                  />
                </q-card-section>
              </q-card>

              <!-- templates  -->
              <div
                :class="
                  $q.screen.lt.lg ? 'col-12 q-mt-lg' : 'col-7 q-ml-lg q-pl-sm'
                "
              >
                <q-card flat class="bg-grey-1 rounded-xl">
                  <q-card-section class="q-py-lg q-pl-lg q-pr-none">
                    <div class="q-pr-lg">
                      <div class="text-30 text-semibold">
                        {{ $t("landing.tools.bento.templates.title") }}
                      </div>

                      <div class="text-16 q-mt-3xs q-mb-lg">
                        {{ $t("landing.tools.bento.templates.description") }}
                      </div>
                    </div>

                    <q-img src="assets/images/landing/tools/templates.png" />
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- prices -->
    <section id="prices">
      <div class="container">
        <div>
          <!-- title -->
          <div class="text-h4 text-semibold text-center">
            {{ $t("landing.prices.title") }}
          </div>

          <!-- description -->
          <div
            class="row justify-center text-grey-9"
            :class="$q.screen.lt.lg ? 'q-px-lg text-18' : 'text-20'"
          >
            <div class="text-center q-mt-3xs q-mb-xl" style="max-width: 800px">
              {{ $t("landing.prices.description") }}
            </div>
          </div>

          <!-- plans -->
          <div class="plans_grid" :class="$q.screen.lt.lg ? 'q-px-lg' : ''">
            <!-- free -->
            <q-card flat bordered class="bg-white">
              <q-card-section>
                <!-- title -->
                <div class="text-18 text-semibold">
                  {{ $t("landing.prices.plans.free.title") }}
                </div>

                <!-- description -->
                <div class="q-mt-sm text-grey">
                  {{ $t("landing.prices.plans.free.description") }}
                </div>

                <!-- price & period -->
                <div class="row no-wrap items-end q-my-md">
                  <div class="text-h4 text-semibold">
                    {{ $t("landing.prices.plans.free.price") }}
                  </div>
                  <div class="text-grey q-mb-sm q-ml-xs text-weight-medium">
                    {{ $t("landing.prices.plans.free.period") }}
                  </div>
                </div>

                <!-- participants limit -->
                <div class="row no-wrap items-center">
                  <q-icon
                    name="icon-profile_group"
                    color="primary"
                    size="20px"
                  />
                  <div class="text-semibold q-ml-sm">
                    {{ $t("landing.prices.plans.free.participantsLimit") }}
                  </div>
                </div>

                <q-separator />

                <!-- features -->
                <div class="column no-wrap q-gutter-sm">
                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.free.features.one") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.free.features.two") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.free.features.three") }}
                    </div>
                  </div>
                </div>

                <q-separator />

                <!-- action -->
                <q-btn
                  outline
                  :label="$t('landing.prices.plans.free.action')"
                  no-caps
                  class="full-width"
                  :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
                />
              </q-card-section>
            </q-card>

            <!-- basic -->
            <q-card flat bordered class="bg-white overflow-hidden">
              <q-card-section
                style="
                  background-image: url('/assets/images/landing/plan_background.png');
                  background-size: cover;
                  background-position: top;
                  margin-top: -1px;
                "
              >
                <!-- title -->
                <div class="text-18 text-semibold">
                  {{ $t("landing.prices.plans.basic.title") }}
                </div>

                <!-- description -->
                <div class="q-mt-sm text-grey">
                  {{ $t("landing.prices.plans.basic.description") }}
                </div>

                <!-- price & period -->
                <div class="row no-wrap items-end q-my-md">
                  <div class="text-h4 text-semibold">
                    {{ $t("landing.prices.plans.basic.price") }}
                  </div>
                  <div class="text-grey q-mb-sm q-ml-xs text-weight-medium">
                    {{ $t("landing.prices.plans.basic.period") }}
                  </div>
                </div>

                <!-- participants limit -->
                <div class="row no-wrap items-center">
                  <q-icon
                    name="icon-profile_group"
                    color="primary"
                    size="20px"
                  />
                  <div class="text-semibold q-ml-sm">
                    {{ $t("landing.prices.plans.basic.participantsLimit") }}
                  </div>
                </div>

                <q-separator />

                <!-- features -->
                <div class="column no-wrap q-gutter-sm">
                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.basic.features.one") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.basic.features.two") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.basic.features.three") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.basic.features.four") }}
                    </div>
                  </div>
                </div>

                <q-separator />

                <!-- action -->
                <q-btn
                  unelevated
                  color="primary"
                  :label="$t('landing.prices.plans.basic.action')"
                  no-caps
                  class="full-width"
                  :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
                />
              </q-card-section>
            </q-card>

            <!-- pro -->
            <q-card flat bordered class="bg-white">
              <q-card-section>
                <!-- title -->
                <div class="text-18 text-semibold">
                  {{ $t("landing.prices.plans.pro.title") }}
                </div>

                <!-- description -->
                <div class="q-mt-sm text-grey">
                  {{ $t("landing.prices.plans.pro.description") }}
                </div>

                <!-- price & period -->
                <div class="row no-wrap items-end q-my-md">
                  <div class="text-h4 text-semibold">
                    {{ $t("landing.prices.plans.pro.price") }}
                  </div>
                  <div class="text-grey q-mb-sm q-ml-xs text-weight-medium">
                    {{ $t("landing.prices.plans.pro.period") }}
                  </div>
                </div>

                <!-- participants limit -->
                <div class="row no-wrap items-center">
                  <q-icon
                    name="icon-profile_group"
                    color="primary"
                    size="20px"
                  />
                  <div class="text-semibold q-ml-sm">
                    {{ $t("landing.prices.plans.pro.participantsLimit") }}
                  </div>
                </div>

                <q-separator />

                <!-- features -->
                <div class="column no-wrap q-gutter-sm">
                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.pro.features.one") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.pro.features.two") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.pro.features.three") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.pro.features.four") }}
                    </div>
                  </div>

                  <div class="row no-wrap items-center">
                    <div
                      class="round-borders bg-blue-1 row items-center justify-center q-pa-xs q-mr-sm"
                    >
                      <q-icon name="r_done" color="primary" size="12px" />
                    </div>

                    <div>
                      {{ $t("landing.prices.plans.pro.features.five") }}
                    </div>
                  </div>
                </div>

                <q-separator />

                <!-- action -->
                <q-btn
                  outline
                  :label="$t('landing.prices.plans.pro.action')"
                  no-caps
                  class="full-width"
                  :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
                />
              </q-card-section>
            </q-card>
          </div>

          <!-- contact -->
          <div
            class="text-weight-medium text-16 text-center q-mt-lg"
            :class="$q.screen.lt.lg ? 'q-px-lg' : ''"
          >
            {{ $t("landing.prices.contact.title") }}
            <span
              ><a href="mailto:hello@prezio.ru" class="link text-underline">
                {{ $t("landing.prices.contact.mail") }} </a
              >.
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- faq -->
    <section id="faq" class="bg-white">
      <div class="container">
        <div>
          <!-- title -->
          <div class="text-h4 text-semibold text-center q-mb-xl">
            {{ $t("landing.faq.title") }}
          </div>

          <div :class="$q.screen.lt.lg ? 'q-px-lg' : ''">
            <q-expansion-item
              v-for="n in 7"
              :key="n"
              group="faq"
              :label="$t(`landing.faq.list.${n}.title`)"
              expanded-icon="r_remove"
            >
              <div class="text-16 q-px-lg q-pb-lg">
                {{ $t(`landing.faq.list.${n}.description`) }}
              </div>
            </q-expansion-item>
          </div>
        </div>
      </div>
    </section>

    <!-- promo -->
    <section
      id="promo"
      class="promo relative-position overflow-hidden"
      :class="$q.screen.lt.xl ? 'q-px-lg' : ''"
    >
      <div class="q-px-md">
        <!-- title -->
        <div class="text-center text-h4 text-semibold">
          {{ $t("landing.promo.title") }}
        </div>

        <!-- description -->
        <div
          class="text-center q-mt-3xs text-grey-9"
          :class="$q.screen.lt.xl ? 'text-18' : 'text-20'"
        >
          {{ $t("landing.promo.description") }}
        </div>

        <!-- create presentation -->
        <div class="row justify-center q-mt-xl">
          <q-btn
            :label="$t('landing.promo.action')"
            unelevated
            color="primary"
            no-caps
            style="z-index: 1"
            size="16px"
            :href="appUrl + ROUTE_PATHS.AUTH.SIGNUP"
          />
        </div>

        <!-- background -->
        <div
          class="absolute"
          style="top: 0; left: 0; width: 100%; height: 100%"
        >
          <div class="container">
            <q-img
              src="/assets/images/landing/bubbles.png"
              class="full-width full-height"
              fit="cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- footer -->
    <section id="footer" class="no-padding">
      <div class="q-py-xl">
        <!-- logo -->
        <div class="row justify-center no-wrap">
          <img src="/prezio.svg" style="height: 30px" />

          <div class="q-ml-sm column">
            <q-badge
              class="bg-grey-2 text-grey-7"
              style="font-size: 10px; margin-top: 3px"
              :label="VERSION"
            />
          </div>
        </div>

        <div class="row justify-center q-mt-lg">
          <div class="text-center" style="max-width: 340px">
            {{ $t("landing.footer.title") }}
          </div>
        </div>
      </div>

      <div class="footer">
        <div
          class="q-py-lg q-my-sm text-12 row no-wrap"
          :class="$q.screen.lt.xl ? 'q-px-lg' : 'q-px-xl q-mx-xl'"
        >
          <div>
            © {{ new Date().getFullYear() }} Prezio -
            {{ $t("landing.footer.allRightsReserved") }}
          </div>

          <q-space />

          <div class="row items-center no-wrap">
            {{ $t("landing.footer.madeInRussia") }}
            <q-img
              src="/assets/images/landing/russia.png"
              style="width: 20px"
              class="q-ml-sm"
            />
          </div>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { useMeta, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { ROUTE_PATHS, SUBDOMAINS } from "src/constants/routes";
import { computed, onMounted, ref } from "vue";
import { api } from "boot/axios";
import { useRouter } from "vue-router";

/*
 * assembly version
 */
const VERSION = computed(() => {
  return process.env.VERSION;
});

/*
 * url
 */
const appUrl =
  // protocol
  window.location.protocol +
  "//" +
  // subdomain
  SUBDOMAINS.app +
  "." +
  // host
  window.location.host;

/*
 * variables
 */
const { t } = useI18n({ useScope: "global" });

const $q = useQuasar();
$q.screen.setSizes({ xs: 500, sm: 848, lg: 1048, xl: 1248 });

const router = useRouter();

/*
 * menu
 */
const showMobileMenu = ref(false);

/*
 * join room
 */
const showJoinRoomToolbar = ref(true);

const roomId = ref();
const roomSearchError = ref();
const isSearchingForRoom = ref(false);

const handleRoomSearch = () => {
  roomSearchError.value = null;
  isSearchingForRoom.value = true;

  api
    .get(`/room/${roomId.value}`)
    .then((response) => {
      router.push(response.data.room.token);
    })
    .catch((error) => {
      console.log(error);
      roomSearchError.value = error.response.data.message;

      $q.notify({
        message: error.response.data.message,
        textColor: "red",
        icon: "r_crisis_alert",
      });
    })
    .finally(() => {
      isSearchingForRoom.value = false;
    });
};

/*
 * typing animation
 */
const dynamicTitles = [
  t("landing.heroes.title.dynamic.one"),
  t("landing.heroes.title.dynamic.two"),
  t("landing.heroes.title.dynamic.three"),
];

const TxtType = function (el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = "";
  this.tick();
  this.isDeleting = false;
};

TxtType.prototype.tick = function () {
  let i = this.loopNum % this.toRotate.length;
  let fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  const colors = ["var(--q-primary)", "#F53535", "#8136DC"];
  const color = colors[i % colors.length];

  this.el.innerHTML = `<span class="wrap" style="color: ${color}; border-right: 0.08em solid ${color}; animation: pulse 1s infinite steps(1);">
    ${this.txt}
    </span>`;

  let that = this;
  let delta = 200 - Math.random() * 100;

  if (this.isDeleting) {
    delta /= 2;
  }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === "") {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(() => {
    that.tick();
  }, delta);
};

onMounted(() => {
  let elements = document.getElementsByClassName("typewrite");
  for (let i = 0; i < elements.length; i++) {
    let toRotate = elements[i].getAttribute("data-type");
    let period = elements[i].getAttribute("data-period");
    if (toRotate) {
      new TxtType(elements[i], toRotate.split(","), period);
    }
  }
});

/*
 * meta
 */
useMeta({
  title: t("meta.homepage.title", { split: "|" }),
  titleTemplate: (title) => title,

  // meta tags
  meta: {
    description: {
      name: "description",
      content: t("meta.homepage.description"),
    },
    keywords: {
      name: "keywords",
      content: t("meta.homepage.keywords"),
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
        return t("meta.homepage.ogTitle");
      },
    },
    // note: for Open Graph type metadata you will need to use SSR, to ensure page is rendered by the server
    ogDescription: {
      property: "og:description",
      // optional; similar to titleTemplate, but allows templating with other meta properties
      template(ogDescription) {
        return t("meta.homepage.ogDescription");
      },
    },
  },
});

document.addEventListener("DOMContentLoaded", () => {
  const offsetHeight = 60; // Height of your fixed header

  if (window.location.hash) {
    window.scrollTo(0, window.scrollY - offsetHeight);
  }

  window.addEventListener("hashchange", () => {
    window.scrollTo(window.scrollX, window.scrollY - offsetHeight);
  });
});
</script>

<style scoped lang="scss">
.q-page {
  background: $grey-1;
}

.container {
  max-width: 1200px;
  padding: 0;
}

section {
  padding: 98px 0;

  @media screen and (max-width: 800px) {
    padding: 48px 0;
  }
}

.splitter {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;

  @media screen and (max-width: 1048px) {
    grid-template-columns: 1fr;
  }
}

.feature_cards_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  overflow-x: scroll;

  .feature_card {
    min-width: 290px;
    background: $grey-1;
    border-radius: 1.25em;

    .q-img {
      border-radius: calc(1.25em - 16px / 2);
    }
  }
}

.join_room {
  background: linear-gradient(
    90deg,
    rgba(233, 238, 253, 1) 0%,
    rgba(249, 233, 243, 1) 100%
  );
}

::v-deep(.join_room__token_input) {
  .q-field__control {
    border-radius: 10px;
    background: $white;
    padding: 0 5px 0 10px !important;
    //padding: 0 8px !important;
    width: 321px;
  }
  .q-field__prepend {
    padding-right: 4px !important;
  }
}
::v-deep(.join_room__token_input--error) {
  input {
    color: $red;
  }
}

.plans_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media screen and (max-width: 1248px) {
    grid-template-columns: 1fr;

    .q-card {
      margin: 0 auto;
    }
  }

  .q-card {
    align-self: start;
    border-radius: 12px;
    max-width: 382px;

    .q-card__section {
      padding: 20px;

      .q-separator {
        margin: 20px 0;
      }
    }
  }
}

.q-separator {
  background: $grey-2;
}

::v-deep(.q-expansion-item) {
  margin: 16px 0;
  border-radius: 12px;
  border: 1px solid $grey-2;
  outline: 1px solid transparent;
  transition: 0.3s;

  .q-item {
    padding: 24px;
  }

  &.q-expansion-item--expanded {
    border-color: $primary !important;
    outline-color: $primary !important;
  }

  .q-item__label {
    font-weight: 600;
    font-size: 18px;
  }

  &:hover {
    border-color: $accent;
    outline-color: $accent;
  }

  .q-focus-helper {
    display: none;
  }
}

.promo {
  background: linear-gradient(
    89.92deg,
    rgba(233, 238, 253, 0.8) 0.07%,
    #f9e9f3 98.96%
  );
}

.footer {
  border-top: 1px solid #e6e6e6;
}
</style>

<style lang="scss">
@keyframes pulse {
  0%,
  100% {
    border-color: currentColor;
  }
  50% {
    border-color: $grey-3;
  }
}
</style>
