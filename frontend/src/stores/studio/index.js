import { defineStore, storeToRefs } from "pinia";
import {
  COLOR_PALETTE,
  COLOR_SCHEME_OPTIONS,
  CROP_POSITION_OPTIONS,
  DRAWING_MODES,
} from "src/constants/canvas/canvasVariables";
import Konva from "konva";
import { fetchAndConvertToBase64Image } from "src/helpers/imageUtils";
import { usePresentationsStore } from "stores/presentations";
import { colors } from "quasar";
import {
  SLIDE_TYPES,
  SLIDE_TYPES_OF_QUIZ,
} from "src/constants/presentationStudio";

const presentationsStore = usePresentationsStore();
const { presentation, slide } = storeToRefs(presentationsStore);

export const useStudioStore = defineStore("studio", {
  state: () => ({
    scene: {
      width: 2560,
      height: 1440,
    },
    stages: {
      default: null,
      // preview: null,
    },
    layers: {
      default: null, // default stage
      base: null, // default stage
      // preview: null, // preview stage
    },
    transformer: {
      default: null,
    },

    /*
     * selection
     * snapping
     * copies
     */
    selection: {
      isSelecting: false,
      selectableClassNames: ["Line", "Image"],

      rect: null,
      x1: null,
      y1: null,
      x2: null,
      y2: null,
    },
    snapping: {
      GUIDELINE_OFFSET: 10,
    },
    copiedNodes: [],

    /*
     * modes
     */
    mode: null,
    MODE_OPTIONS: {
      drawing: "Drawing",
      image: "Image",
      text: "Text",
      emoji: "Emoji",
      shape: "Shape",
    },

    /*
     * drawing
     */
    drawing: {
      isPainting: false,
      lastLine: null,

      mode: DRAWING_MODES.BRUSH,
      stroke: COLOR_PALETTE.PRIMARY,
      strokeWidth: 16,

      default: {
        mode: DRAWING_MODES.BRUSH,
        stroke: COLOR_PALETTE.PRIMARY,
        strokeWidth: 16,
      },
    },

    /*
     * image
     */
    image: {
      opacity: 1,
      cornerRadius: 6,
      stroke: COLOR_PALETTE.PRIMARY,
      strokeWidth: 0.1,
      shadowColor: COLOR_PALETTE.BLACK,
      shadowBlur: 0,
      shadowOffset: { x: 0, y: 0 },
      shadowOpacity: 0,
      clipPosition: "centerMiddle",

      default: {
        opacity: 1,
        cornerRadius: 6,
        stroke: COLOR_PALETTE.PRIMARY,
        strokeWidth: 0.1,
        shadowColor: COLOR_PALETTE.BLACK,
        shadowBlur: 0,
        shadowOffset: { x: 0, y: 0 },
        shadowOpacity: 0,
        clipPosition: "centerMiddle",
      },
    },
  }),

  actions: {
    loadStudio() {
      /*
       * load slide
       */
      if (slide.value?.canvas_data) {
        // load stage
        this.stages.default = Konva.Node.create(
          slide.value.canvas_data,
          "container"
        );

        // load layers
        this.layers.default = this.stages.default.findOne(".defaultLayer");
        this.layers.base = this.stages.default.findOne(".baseLayer");

        // load images
        this.stages.default.find("Image").forEach(async (node) => {
          const imageObj = new Image();
          const url = node.getAttr("source");

          let base64;

          if (url.includes("http")) {
            base64 = await fetchAndConvertToBase64Image(url);
            imageObj.src = base64;
          } else {
            imageObj.src = url;
          }

          imageObj.onload = () => {
            node.image(imageObj);

            if (node.getLayer().attrs.name === "defaultLayer") {
              this.processImageNode(node, url, node.getAttr("lastCropUsed"));
            } else {
              this.applyBaseBackgroundFilters(node);
            }
          };
        });

        /*
         * new slide
         */
      } else {
        // create stage
        this.stages.default = new Konva.Stage({
          container: "container",
          width: this.scene.width,
          height: this.scene.height,
        });

        // create base layer
        this.layers.base = new Konva.Layer({
          name: "baseLayer",
        });
        this.stages.default.add(this.layers.base);

        // create base fill rect
        const baseFill = new Konva.Rect({
          x: 0,
          y: 0,
          width: this.scene.width,
          height: this.scene.height,
          fill: COLOR_PALETTE.WHITE,
          listening: false,
          name: "baseFill",
        });
        this.layers.base.add(baseFill);

        // create default layer
        this.layers.default = new Konva.Layer({
          name: "defaultLayer",
        });
        this.stages.default.add(this.layers.default);

        // TODO:
        // add default nodes for content-type slide
        if (slide.value.type === SLIDE_TYPES.CONTENT) {
        }

        // TODO:
        // add default nodes for leaderboard-type slide
        if (slide.value.type === SLIDE_TYPES.LEADERBOARD) {
        }

        // TODO:
        // add default nodes for quiz-type slide
        if (SLIDE_TYPES_OF_QUIZ.includes(slide.value.type)) {
        }
      }

      // fit canvas
      window.addEventListener("resize", this.fitStageIntoParentContainer);
      this.fitStageIntoParentContainer();

      // handlers
      this.stages.default.off("dragend", this.handleSlideUpdate);
      this.stages.default.on("dragend", this.handleSlideUpdate);

      document.removeEventListener("keydown", this.handleShortcuts);
      document.addEventListener("keydown", this.handleShortcuts);

      this.handleSelection();
      this.handleSnapping();

      this.handleDrawing();
    },

    fitStageIntoParentContainer() {
      if (!this.stages.default) return;
      const container = document.querySelector("#stage-parent");
      const scale = container.offsetWidth / this.scene.width;
      this.stages.default.width(this.scene.width * scale);
      this.stages.default.height(this.scene.height * scale);
      this.stages.default.scale({ x: scale, y: scale });
    },

    /*
     * handle updates
     */
    generatePreviewForStage(stage = this.stages.default) {
      const scale = 1 / 4;
      return stage.toDataURL({
        pixelRatio: scale,
      });
    },

    async handleSlideUpdate() {
      this.transformer.default?.hide();

      const preview = this.generatePreviewForStage();
      document.getElementById("preview").src = preview;
      slide.value.preview = preview;

      this.transformer.default?.show();
      this.transformer.default.moveToTop();

      slide.value.color_scheme = await this.defineColorScheme();
      slide.value.canvas_data = this.stages.default.toJSON();

      await presentationsStore.saveSlide();
    },

    /*
     * shortcuts
     */
    handleShortcuts(event) {
      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        this.deleteNodes();
      }

      if (event.ctrlKey || event.metaKey) {
        if (event.key === "ArrowDown") {
          event.preventDefault();

          // move to bottom
          if (event.shiftKey) {
            this.moveToBottom();

            // move down
          } else {
            this.moveDown();
          }
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();

          // move to top
          if (event.shiftKey) {
            this.moveToTop();

            // move up
          } else {
            this.moveUp();
          }
        }

        // copy
        if (event.key === "c") {
          event.preventDefault();
          this.copyNodes();
        }

        // paste
        if (event.key === "v") {
          event.preventDefault();
          this.pasteNodes();
        }

        // duplicate
        if (event.key === "d") {
          event.preventDefault();
          this.duplicateNodes();
        }

        // cut
        if (event.key === "x") {
          event.preventDefault();
          this.cutNodes();
        }
      }
    },

    /*
     * selection
     * multiple selection
     */
    handleSelection() {
      this.transformer.default = this.stages.default.findOne("Transformer");

      if (!this.transformer.default) {
        this.transformer.default = new Konva.Transformer({
          nodes: [],
          rotationSnaps: [0, 90, 180, 270],
          anchorStroke: COLOR_PALETTE.PRIMARY,
          anchorFill: COLOR_PALETTE.WHITE,
          borderStroke: COLOR_PALETTE.PRIMARY,
          anchorSize: 12,
          keepRatio: false,
          boundBoxFunc: (oldBox, newBox) => {
            if (Math.abs(newBox.width) < 10 || Math.abs(newBox.height) < 10) {
              return oldBox;
            }
            return newBox;
          },
          anchorStyleFunc: (anchor) => {
            if (anchor.hasName("rotater")) {
              const size = 14;
              anchor.width(size);
              anchor.height(size);
              anchor.offsetY(size / 2);
              anchor.offsetX(size / 2);
              anchor.cornerRadius(size);
            } else {
              anchor.cornerRadius(1);
            }
          },
        });
        this.layers.default.add(this.transformer.default);
      }

      this.transformer.default.moveToTop();

      this.selection.rect = new Konva.Rect({
        fill: COLOR_PALETTE.SELECTION_RECT,
        visible: false,
      });
      this.layers.default.add(this.selection.rect);

      const handleSelectionMouseDown = (event) => {
        if (
          event.target._id !== this.stages.default._id ||
          [this.MODE_OPTIONS.drawing].includes(this.mode)
        ) {
          return;
        }

        event.evt.preventDefault();

        const stageTransform = this.stages.default
          .getAbsoluteTransform()
          .copy();
        const position = stageTransform
          .invert()
          .point(this.stages.default.getPointerPosition());

        this.selection.x1 = position.x;
        this.selection.y1 = position.y;
        this.selection.x2 = position.x;
        this.selection.y2 = position.y;

        this.selection.rect.width(0);
        this.selection.rect.height(0);
        this.selection.isSelecting = true;
      };

      const handleSelectionMouseMove = (event) => {
        if (!this.selection.isSelecting) return;

        event.evt.preventDefault();

        const stageTransform = this.stages.default
          .getAbsoluteTransform()
          .copy();
        const position = stageTransform
          .invert()
          .point(this.stages.default.getPointerPosition());

        this.selection.x2 = position.x;
        this.selection.y2 = position.y;

        this.selection.rect.setAttrs({
          visible: true,
          x: Math.min(this.selection.x1, this.selection.x2),
          y: Math.min(this.selection.y1, this.selection.y2),
          width: Math.abs(this.selection.x2 - this.selection.x1),
          height: Math.abs(this.selection.y2 - this.selection.y1),
        });
      };

      const handleSelectionMouseUp = (event) => {
        this.selection.isSelecting = false;
        if (!this.selection.rect.visible()) {
          return;
        }
        event.evt.preventDefault();

        this.selection.rect.visible(false);

        const elements = this.stages.default.find((node) => {
          return (
            this.selection.selectableClassNames.includes(node.getClassName()) &&
            node.getLayer().attrs.name === "defaultLayer" &&
            node.draggable()
          );
        });
        const box = this.selection.rect.getClientRect();

        const selected = elements.filter((shape) =>
          Konva.Util.haveIntersection(box, shape.getClientRect())
        );

        this.transformer.default.nodes(selected);
      };

      const handleSelectionClick = (event) => {
        // if we are selecting with rect, do nothing
        if (this.selection.rect.visible()) {
          return;
        }

        // if click on empty area - remove all selections
        if (event.target.getClassName() === "Stage") {
          this.deselectElements();
          return;
        }

        // do nothing if clicked NOT on our rectangles
        if (
          !this.selection.selectableClassNames.includes(
            event.target.getClassName()
          ) ||
          !event.target.draggable()
        ) {
          return;
        }

        // do we pressed shift or ctrl?
        const metaPressed =
          event.evt.shiftKey || event.evt.ctrlKey || event.evt.metaKey;
        const isSelected =
          this.transformer.default.nodes().indexOf(event.target) >= 0;

        if (!metaPressed && !isSelected) {
          // if no key pressed and the node is not selected
          // select just one
          this.transformer.default.nodes([event.target]);
        } else if (metaPressed && isSelected) {
          // if we pressed keys and node was selected
          // we need to remove it from selection:
          const nodes = this.transformer.default.nodes().slice(); // use slice to have new copy of array
          // remove node from array
          nodes.splice(nodes.indexOf(event.target), 1);
          this.transformer.default.nodes(nodes);
        } else if (metaPressed && !isSelected) {
          // add the node into selection
          const nodes = this.transformer.default.nodes().concat([event.target]);
          this.transformer.default.nodes(nodes);
        }

        this.setCustomization();
      };

      this.stages.default.off("mousedown touchstart", handleSelectionMouseDown);
      this.stages.default.off("mousemove touchmove", handleSelectionMouseMove);
      this.stages.default.off("mouseup touchend", handleSelectionMouseUp);
      this.stages.default.off("click tap", handleSelectionClick);

      this.stages.default.on("mousedown touchstart", handleSelectionMouseDown);
      this.stages.default.on("mousemove touchmove", handleSelectionMouseMove);
      this.stages.default.on("mouseup touchend", handleSelectionMouseUp);
      this.stages.default.on("click tap", handleSelectionClick);
    },

    deselectElements() {
      this.transformer.default.nodes([]);
    },

    /*
     * snapping
     */
    handleSnapping() {
      // were can we snap our objects?
      const getLineGuideStops = (skipShape) => {
        let vertical = [
          0,
          this.stages.default.width() / 2,
          this.stages.default.width(),
        ];
        let horizontal = [
          0,
          this.stages.default.height() / 2,
          this.stages.default.height(),
        ];

        this.stages.default
          .find((node) =>
            this.selection.selectableClassNames.includes(node.getClassName())
          )
          .filter((node) => node._id !== skipShape._id)
          .forEach((guideItem) => {
            if (guideItem === skipShape) {
              return;
            }
            const box = guideItem.getClientRect();

            vertical.push(box.x, box.x + box.width, box.x + box.width / 2);
            horizontal.push(box.y, box.y + box.height, box.y + box.height / 2);
          });

        return { vertical, horizontal };
      };

      // what points of the object will trigger to snapping?
      // it can be just center of the object
      // but we will enable all edges and center
      const getObjectSnappingEdges = (node) => {
        // const box = node.getClientRect({ skipTransform: true });
        const box = node.getClientRect();
        const absPos = node.absolutePosition();

        return {
          vertical: [
            {
              guide: Math.round(box.x),
              offset: Math.round(absPos.x - box.x),
              snap: "start",
            },
            {
              guide: Math.round(box.x + box.width / 2),
              offset: Math.round(absPos.x - box.x - box.width / 2),
              snap: "center",
            },
            {
              guide: Math.round(box.x + box.width),
              offset: Math.round(absPos.x - box.x - box.width),
              snap: "end",
            },
          ],
          horizontal: [
            {
              guide: Math.round(box.y),
              offset: Math.round(absPos.y - box.y),
              snap: "start",
            },
            {
              guide: Math.round(box.y + box.height / 2),
              offset: Math.round(absPos.y - box.y - box.height / 2),
              snap: "center",
            },
            {
              guide: Math.round(box.y + box.height),
              offset: Math.round(absPos.y - box.y - box.height),
              snap: "end",
            },
          ],
        };
      };

      // find all snapping possibilities
      const getGuides = (lineGuideStops, itemBounds) => {
        let resultV = [];
        let resultH = [];

        lineGuideStops.vertical.forEach((lineGuide) => {
          itemBounds.vertical.forEach((itemBound) => {
            const diff = Math.abs(lineGuide - itemBound.guide);
            // if the distance between guild line and object snap point is close we can consider this for snapping
            if (diff < this.snapping.GUIDELINE_OFFSET) {
              resultV.push({
                lineGuide: lineGuide,
                diff: diff,
                snap: itemBound.snap,
                offset: itemBound.offset,
              });
            }
          });
        });

        lineGuideStops.horizontal.forEach((lineGuide) => {
          itemBounds.horizontal.forEach((itemBound) => {
            const diff = Math.abs(lineGuide - itemBound.guide);
            if (diff < this.snapping.GUIDELINE_OFFSET) {
              resultH.push({
                lineGuide: lineGuide,
                diff: diff,
                snap: itemBound.snap,
                offset: itemBound.offset,
              });
            }
          });
        });

        let guides = [];

        // find closest snap
        const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
        const minH = resultH.sort((a, b) => a.diff - b.diff)[0];
        if (minV) {
          guides.push({
            lineGuide: minV.lineGuide,
            offset: minV.offset,
            orientation: "V",
            snap: minV.snap,
          });
        }
        if (minH) {
          guides.push({
            lineGuide: minH.lineGuide,
            offset: minH.offset,
            orientation: "H",
            snap: minH.snap,
          });
        }

        return guides;
      };

      const drawGuides = (guides) => {
        guides.forEach((lg) => {
          if (lg.orientation === "H") {
            const line = new Konva.Line({
              points: [-this.scene.width * 4, 0, this.scene.width * 4, 0],
              stroke:
                slide.value.color_scheme === COLOR_SCHEME_OPTIONS.light
                  ? COLOR_PALETTE.BLACK
                  : COLOR_PALETTE.WHITE,
              strokeWidth: 2,
              name: "guid-line",
              dash: [10, 10],
            });
            this.layers.default.add(line);

            line.absolutePosition({
              x: 0,
              y: lg.lineGuide,
            });
          } else if (lg.orientation === "V") {
            const line = new Konva.Line({
              points: [0, -this.scene.width * 4, 0, this.scene.width * 4],
              stroke:
                slide.value.color_scheme === COLOR_SCHEME_OPTIONS.light
                  ? COLOR_PALETTE.BLACK
                  : COLOR_PALETTE.WHITE,
              strokeWidth: 2,
              name: "guid-line",
              dash: [10, 10],
            });
            this.layers.default.add(line);
            line.absolutePosition({
              x: lg.lineGuide,
              y: 0,
            });
          }
        });
      };

      const handleDragMove = (event) => {
        if (this.mode === this.MODE_OPTIONS.drawing) return;

        // clear all previous lines on the screen
        this.layers.default.find(".guid-line").forEach((l) => l.destroy());

        // find possible snapping lines
        const lineGuideStops = getLineGuideStops(event.target);
        // find snapping points of current object
        const itemBounds = getObjectSnappingEdges(event.target);

        // now find where can we snap current object
        const guides = getGuides(lineGuideStops, itemBounds);

        // do nothing of no snapping
        if (!guides.length) {
          return;
        }

        drawGuides(guides);

        const absPos = event.target.absolutePosition();
        // now force object position
        guides.forEach((lg) => {
          switch (lg.snap) {
            case "start": {
              switch (lg.orientation) {
                case "V": {
                  absPos.x = lg.lineGuide + lg.offset;
                  break;
                }
                case "H": {
                  absPos.y = lg.lineGuide + lg.offset;
                  break;
                }
              }
              break;
            }
            case "center": {
              switch (lg.orientation) {
                case "V": {
                  absPos.x = lg.lineGuide + lg.offset;
                  break;
                }
                case "H": {
                  absPos.y = lg.lineGuide + lg.offset;
                  break;
                }
              }
              break;
            }
            case "end": {
              switch (lg.orientation) {
                case "V": {
                  absPos.x = lg.lineGuide + lg.offset;
                  break;
                }
                case "H": {
                  absPos.y = lg.lineGuide + lg.offset;
                  break;
                }
              }
              break;
            }
          }
        });
        event.target.absolutePosition(absPos);
      };

      const handleDragEnd = () => {
        // clear all previous lines on the screen
        this.layers.default.find(".guid-line").forEach((l) => l.destroy());
      };

      this.layers.default.off("dragmove", handleDragMove);
      this.layers.default.off("dragend", handleDragEnd);

      this.layers.default.on("dragmove", handleDragMove);
      this.layers.default.on("dragend", handleDragEnd);
    },

    /*
     * context menu
     */
    copyNodes(nodes = this.transformer.default.nodes()) {
      this.copiedNodes = nodes;
      this.deselectElements();
    },

    pasteNodes(nodes = this.copiedNodes) {
      nodes = nodes.map((node) => {
        let clone = node.clone();
        clone.x(clone.x() + 100);
        clone.y(clone.y() + 100);
        this.layers.default.add(clone);
        if (clone.getClassName() === "Image") {
          this.processImageNode(
            clone,
            clone.getAttr("source"),
            clone.getAttr("lastCropUsed")
          );
        }
        return clone;
      });

      this.transformer.default.nodes(nodes);
      this.copyNodes(nodes);

      this.handleSlideUpdate();
    },

    duplicateNodes(nodes = this.transformer.default.nodes()) {
      this.pasteNodes(nodes);
      this.handleSlideUpdate();
    },

    cutNodes(nodes = this.transformer.default.nodes()) {
      this.copyNodes(nodes);
      this.deleteNodes(nodes);
    },

    deleteNodes(nodes = this.transformer.default.nodes()) {
      this.deselectElements();
      nodes.forEach((node) => node.destroy());
      this.handleSlideUpdate();
    },

    moveUp(nodes = this.transformer.default.nodes()) {
      nodes.forEach((node) => node.moveUp());
      this.handleSlideUpdate();
    },

    moveDown(nodes = this.transformer.default.nodes()) {
      nodes.forEach((node) => node.moveDown());
      this.handleSlideUpdate();
    },

    moveToTop(nodes = this.transformer.default.nodes()) {
      nodes.forEach((node) => node.moveToTop());
      this.handleSlideUpdate();
    },

    moveToBottom(nodes = this.transformer.default.nodes()) {
      nodes.forEach((node) => node.moveToBottom());
      this.handleSlideUpdate();
    },

    /*
     * slide design
     */
    async updateBaseLayer(
      baseFill = null,
      baseBackgroundUrl = null,
      baseBackgroundFilters = null,
      baseBackgroundPreviewUrl = null
    ) {
      // base fill
      if (baseFill) {
        this.layers.base.findOne(".baseFill").fill(baseFill);

        // save slide
        this.handleSlideUpdate();
      }

      // base background
      this.layers.base.findOne(".baseBackgroundPreview")?.destroy();

      if (baseBackgroundUrl || baseBackgroundPreviewUrl) {
        const imageObj = new Image();
        const url = baseBackgroundUrl || baseBackgroundPreviewUrl;

        let base64;
        if (url.includes("http")) {
          base64 = await fetchAndConvertToBase64Image(url);
          imageObj.src = base64;
        } else {
          imageObj.src = url;
        }

        imageObj.onload = () => {
          const name = baseBackgroundUrl
            ? "baseBackground"
            : "baseBackgroundPreview";

          const previousBaseBackground = this.layers.base.findOne(`.${name}`);

          // change existing background source
          if (previousBaseBackground) {
            previousBaseBackground.image(imageObj);

            // no previous background, add a new one
            // set background preview
          } else {
            const image = new Konva.Image({
              x: 0,
              y: 0,
              image: imageObj,
              width: this.scene.width,
              height: this.scene.height,
              listening: false,
              name: name,
            });

            this.layers.base.add(image);
          }

          const baseBackground = this.layers.base.findOne(`.${name}`);
          baseBackground.setAttr("source", url);

          // apply crop
          const clipPosition = CROP_POSITION_OPTIONS.centerMiddle;
          baseBackground.setAttr("lastCropUsed", clipPosition);
          const crop = this.getCrop(
            baseBackground.image(),
            { width: baseBackground.width(), height: baseBackground.height() },
            clipPosition
          );
          baseBackground.setAttrs(crop);

          // save slide
          if (baseBackgroundUrl) {
            this.handleSlideUpdate();
          }
        };
      }

      // base background filters
      if (baseBackgroundFilters) {
        const baseBackground = this.layers.base.findOne(".baseBackground");
        if (!baseBackground) return;

        this.applyBaseBackgroundFilters(baseBackground, baseBackgroundFilters);

        await this.handleSlideUpdate();
      }
    },

    applyBaseBackgroundFilters(node, filters = null) {
      if (!node) return;

      node.cache();
      node.opacity(filters?.opacity || node.opacity());
      node.filters([
        Konva.Filters.Blur,
        Konva.Filters.Brighten,
        Konva.Filters.Contrast,
      ]);
      node.blurRadius(filters?.blurRadius || node.blurRadius());
      node.brightness(filters?.brightness || node.brightness());
      node.contrast(filters?.contrast || node.contrast());
    },

    async applyDesignToAllSlides() {
      presentation.value.slides.map(async (item) => {
        // skip current slide
        if (item.id === slide.value.id) return item;

        // create temp container
        const tempDiv = document.createElement("div");
        tempDiv.id = "tempContainer";
        document.body.appendChild(tempDiv);

        // load stage
        const stage = Konva.Node.create(item.canvas_data, "tempContainer");

        // replace base layer
        const baseLayer = this.layers.base.clone();
        stage.findOne(".baseLayer").destroy();
        stage.add(baseLayer);
        stage.findOne(".baseLayer").moveToBottom();

        // load images
        const loadImagePromises = [];
        stage.find("Image").forEach((node) => {
          loadImagePromises.push(
            new Promise((resolve, reject) => {
              const imageObj = new Image();
              const url = node.getAttr("source");

              imageObj.onload = () => {
                node.image(imageObj);
                this.applyBaseBackgroundFilters(node);

                resolve();
              };

              imageObj.onerror = reject;

              if (url.includes("http")) {
                fetchAndConvertToBase64Image(url)
                  .then((base64) => {
                    imageObj.src = base64;
                  })
                  .catch(reject);
              } else {
                imageObj.src = url;
              }
            })
          );
        });
        await Promise.all(loadImagePromises);

        // update preview
        item.preview = this.generatePreviewForStage(stage);

        // update color scheme
        item.color_scheme = slide.value.color_scheme;

        // update canvas data
        item.canvas_data = stage.toJSON();

        // save slide
        await presentationsStore.saveSlide(item, slide.value);

        // remove temp container
        tempDiv.parentNode.removeChild(tempDiv);
        return item;
      });
    },

    /*
     * color scheme
     */
    async defineColorScheme(
      baseFill = this.layers.base.findOne(".baseFill"),
      baseBackground = this.layers.base.findOne(".baseBackground")
    ) {
      const computeAverageBrightness = async () => {
        return new Promise(async (resolve) => {
          /*
           * no background image
           */
          if (!baseBackground) {
            /*
             * base fill exists
             */
            if (baseFill?.attrs?.fill) {
              const rgb = colors.hexToRgb(baseFill.attrs.fill);
              return resolve(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b);
            }

            /*
             * no base fill
             */
            return resolve(255);
          }

          // define canvas
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = baseBackground.attrs.width;
          canvas.height = baseBackground.attrs.height;

          // draw base fill
          if (baseFill?.attrs?.fill) {
            ctx.fillStyle = baseFill?.attrs?.fill;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          // apply filters
          ctx.filter = `blur(${baseBackground.blurRadius()}px) contrast(${
            baseBackground.contrast() * 100
          }%) brightness(${baseBackground.brightness() * 100}%)`;

          if (baseBackground.opacity() >= 0) {
            ctx.globalAlpha = baseBackground.opacity();
          }

          const imageObj = new Image();

          let base64;
          let url = baseBackground.getAttr("source");
          if (url.includes("http")) {
            base64 = await fetchAndConvertToBase64Image(url);
            imageObj.src = base64;
          } else {
            imageObj.src = url;
          }

          imageObj.onload = () => {
            // draw background
            ctx.drawImage(
              baseBackground.attrs.image,
              0,
              0,
              canvas.width,
              canvas.height
            );

            // compute average brightness
            let sumBrightness = 0;
            const imageData = ctx.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            ).data;

            for (let i = 0; i < imageData.length; i += 4) {
              const r = imageData[i];
              const g = imageData[i + 1];
              const b = imageData[i + 2];
              const brightness = (r + g + b) / 3;
              sumBrightness += brightness;
            }

            return resolve(sumBrightness / (canvas.width * canvas.height));
          };
        });
      };

      const averageBrightness = await computeAverageBrightness();
      const brightnessThreshold = 128;

      return averageBrightness > brightnessThreshold
        ? COLOR_SCHEME_OPTIONS.light
        : COLOR_SCHEME_OPTIONS.dark;
    },

    /*
     * customization
     */
    setCustomization() {
      const nodes = this.transformer.default?.nodes();

      if (nodes) {
        nodes.forEach((node) => {
          switch (node.getClassName()) {
            case "Image":
              this.image.opacity = node.opacity();

              this.image.cornerRadius = Math.round(
                (node.cornerRadius() / Math.min(node.width(), node.height())) *
                  100
              );

              this.image.stroke = node.stroke();
              this.image.strokeWidth =
                node.strokeWidth() === 0.1 ? 0 : node.strokeWidth();

              this.image.shadowColor = node.shadowColor();
              this.image.shadowBlur = node.shadowBlur();
              this.image.shadowOffset = node.shadowOffset();
              this.image.shadowOpacity = node.shadowOpacity();

              this.image.clipPosition = node.getAttr("lastCropUsed");

              break;

            case "Line":
              this.drawing.stroke = node.stroke();
              this.drawing.strokeWidth = node.strokeWidth();

              break;
          }
        });
      }
    },

    applyCustomizationChanges() {
      const nodes = this.transformer.default?.nodes();

      if (nodes) {
        nodes.forEach((node) => {
          switch (node.getClassName()) {
            // image
            case "Image":
              node.opacity(this.image.opacity);
              node.cornerRadius(
                Math.min(node.width(), node.height()) *
                  (this.image.cornerRadius / 100)
              );

              // node.stroke(
              //   this.image.strokeWidth === 0 ? "transparent" : this.image.stroke
              // );
              // node.strokeWidth(
              //   this.image.strokeWidth === 0 ? 0.1 : this.image.strokeWidth
              // );

              node.stroke(
                this.image.strokeWidth === 0 ? "transparent" : this.image.stroke
              );
              node.strokeWidth(
                this.image.strokeWidth === 0 ? 0.1 : this.image.strokeWidth
              );

              node.shadowColor(this.image.shadowColor);
              node.shadowBlur(this.image.shadowBlur);
              node.shadowOffset(this.image.shadowOffset);
              node.shadowOpacity(this.image.shadowOpacity);

              /*
               * crop
               */
              node.setAttrs({
                scaleX: 1,
                scaleY: 1,
                width: node.width() * node.scaleX(),
                height: node.height() * node.scaleY(),
              });

              node.setAttr("lastCropUsed", this.image.clipPosition);
              const crop = this.getCrop(
                node.image(),
                { width: node.width(), height: node.height() },
                this.image.clipPosition
              );
              node.setAttrs(crop);

              break;

            // drawing
            case "Line":
              node.stroke(this.drawing.stroke);
              node.strokeWidth(this.drawing.strokeWidth);

              break;
          }
        });
      }

      this.handleSlideUpdate();
    },

    /*
     * drawing
     */
    handleDrawing() {
      const handleMouseDown = () => {
        if (this.mode !== this.MODE_OPTIONS.drawing) return;
        if (this.transformer.default?.nodes()?.length) return;

        this.drawing.isPainting = true;

        const stageTransform = this.stages.default
          .getAbsoluteTransform()
          .copy();
        const position = stageTransform
          .invert()
          .point(this.stages.default.getPointerPosition());

        this.drawing.lastLine = new Konva.Line({
          stroke: this.drawing.stroke,
          strokeWidth: this.drawing.strokeWidth,
          globalCompositeOperation:
            this.drawing.mode === DRAWING_MODES.BRUSH
              ? "source-over"
              : "destination-out",
          lineCap: "round",
          lineJoin: "round",
          points: [position.x, position.y, position.x, position.y],
          draggable: true,
          name: this.MODE_OPTIONS.drawing,
        });
        console.log(this.drawing.lastLine);
        this.layers.default.add(this.drawing.lastLine);
        console.log(this.layers.default.find(".line"));
      };

      const handleMouseUp = () => {
        this.drawing.isPainting = false;
        if (this.mode === this.MODE_OPTIONS.drawing) {
          this.handleSlideUpdate();
        }
      };

      const handleMouseMove = (event) => {
        if (!this.drawing.isPainting) return;

        // prevent scrolling on touch devices
        event.evt.preventDefault();

        const stageTransform = this.stages.default
          .getAbsoluteTransform()
          .copy();
        const position = stageTransform
          .invert()
          .point(this.stages.default.getPointerPosition());

        const newPoints = this.drawing.lastLine
          .points()
          .concat([position.x, position.y]);
        this.drawing.lastLine.points(newPoints);
      };

      this.stages.default.off("mousedown touchstart", handleMouseDown);
      this.stages.default.off("mouseup touchend", handleMouseUp);
      this.stages.default.off("mousemove touchmove", handleMouseMove);

      this.stages.default.on("mousedown touchstart", handleMouseDown);
      this.stages.default.on("mouseup touchend", handleMouseUp);
      this.stages.default.on("mousemove touchmove", handleMouseMove);
    },

    /*
     * image
     */
    getCrop(image, size, clipPosition = this.image.clipPosition) {
      const width = size.width;
      const height = size.height;
      const aspectRatio = width / height;

      let newWidth;
      let newHeight;

      const imageRatio = image.width / image.height;

      if (aspectRatio >= imageRatio) {
        newWidth = image.width;
        newHeight = image.width / aspectRatio;
      } else {
        newWidth = image.height * aspectRatio;
        newHeight = image.height;
      }

      let x = 0;
      let y = 0;
      switch (clipPosition) {
        case CROP_POSITION_OPTIONS.none:
          x = 0;
          y = 0;
          newWidth = image.width;
          newHeight = image.height;
          break;

        case CROP_POSITION_OPTIONS.centerTop:
          x = (image.width - newWidth) / 2;
          y = 0;
          break;

        case CROP_POSITION_OPTIONS.centerMiddle:
          x = (image.width - newWidth) / 2;
          y = (image.height - newHeight) / 2;
          break;

        case CROP_POSITION_OPTIONS.centerBottom:
          x = (image.width - newWidth) / 2;
          y = image.height - newHeight;
          break;

        case CROP_POSITION_OPTIONS.rightTop:
          x = image.width - newWidth;
          y = 0;
          break;

        case CROP_POSITION_OPTIONS.rightMiddle:
          x = image.width - newWidth;
          y = (image.height - newHeight) / 2;
          break;

        case CROP_POSITION_OPTIONS.rightBottom:
          x = image.width - newWidth;
          y = image.height - newHeight;
          break;

        case CROP_POSITION_OPTIONS.leftTop:
          x = 0;
          y = 0;
          break;

        case CROP_POSITION_OPTIONS.leftMiddle:
          x = 0;
          y = (image.height - newHeight) / 2;
          break;

        case CROP_POSITION_OPTIONS.leftBottom:
          x = 0;
          y = image.height - newHeight;
          break;

        default:
          console.error(
            new Error("Unknown clip position property - " + clipPosition)
          );
          break;
      }

      return {
        cropX: x,
        cropY: y,
        cropWidth: newWidth,
        cropHeight: newHeight,
      };
    },

    async addImage(url) {
      const imageObj = new Image();

      let base64;
      if (url.includes("http")) {
        base64 = await fetchAndConvertToBase64Image(url);
        imageObj.src = base64;
      } else {
        imageObj.src = url;
      }

      imageObj.onload = () => {
        const imageWidth = imageObj.width;
        const imageHeight = imageObj.height;

        const aspectRatio = imageWidth / imageHeight;

        const canvasWidth = this.scene.width;
        const canvasHeight = this.scene.height;

        const maxWidth = canvasWidth * 0.5;
        const maxHeight = canvasHeight * 0.5;

        let newWidth, newHeight;
        if (maxWidth / maxHeight > aspectRatio) {
          newHeight = maxHeight;
          newWidth = newHeight * aspectRatio;
        } else {
          newWidth = maxWidth;
          newHeight = newWidth / aspectRatio;
        }

        const x = (canvasWidth - newWidth) / 2;
        const y = (canvasHeight - newHeight) / 2;

        const image = new Konva.Image({
          x: x,
          y: y,
          image: imageObj,
          width: newWidth,
          height: newHeight,
          draggable: true,
          cornerRadius: 6,
          name: this.MODE_OPTIONS.image,
        });

        this.layers.default.add(image);

        this.processImageNode(image, url);

        // save slide on new image added
        this.handleSlideUpdate();
      };
    },

    processImageNode(image, url, clipPosition = this.image.clipPosition) {
      // set source
      image.setAttr("source", url);

      // apply crop
      image.setAttr("lastCropUsed", clipPosition);
      const crop = this.getCrop(
        image.image(),
        { width: image.width(), height: image.height() },
        clipPosition
      );
      image.setAttrs(crop);

      // on transform
      const handleTransform = () => {
        image.setAttrs({
          scaleX: 1,
          scaleY: 1,
          width: image.width() * image.scaleX(),
          height: image.height() * image.scaleY(),
        });

        // apply crop
        image.setAttr("lastCropUsed", this.image.clipPosition);
        const crop = this.getCrop(
          image.image(),
          { width: image.width(), height: image.height() },
          this.image.clipPosition
        );
        image.setAttrs(crop);
      };

      image.off("transform", handleTransform);
      image.on("transform", handleTransform);

      // on transform end
      const handleTransformEnd = () => {
        this.handleSlideUpdate();
      };

      image.off("transformend", handleTransformEnd);
      image.on("transformend", handleTransformEnd);
    },

    async replaceImage(nodes = this.transformer.default?.nodes(), url) {
      const imageObj = new Image();

      let base64;
      if (url.includes("http")) {
        base64 = await fetchAndConvertToBase64Image(url);
        imageObj.src = base64;
      } else {
        imageObj.src = url;
      }

      imageObj.onload = () => {
        nodes
          .filter((node) => node.getClassName() === "Image")
          .forEach((node) => {
            node.image(imageObj);
            this.processImageNode(node, url, node.getAttr("lastCropUsed"));
          });

        this.handleSlideUpdate();
      };
    },
  },
});
