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
    async addNewSlide(elements = null) {
      const response = await api
        .post(`/presentation/${this.presentation.id}/slide`)
        .catch((error) => {
          console.log(error);
        });

      this.presentation.slides.push(response.data);
      return await this.setSlide(response.data, elements);
    },

    async saveSlide(slide = this.slide, elements) {
      this.isSavingError = false;
      this.isSaving = true;

      return await api
        .patch(`/presentation/${this.presentation.id}/slide/${slide.id}`, {
          canvas_data: elements,
          preview: slide.preview,
          order: slide.order,
          notes: slide.notes,
          animation: slide.animation,
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

    async duplicateSlide(slide, elements) {
      // add new slide
      await this.addNewSlide(elements);

      // copy original slides props into the new one
      this.slide = {
        ...this.slide,
        canvas_data: slide.canvas_data,
        preview: slide.preview,
        notes: slide.notes,
        animation: slide.animation,
      };
      this.updateLocalSlide();

      // update new slide
      await this.saveSlide(undefined, elements);
    },

    async deleteSlide(slide) {
      if (this.presentation.slides.length === 1) return;

      return await api
        .delete(`/presentation/${this.presentation.id}/slide/${slide.id}`)
        .then(() => {
          this.presentation.slides = this.presentation.slides.filter(
            (item) => item.id !== slide.id
          );
          this.setSlide(this.presentation.slides[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    /*
     * slide
     */
    async setSlide(newSlide, elements = null) {
      if (this.slide?.id === newSlide.id) return;

      // save previous slide
      if (this.slide && elements) {
        this.slide.canvas_data = JSON.stringify(elements);
        this.updateLocalSlide();
        await this.saveSlide(undefined, elements);
      }

      this.slide = newSlide;
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

    updateLocalSlide() {
      const slideIndex = this.presentation.slides.findIndex(
        (item) => item.id === this.slide.id
      );
      this.presentation.slides[slideIndex] = this.slide;
    },
  },
});
