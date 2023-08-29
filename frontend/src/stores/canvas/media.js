import { defineStore, storeToRefs } from "pinia";
import { useCanvasStore } from "stores/canvas/index";

const { ctx, canvas, images, mouse } = storeToRefs(useCanvasStore());
const canvasStore = useCanvasStore();

export const useCanvasMediaStore = defineStore("canvasMedia", {
  state: () => ({
    mediaState: {
      selectedImageIndex: -1,

      /*
       * dragging
       */
      isDraggingLine: false,
      dragStart: {
        x: 0,
        y: 0,
      },

      /*
       * resizing
       */
      isResizing: false,
      resizeHandle: null,
      isShiftKeyPressed: false,
      resizeStart: {
        x: 0,
        y: 0,
      },

      /*
       * rotating
       */
      isRotating: false,
      rotationHandle: null,
      initialRotation: 0,
    },
  }),

  actions: {
    redrawCanvas() {
      canvasStore.redrawCanvas();
    },

    /*
     * add image
     */
    addImage(url) {
      const image = new Image();

      image.onload = function () {
        const newImageHeight = canvas.value.height * 0.5;
        const aspectRatio = image.width / image.height;
        const newImageWidth = newImageHeight * aspectRatio;

        const x = (canvas.value.width - newImageWidth) / 2;
        const y = (canvas.value.height - newImageHeight) / 2;

        const imageData = {
          image,
          x,
          y,
          width: newImageWidth,
          height: newImageHeight,
          rotation: 0,
        };

        images.value.push(imageData);
        ctx.value.drawImage(image, x, y, newImageWidth, newImageHeight);
      }.bind(this);

      image.src = url;
    },

    /*
     * select image
     */
    selectImage(event) {
      const mouseX = event.offsetX;
      const mouseY = event.offsetY;

      for (let index = 0; index < images.value.length; index++) {
        const imageData = images.value[index];

        const centerX = imageData.x + imageData.width / 2;
        const centerY = imageData.y + imageData.height / 2;
        const rotatedMouseX =
          Math.cos(-imageData.rotation) * (mouseX - centerX) -
          Math.sin(-imageData.rotation) * (mouseY - centerY) +
          centerX;
        const rotatedMouseY =
          Math.sin(-imageData.rotation) * (mouseX - centerX) +
          Math.cos(-imageData.rotation) * (mouseY - centerY) +
          centerY;

        if (
          rotatedMouseX >= imageData.x &&
          rotatedMouseX <= imageData.x + imageData.width &&
          rotatedMouseY >= imageData.y &&
          rotatedMouseY <= imageData.y + imageData.height
        ) {
          this.mediaState.selectedImageIndex = index;
          this.drawBorder(
            imageData.x,
            imageData.y,
            imageData.width,
            imageData.height,
            imageData.rotation
          );
          return;
        }
      }
    },

    deselectImage() {
      this.mediaState.selectedImageIndex = -1;
      this.redrawCanvas();
    },

    deleteSelectedImage() {
      if (this.mediaState.selectedImageIndex !== -1) {
        images.value = images.value.filter(
          (image, index) => index !== this.mediaState.selectedImageIndex
        );
        this.mediaState.selectedImageIndex = -1;
        this.redrawCanvas();
      }
    },

    drawBorder(x, y, width, height, rotation) {
      ctx.value.save();
      ctx.value.translate(x + width / 2, y + height / 2);
      ctx.value.rotate((rotation * Math.PI) / 180);

      ctx.value.lineWidth = 3;
      ctx.value.strokeStyle = "#4971FF";
      const outlineColor = "#D7E0FF";
      const padding = 10;
      const borderRadius = 8;

      const paddedX = -width / 2 - padding;
      const paddedY = -height / 2 - padding;
      const paddedWidth = width + 2 * padding;
      const paddedHeight = height + 2 * padding;

      ctx.value.strokeStyle = outlineColor;
      ctx.value.strokeRect(
        paddedX - 3,
        paddedY - 3,
        paddedWidth + 6,
        paddedHeight + 6
      );

      ctx.value.strokeStyle = "#4971FF";
      ctx.value.lineJoin = "round";
      ctx.value.strokeRect(
        paddedX,
        paddedY,
        paddedWidth,
        paddedHeight,
        borderRadius
      );

      ctx.value.restore();
    },

    /*
     * dragging
     */
    startDrag(event) {
      this.mediaState.isDraggingLine = true;
      const image = images.value[this.mediaState.selectedImageIndex];

      this.mediaState.dragStart.x =
        event.clientX - canvasStore.canvasRect().left - image.x;
      this.mediaState.dragStart.y =
        event.clientY - canvasStore.canvasRect().top - image.y;
    },

    endDrag() {
      this.mediaState.isDraggingLine = false;
    },

    dragImage(event) {
      if (this.mediaState.isDraggingLine) {
        const newX =
          event.clientX -
          canvasStore.canvasRect().left -
          this.mediaState.dragStart.x;
        const newY =
          event.clientY -
          canvasStore.canvasRect().top -
          this.mediaState.dragStart.y;
        this.moveImage(newX, newY);
      }
    },

    moveImage(newX, newY) {
      const image = images.value[this.mediaState.selectedImageIndex];
      const deltaX = newX - image.x;
      const deltaY = newY - image.y;

      image.x += deltaX;
      image.y += deltaY;

      this.redrawCanvas();
    },

    /*
     * resizing
     */
    getResizeHandle(event) {
      const canvasRect = canvasStore.canvasRect();
      const { paddingLeft, paddingTop } = canvasStore.getPaddings();
      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;

      const image = images.value[this.mediaState.selectedImageIndex];

      const rotatedMouseX =
        Math.cos(-image.rotation) * (mouseX - (image.x + image.width / 2)) -
        Math.sin(-image.rotation) * (mouseY - (image.y + image.height / 2)) +
        (image.x + image.width / 2);

      const rotatedMouseY =
        Math.sin(-image.rotation) * (mouseX - (image.x + image.width / 2)) +
        Math.cos(-image.rotation) * (mouseY - (image.y + image.height / 2)) +
        (image.y + image.height / 2);

      const handles = ["top-left", "top-right", "bottom-left", "bottom-right"];

      for (const handle of handles) {
        let handleX, handleY;

        if (handle.includes("left")) {
          handleX = image.x;
        } else {
          handleX = image.x + image.width - paddingLeft * 2;
        }

        if (handle.includes("top")) {
          handleY = image.y;
        } else {
          handleY = image.y + image.height - paddingTop * 2;
        }

        if (
          Math.abs(rotatedMouseX - handleX) <= paddingLeft &&
          Math.abs(rotatedMouseY - handleY) <= paddingTop
        ) {
          return handle;
        }
      }

      return null;
    },

    startResize(event) {
      this.mediaState.isResizing = true;
      const image = images.value[this.mediaState.selectedImageIndex];

      this.mediaState.resizeStart.width = image.width;
      this.mediaState.resizeStart.height = image.height;
      this.mediaState.resizeStart.x = image.x;
      this.mediaState.resizeStart.y = image.y;
      this.mediaState.resizeStart.clientX =
        event.clientX - canvasStore.canvasRect().left;
      this.mediaState.resizeStart.clientY =
        event.clientY - canvasStore.canvasRect().top;
    },

    endResize() {
      this.mediaState.isResizing = false;
      this.mediaState.resizeHandle = null;
    },

    resizeImage(event) {
      if (this.mediaState.isResizing && this.mediaState.resizeHandle) {
        const image = images.value[this.mediaState.selectedImageIndex];
        const canvasRect = canvasStore.canvasRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;
        const deltaX = mouseX - this.mediaState.resizeStart.clientX;
        const deltaY = mouseY - this.mediaState.resizeStart.clientY;

        if (this.mediaState.isShiftKeyPressed) {
          const aspectRatio = image.width / image.height;
          let newWidth, newHeight;

          switch (this.mediaState.resizeHandle) {
            case "top-left":
              newWidth = Math.max(
                0,
                this.mediaState.resizeStart.width - deltaX
              );
              newHeight = Math.max(0, newWidth / aspectRatio);
              image.x =
                this.mediaState.resizeStart.x +
                (this.mediaState.resizeStart.width - newWidth);
              image.y =
                this.mediaState.resizeStart.y +
                (this.mediaState.resizeStart.height - newHeight);
              break;
            case "top-right":
              newWidth = Math.max(
                0,
                this.mediaState.resizeStart.width + deltaX
              );
              newHeight = Math.max(0, newWidth / aspectRatio);
              image.y =
                this.mediaState.resizeStart.y +
                (this.mediaState.resizeStart.height - newHeight);
              break;
            case "bottom-left":
              newWidth = Math.max(
                0,
                this.mediaState.resizeStart.width - deltaX
              );
              newHeight = Math.max(0, newWidth / aspectRatio);
              image.x =
                this.mediaState.resizeStart.x +
                (this.mediaState.resizeStart.width - newWidth);
              break;
            case "bottom-right":
              newWidth = Math.max(
                0,
                this.mediaState.resizeStart.width + deltaX
              );
              newHeight = Math.max(0, newWidth / aspectRatio);
              break;
          }
          image.width = newWidth;
          image.height = newHeight;
        } else {
          switch (this.mediaState.resizeHandle) {
            case "top-left":
              image.width = Math.max(
                0,
                this.mediaState.resizeStart.width - deltaX
              );
              image.height = Math.max(
                0,
                this.mediaState.resizeStart.height - deltaY
              );
              image.x = this.mediaState.resizeStart.x + deltaX;
              image.y = this.mediaState.resizeStart.y + deltaY;
              break;
            case "top-right":
              image.width = Math.max(
                0,
                this.mediaState.resizeStart.width + deltaX
              );
              image.height = Math.max(
                0,
                this.mediaState.resizeStart.height - deltaY
              );
              image.y = this.mediaState.resizeStart.y + deltaY;
              break;
            case "bottom-left":
              image.width = Math.max(
                0,
                this.mediaState.resizeStart.width - deltaX
              );
              image.height = Math.max(
                0,
                this.mediaState.resizeStart.height + deltaY
              );
              image.x = this.mediaState.resizeStart.x + deltaX;
              break;
            case "bottom-right":
              image.width = Math.max(
                0,
                this.mediaState.resizeStart.width + deltaX
              );
              image.height = Math.max(
                0,
                this.mediaState.resizeStart.height + deltaY
              );
              break;
          }
        }

        this.redrawCanvas();
      }
    },

    /*
     * rotation
     */
    getRotationHandle(event) {
      const canvasRect = canvasStore.canvasRect();
      const { paddingLeft, paddingTop } = canvasStore.getPaddings();
      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;

      const image = images.value[this.mediaState.selectedImageIndex];

      const rotatedMouseX =
        Math.cos(-image.rotation) * (mouseX - (image.x + image.width / 2)) -
        Math.sin(-image.rotation) * (mouseY - (image.y + image.height / 2)) +
        (image.x + image.width / 2);

      const rotatedMouseY =
        Math.sin(-image.rotation) * (mouseX - (image.x + image.width / 2)) +
        Math.cos(-image.rotation) * (mouseY - (image.y + image.height / 2)) +
        (image.y + image.height / 2);

      const handles = ["top-left", "top-right", "bottom-left", "bottom-right"];

      for (const handle of handles) {
        let handleX, handleY;

        if (handle.includes("left")) {
          handleX = image.x;
        } else {
          handleX = image.x + image.width - paddingLeft * 4;
        }

        if (handle.includes("top")) {
          handleY = image.y;
        } else {
          handleY = image.y + image.height - paddingTop * 4;
        }

        if (
          Math.abs(rotatedMouseX - handleX) <= paddingLeft + 24 &&
          Math.abs(rotatedMouseY - handleY) <= paddingTop + 24
        ) {
          return handle;
        }
      }

      return null;
    },

    startRotate(event) {
      const image = images.value[this.mediaState.selectedImageIndex];
      const canvasRect = canvasStore.canvasRect();
      const mouseX = event.clientX - canvasRect.left;
      const mouseY = event.clientY - canvasRect.top;

      this.mediaState.initialRotation = Math.atan2(
        mouseY - (image.y + image.height / 2),
        mouseX - (image.x + image.width / 2)
      );

      this.mediaState.isRotating = true;
    },

    rotateImage(event) {
      if (this.mediaState.isRotating) {
        const image = images.value[this.mediaState.selectedImageIndex];
        const canvasRect = canvasStore.canvasRect();
        const mouseX = event.clientX - canvasRect.left;
        const mouseY = event.clientY - canvasRect.top;

        const currentRotation = Math.atan2(
          mouseY - (image.y + image.height / 2),
          mouseX - (image.x + image.width / 2)
        );

        const rotationDelta = currentRotation - this.mediaState.initialRotation;

        // Convert image.rotation to a number and add rotationDelta
        image.rotation =
          (Number(image.rotation) || 0) + (rotationDelta * 180) / Math.PI;

        this.mediaState.initialRotation = currentRotation;

        this.redrawCanvas();
      }
    },

    endRotate() {
      this.mediaState.isRotating = false;
    },

    /*
     * shortcuts
     */
    shortcuts(event) {
      // delete selected text
      if (event.key === "Delete" || event.key === "Backspace") {
        this.deleteSelectedImage();
      }

      // deselect
      if (event.key === "Escape" || event.key === "Enter") {
        event.preventDefault();
        this.deselectImage();
      }

      // shift
      if (event.key === "Shift") {
        this.mediaState.isShiftKeyPressed = true;
      }
    },
  },
});
