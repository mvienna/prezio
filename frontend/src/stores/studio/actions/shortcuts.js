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

  /*
   * delete
   */
  if (event.key === "Delete" || event.key === "Backspace") {
    event.preventDefault();
    this.deleteNodes();
  }

  if (event.ctrlKey || event.metaKey) {
    /*
     * text formatting
     */
    if (
      this.transformer.default
        ?.nodes()
        ?.filter((node) => node.getAttr("name") === this.MODE_OPTIONS.TEXT)
        .length
    ) {
      // bold
      if (event.key === "b") {
        event.preventDefault();
        this.text.fontStyle = (
          this.text.fontStyle.includes("bold")
            ? this.text.fontStyle.replace("bold", "")
            : this.text.fontStyle.replace("normal", "") + " bold"
        )
          .replace(/\s+/g, " ")
          .trim();
        this.applyCustomization();
        return;
      }

      // underline
      if (event.key === "u") {
        event.preventDefault();
        this.text.textDecoration = (
          this.text.textDecoration.includes("underline")
            ? this.text.textDecoration.replace("underline", "")
            : this.text.textDecoration + " underline"
        )
          .replace(/\s+/g, " ")
          .trim();
        this.applyCustomization();
        return;
      }

      // italic
      if (event.key === "i") {
        event.preventDefault();
        this.text.fontStyle = (
          this.text.fontStyle.includes("italic")
            ? this.text.fontStyle.replace("italic", "")
            : this.text.fontStyle.replace("normal", "") + " italic"
        )
          .replace(/\s+/g, " ")
          .trim();
        this.applyCustomization();
        return;
      }

      // strike-through
      if (event.key === "x" && event.shiftKey) {
        event.preventDefault();
        this.text.textDecoration = (
          this.text.textDecoration.includes("line-through")
            ? this.text.textDecoration.replace("line-through", "")
            : this.text.textDecoration + " line-through"
        )
          .replace(/\s+/g, " ")
          .trim();
        this.applyCustomization();
        return;
      }
    }

    /*
     * z-index
     */
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

      return;
    }

    // copy
    if (event.key === "c") {
      event.preventDefault();
      this.copyNodes();
      return;
    }

    // paste
    if (event.key === "v") {
      event.preventDefault();
      this.pasteNodes();
      return;
    }

    // duplicate
    if (event.key === "d") {
      event.preventDefault();
      this.duplicateNodes();
      return;
    }

    // cut
    if (event.key === "x") {
      event.preventDefault();
      this.cutNodes();
      return;
    }

    /*
     * undo & redo
     */
    if (event.key === "z") {
      event.preventDefault();

      // redo
      if (event.shiftKey) {
        this.redo();

        // undo
      } else {
        this.undo();
      }

      return;
    }

    // redo
    if (event.key === "y") {
      event.preventDefault();
      this.redo();

      return;
    }
  }
}
