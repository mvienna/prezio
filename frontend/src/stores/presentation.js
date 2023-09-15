import { defineStore } from "pinia";
import { api } from "boot/axios";
import { clearRoutePathFromProps } from "src/helpers/clearRoutePathFromProps";
import { ROUTE_PATHS } from "src/constants/routes";

export const usePresentationStore = defineStore("presentation", {
  state: () => ({
    /*
     * presentations
     */
    presentations: [],
    search: "",

    isLoading: false,
    isCreatingPresentation: false,

    /*
     * presentation
     */
    presentation: null,
    slide: null,

    /*
     * save
     */
    lastChangedAt: null,
    lastSavedAt: null,
    isSaving: false,
    isSavingError: false,
  }),

  actions: {
    /*
     * presentation
     */
    async fetchPresentationData(id) {
      return await api
        .get(`/presentation/${id}`)
        .then((response) => {
          this.presentation = response.data;
          this.setSlide(this.presentation.slides[0]);
        })
        .catch((error) => {
          throw error.response.data.message;
        });
    },

    updatePresentation(presentation = this.presentation) {
      api
        .patch(`/presentation/${presentation.id}`, {
          name: presentation.name,
          description: presentation.description,
          preview_id: presentation.preview_id,
          is_private: presentation.is_private,
          lang: presentation.lang,
        })
        .catch((error) => {
          console.log(error);
        });
    },

    deletePresentation(presentation = this.presentation) {
      api
        .delete(`/presentation/${presentation.id}`)
        .then(() => {
          this.presentations = this.presentations.filter(
            (item) => item.id !== presentation.id
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async createNewPresentation(data) {
      this.isCreatingPresentation = true;

      return await api
        .post("/presentation", {
          name: data.name,
          description: data.description,
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.isCreatingPresentation = false;
        });
    },

    /*
     * slides
     */
    async addNewSlide() {
      return await api
        .post(`/presentation/${this.presentation.id}/slide`)
        .then((response) => {
          this.presentation.slides.push(response.data);
          this.setSlide(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    saveSlide(slide = this.slide, elements) {
      this.isSavingError = false;
      this.isSaving = true;

      api
        .patch(`/presentation/${this.presentation.id}/slide/${slide.id}`, {
          canvas_data: elements,
          preview: slide.preview,
          order: slide.order,
          notes: slide.notes,
          animation: slide.animation,
        })
        .then((response) => {
          this.presentation = response.data;
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

    async setSlide(slide, elements = null) {
      if (this.slide?.id === slide.id) return;

      if (this.slide && elements) {
        await this.saveSlide(undefined, elements);
      }

      this.slide = slide;
      this.lastSavedAt = new Date();
    },

    async deleteSlide(slide) {
      if (this.presentation.slides.length === 1) return;

      return await api
        .delete(`/presentation/${this.presentation.id}/slide/${slide.id}`)
        .then((response) => {
          this.presentation = response.data;
          this.setSlide(this.presentation.slides[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async updateSlidesOrder() {
      return await api
        .patch(`/presentation/${this.presentation.id}/slides`, {
          slides: this.presentation.slides,
        })
        .then((response) => {
          this.presentation = response.data;
          this.setSlide(
            this.presentation.slides.find((item) => item.id === this.slide.id)
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
});
