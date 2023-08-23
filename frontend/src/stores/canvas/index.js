import { defineStore } from "pinia";
import { api } from "boot/axios";
import { ROUTE_PATHS } from "src/constants/routes";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

export const useCanvasStore = defineStore("canvas", {
  state: () => ({
    canvas: null,
    ctx: null,

    mouse: {
      x: null,
      y: null,
    },
  }),

  actions: {
    canvasRect() {
      return this.canvas.getBoundingClientRect();
    },
  },
});
