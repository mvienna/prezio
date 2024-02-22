export function handleShortcuts(event) {
  /*
   * save
   */
  if (event.ctrlKey || event.metaKey) {
    if (event.key === "s") {
      event.preventDefault();
      this.handleSlideUpdate();
    }
  }

  const activeElement = document.activeElement;
  if (activeElement && activeElement.tagName === "INPUT") return;
  if (this.mode === this.MODE_OPTIONS.TEXT_EDITING) return;

  const isTextSelected = () => {
    return this.transformer.default
      ?.nodes()
      ?.filter((node) => node.getAttr("name") === this.MODE_OPTIONS.TEXT)
      .length;
  };

  switch (event.key) {
    // delete
    case "Delete":
    case "Backspace":
      event.preventDefault();
      this.deleteNodes();
      break;

    // deselect elements
    case "Escape":
    case "Enter":
      event.preventDefault();
      this.deselectElements();
      break;

    // deselect elements
    case "a":
      if (event.ctrlKey || event.metaKey) {
        event.preventDefault();

        this.transformer.default?.nodes(
          this.layers.default
            .getChildren()
            .filter((node) =>
              Object.values(this.MODE_OPTIONS).includes(node.getAttr("name")),
            ),
        );

        this.applyTransformerCustomization();
      }
      break;

    // bold
    case "b":
      if (!isTextSelected()) return;

      event.preventDefault();
      this.text.fontStyle = (
        this.text.fontStyle.includes("bold")
          ? this.text.fontStyle.replace("bold", "")
          : this.text.fontStyle.replace("normal", "") + " bold"
      )
        .replace(/\s+/g, " ")
        .trim();
      this.applyCustomization();
      break;

    // underline
    case "u":
      if (!isTextSelected()) return;

      event.preventDefault();
      this.text.textDecoration = (
        this.text.textDecoration.includes("underline")
          ? this.text.textDecoration.replace("underline", "")
          : this.text.textDecoration + " underline"
      )
        .replace(/\s+/g, " ")
        .trim();
      this.applyCustomization();
      break;

    // italic
    case "i":
      if (!isTextSelected()) return;

      event.preventDefault();
      this.text.fontStyle = (
        this.text.fontStyle.includes("italic")
          ? this.text.fontStyle.replace("italic", "")
          : this.text.fontStyle.replace("normal", "") + " italic"
      )
        .replace(/\s+/g, " ")
        .trim();
      this.applyCustomization();
      break;

    // cut
    // strike-through
    case "x":
      if (event.shiftKey) {
        event.preventDefault();
        this.text.textDecoration = (
          this.text.textDecoration.includes("line-through")
            ? this.text.textDecoration.replace("line-through", "")
            : this.text.textDecoration + " line-through"
        )
          .replace(/\s+/g, " ")
          .trim();
        this.applyCustomization();
      } else {
        event.preventDefault();
        this.cutNodes();
      }
      break;

    // copy
    case "c":
      event.preventDefault();
      this.copyNodes();
      break;

    // paste
    case "v":
      event.preventDefault();
      this.pasteNodes();
      break;

    // duplicate
    case "d":
      event.preventDefault();
      this.duplicateNodes();
      break;

    /*
     * undo / redo
     */
    case "z":
      event.preventDefault();
      if (event.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }
      break;

    case "y":
      event.preventDefault();
      this.redo();
      break;

    /*
     * move up || down || top || bottom
     */
    case "ArrowDown":
      event.preventDefault();

      // move to bottom
      if (event.shiftKey) {
        this.moveToBottom();

        // move down
      } else {
        this.moveDown();
      }
      break;

    case "ArrowUp":
      event.preventDefault();

      // move to top
      if (event.shiftKey) {
        this.moveToTop();

        // move up
      } else {
        this.moveUp();
      }
      break;
  }
}
