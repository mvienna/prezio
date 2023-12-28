import { defineStore } from "pinia";
import { api } from "boot/axios";
import { stopCountdown, timeLeft } from "src/helpers/countdown";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";

export const usePresentationsStore = defineStore("presentations", {
  state: () => ({
    /*
     * room
     * participant
     */
    room: null,

    participant: null,
    participants: [],
    isHost: false,

    showRoomInvitationPanel: false,
    showShareDialog: false,
    showRoomChat: false,

    beforeQuizTimeout: null,

    averageBackgroundBrightness: 0,
    backgroundBrightnessThreshold: 128,

    /*
     * folders
     */
    folders: [],
    selectedFolder: null,

    /*
     * presentations
     */
    pagination: {
      sortBy: "updated_at",
      descending: true,
      page: 1,
      rowsPerPage: 8,
    },
    presentations: [],
    search: "",

    /*
     * presentation
     */
    presentation: null,
    slide: null,
    slideSettings: null,

    isPresentationPreview: false,

    showSettingsDialog: false,
    presentationSettingsTabsExpanded: [],

    /*
     * save
     */
    lastChangedAt: null,
    lastSavedAt: null,
    isSaving: false,
    isSavingError: false,

    /*
     * state
     */
    isLoading: {
      fetchingPresentations: false,
      fetchingFolders: false,

      creatingPresentation: false,
      creatingFolder: false,

      sendingRoomUpdatedEvent: false,
    },
  }),

  actions: {
    /*
     * FOLDERS API
     */
    fetchFolders() {
      this.isLoading.fetchingFolders = true;
      api
        .get("/folders")
        .then((response) => {
          this.folders = response.data;
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading.fetchingFolders = false;
        });
    },

    async createNewFolder(data) {
      this.isLoading.creatingFolder = true;

      return await api
        .post("/folder", {
          name: data.name,
          description: data.description,
          presentations_ids: data.presentationsIds,
        })
        .then((response) => {
          this.folders.push(response.data);
          this.selectedFolder = response.data;
          this.fetchPresentations({ page: 1 }, true);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading.creatingFolder = false;
        });
    },

    async updateFolder(folder) {
      return await api
        .patch(`/folder/${folder.id}`, {
          name: folder.name,
          description: folder.description,
        })
        .catch((error) => {
          console.log(error);
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },

    async deleteFolder(folder) {
      this.selectedFolder = -1;

      return await api
        .delete(`/folder/${folder.id}`)
        .then(() => {
          this.folders = this.folders.filter((item) => item.id !== folder.id);

          this.selectedFolder = null;

          this.fetchPresentations({ page: 1 }, true);
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    },

    /*
     * PRESENTATIONS API
     */
    async fetchPresentations(pagination = {}, isResetData = false) {
      this.pagination = {
        ...this.pagination,
        ...pagination,
      };

      let params = {
        page: this.pagination.page,
        limit: this.pagination.rowsPerPage,
        descending: this.pagination.descending,
      };
      if (this.pagination.sortBy) {
        params.sortBy = this.pagination.sortBy;
      }
      if (this.selectedFolder) {
        params.folder_id = this.selectedFolder.id;
      }
      if (this.search?.length) {
        params.search = this.search;
      }

      this.isLoading.fetchingPresentations = true;
      const response = await api
        .get(`/presentations?${new URLSearchParams(params)}`)
        .catch((error) => {
          console.log(error);
        });

      if (isResetData) {
        this.presentations = response.data.rows;
      } else {
        this.presentations = [...this.presentations, ...response.data.rows];
      }

      this.isLoading.fetchingPresentations = false;

      if (response.data.rows.length < this.pagination.rowsPerPage) {
        this.pagination.page = null;
      }

      return true;
    },

    /*
     * PRESENTATION API
     */
    async fetchPresentationData(id) {
      return await api
        .get(`/presentation/${id}`)
        .then((response) => {
          this.presentation = response.data;
          this.presentation.settings.is_fullscreen = Boolean(
            this.presentation.settings.is_fullscreen
          );

          const lastSlide = this.presentation.slides.find(
            (slide) => slide.id === this.presentation.settings.last_slide_id
          );

          this.setSlide(lastSlide || this.presentation.slides[0]);
        })
        .catch((error) => {
          throw error.response.data.message;
        });
    },

    async updatePresentation(presentation = this.presentation) {
      return await api
        .patch(`/presentation/${presentation.id}`, {
          name: presentation.name,
          folder_id: presentation.folder_id,
          description: presentation.description,
          preview_id: presentation.preview_id,
          is_private: presentation.is_private,
          settings: presentation.settings,
        })
        .then(() => {
          const presentationIndex = this.presentations?.findIndex(
            (item) => item.id === presentation.id
          );
          if (presentationIndex !== -1) {
            this.presentations[presentationIndex] = presentation;
          }
        })
        .catch((error) => {
          console.log(error.response?.data?.message);
        });
    },

    async deletePresentation(presentation = this.presentation) {
      return await api
        .delete(`/presentation/${presentation.id}`)
        .catch((error) => {
          console.log(error.response?.data?.message);
        });
    },

    async createNewPresentation(data) {
      this.isLoading.creatingPresentation = true;

      return await api
        .post("/presentation", {
          name: data.name,
          description: data.description,
          folder_id: data.folder_id,
          is_private: data.is_private,
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading.creatingPresentation = false;
        });
    },

    /*
     * SLIDES API
     */
    async fetchSlideData(slideId = this.slide.id) {
      return await api
        .get(`/presentation/${this.presentation.id}/slide/${slideId}`)
        .catch((error) => {
          console.log(error);
        });
    },

    async addNewSlide(
      slide = {},
      elements = null,
      type,
      selectNewSlide = true
    ) {
      return await new Promise(async (resolve, reject) => {
        const slideIndex = this.presentation.slides.findIndex(
          (item) => item.id === this.slide.id
        );
        const insertAtIndex = slideIndex + 1;

        const response = await api
          .post(`/presentation/${this.presentation.id}/slide`, {
            canvas_data: JSON.stringify(elements),
            preview: slide.preview,
            order: insertAtIndex,
            type: type,
            settings_data: slide.settings_data,
            notes: slide.notes,
            animation: slide.animation,
          })
          .catch((error) => {
            console.log(error);
          });

        this.presentation.slides.splice(insertAtIndex, 0, response.data);

        this.presentation.slides = this.presentation.slides.map(
          (item, index) => {
            item.order = index;
            return item;
          }
        );
        await this.updateSlidesOrder();

        if (selectNewSlide) {
          await this.setSlide(response.data);
        }

        resolve(response.data);
      });
    },

    async saveSlide(slide = this.slide, elements, newSlide) {
      this.isSavingError = false;
      this.isSaving = true;

      slide.canvas_data = JSON.stringify(elements);

      return await api
        .patch(`/presentation/${this.presentation.id}/slide/${slide.id}`, {
          canvas_data: elements,
          preview: slide.preview,
          order: slide.order,
          type: slide.type,
          settings_data: slide.settings_data,
          notes: slide.notes,
          animation: slide.animation,
          last_slide_id: newSlide?.id || slide?.id,
        })
        .then(() => {
          this.lastSavedAt = new Date();
        })
        .catch((error) => {
          console.log(error);
          this.isSavingError = true;
        })
        .finally(() => {
          this.isSaving = false;
        });
    },

    async duplicateSlide(elements) {
      return await this.addNewSlide(this.slide, elements, this.slide.type);
    },

    async deleteSlide(slide) {
      if (this.presentation.slides.length === 1) return;

      const slideIndex = this.presentation.slides.findIndex(
        (item) => item.id === slide.id
      );

      const slideToShowAfterDeleting =
        this.presentation.slides[slideIndex + (slideIndex !== 0 ? -1 : 1)];

      return await api
        .delete(`/presentation/${this.presentation.id}/slide/${slide.id}`)
        .then(() => {
          this.presentation.slides = this.presentation.slides.filter(
            (item) => item.id !== slide.id
          );
          this.setSlide(slideToShowAfterDeleting);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /*
     * SLIDE - LOCAL
     */
    async setSlide(newSlide, elements = null, saveSlide = true) {
      if (!newSlide || this.slide?.id === newSlide.id) return;

      // save previous slide
      if (this.slide && elements && saveSlide) {
        this.slide.canvas_data = JSON.stringify(elements);
        this.syncCurrentSlideWithPresentationSlides();
        this.saveSlide(undefined, elements, newSlide);
      }

      this.slide = newSlide;
      this.slideSettings = this.slide.settings_data
        ? JSON.parse(this.slide.settings_data)
        : {};
    },

    async updateSlidesOrder() {
      return await api
        .patch(`/presentation/${this.presentation.id}/slides`, {
          slides: this.presentation.slides,
        })
        .then((response) => {
          response.data.slides.forEach((slide, index) => {
            this.presentation.slides[index].order = slide.order;
          });

          this.setSlide(
            this.presentation.slides.find((item) => item.id === this.slide.id)
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },

    syncCurrentSlideWithPresentationSlides() {
      const slideIndex = this.presentation.slides.findIndex(
        (item) => item.id === this.slide.id
      );
      this.slide.settings_data = JSON.stringify(this.slideSettings);
      this.presentation.slides[slideIndex] = this.slide;
    },

    /*
     * ROOM
     */
    async updateRoom(
      presentation_id = this.presentation?.id,
      room_id = this.room?.id,
      data = {}
    ) {
      if (!presentation_id || !room_id) return;
      if (this.isLoading.sendingRoomUpdatedEvent && !data?.disableNotification)
        return;

      if (!data?.disableNotification) {
        this.isLoading.sendingRoomUpdatedEvent = true;
      }

      return await api
        .patch(`/presentation/${presentation_id}/room/${room_id}`, data)
        .catch((error) => {
          throw {
            message: error.response.data.message,
            details: error.response.data.details,
          };
        });
    },

    async loginRoom(data, is_guest = false) {
      return await api
        .post(`/room/login`, {
          room_id: this.room?.id,
          data: JSON.stringify(data),
          is_guest: is_guest,
        })
        .then((response) => {
          this.participant = response.data.participant;

          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;

          localStorage.setItem("participantToken", response.data.token);
        });
    },

    async sendPresentationRoomReaction(
      reaction,
      presentation_id = this.presentation?.id,
      room_id = this.room?.id
    ) {
      if (!reaction) return;

      return await api
        .post(`/presentation/${presentation_id}/room/${room_id}/react`, {
          reaction: reaction,
        })
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },

    computeScoreForAnswers(
      answers,
      secondsLeft = timeLeft.value,
      isForceCorrect = false
    ) {
      let totalScore = null;

      if (SLIDE_TYPES_OF_QUIZ.includes(this.slide?.type)) {
        totalScore = 0;
        let pointForCorrectAnswer = this.slideSettings.points.max;

        // compute points for correct answer by speed of answering
        if (this.slideSettings.scoreDependsOnTime) {
          const pointsPerSecond =
            (this.slideSettings.points.max - this.slideSettings.points.min) /
            Number(this.slideSettings.timeLimit);

          const secondsTookToAnswer =
            Number(this.slideSettings.timeLimit) - secondsLeft;

          pointForCorrectAnswer = Math.round(
            this.slideSettings.points.max -
              pointsPerSecond * secondsTookToAnswer
          );
        }

        // partial scoring
        if (this.slideSettings.partialScoring) {
          const computeScore = () => {
            let score = 0;

            for (const answer of answers) {
              if (SLIDE_TYPES.TYPE_ANSWER === this.slide?.type) {
                const isCorrectAnswer = [
                  this.slideSettings.correctAnswer.value,
                  ...this.slideSettings.otherAcceptedAnswers.map(
                    (item) => item.value
                  ),
                ].includes(answer.value);

                if (isCorrectAnswer || isForceCorrect) {
                  score += pointForCorrectAnswer;
                } else {
                  return this.slideSettings.points.min;
                }
              } else {
                if (answer.isCorrect === true || isForceCorrect) {
                  score += pointForCorrectAnswer;
                } else if (answer.isCorrect === false) {
                  return this.slideSettings.points.min;
                }
              }
            }

            return score;
          };

          totalScore = computeScore();

          // whole scoring
        } else {
          const computeScore = () => {
            if (SLIDE_TYPES.TYPE_ANSWER === this.slide?.type) {
              const isCorrectAnswer = [
                this.slideSettings.correctAnswer.value,
                ...this.slideSettings.otherAcceptedAnswers.map(
                  (item) => item.value
                ),
              ].includes(answers[0].value);

              if (isCorrectAnswer || isForceCorrect) {
                return pointForCorrectAnswer;
              } else {
                return this.slideSettings.points.min;
              }
            } else {
              if (
                !answers.some((option) => option.isCorrect === false) ||
                isForceCorrect
              ) {
                return pointForCorrectAnswer;
              } else {
                return this.slideSettings.points.min;
              }
            }
          };

          totalScore = computeScore();
        }
      }

      return answers.length > 1 && totalScore
        ? totalScore / answers.length
        : totalScore;
    },

    async submitPresentationRoomAnswers(answers) {
      answers = answers.filter((answer) => answer?.value?.length);
      if (!answers?.length) return;

      const score = this.computeScoreForAnswers(answers);
      answers = answers.map((answer) => answer.value);

      return await api
        .post(
          `/presentation/${this.presentation?.id}/room/${this.room?.id}/answers`,
          {
            slide_id: this.slide?.id,
            answers,
            score,
            time_taken_to_answer: this.slideSettings.isLimitedTime
              ? Number(this.slideSettings.timeLimit) - timeLeft.value
              : null,
            participant_id: this.participant.id,
          }
        )
        .catch((error) => {
          console.log(error);
          console.log(error.response.data);
        });
    },

    computeBeforeQuizTimeout() {
      // initial countdown (question №n out of №n)
      let timeout = 5000;

      // 5s timeout (default setting countdown: true)
      if (
        (this.presentation.settings.quiz_data &&
          JSON.parse(this.presentation.settings.quiz_data).countdown) ||
        !this.presentation.settings.quiz_data
      ) {
        timeout += 5000;
      }

      return timeout;
    },

    async handleQuizStart(slide_id = null, slideSettings = this.slideSettings) {
      const timeout = this.computeBeforeQuizTimeout();

      const data = {
        is_quiz_started: true,
        is_answers_revealed: false,

        is_submission_locked: true,
        countdown: Number(slideSettings.timeLimit) + timeout / 1000,
      };
      if (slide_id) {
        data.slide_id = slide_id;
      }

      clearTimeout(this.beforeQuizTimeout);
      await this.updateRoom(undefined, undefined, data);
    },

    async handleQuizStop({
      countdown = 0,
      is_submission_locked = true,
      is_quiz_started = false,
      is_answers_revealed = false,
      slide_id = null,
    }) {
      stopCountdown();

      clearTimeout(this.beforeQuizTimeout);
      return await this.updateRoom(undefined, undefined, {
        countdown,
        is_submission_locked,
        is_quiz_started,
        is_answers_revealed,
        slide_id,
      });
    },
  },
});
