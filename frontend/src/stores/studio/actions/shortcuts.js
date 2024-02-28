export function handleShortcuts(event) {
  // disable other shortcuts on text editing OR when focused on an input
  const activeElement = document.activeElement;
  if (activeElement && activeElement.tagName === "INPUT") return;
  if (this.mode === this.MODE_OPTIONS.TEXT_EDITING) return;

  // delete selected nodes
  if (["Delete", "Backspace"].includes(event.key)) {
    this.deleteNodes();
    return;
  }

  // remove selection
  if (["Escape", "Enter"].includes(event.key)) {
    event.preventDefault();
    this.deselectElements();
    return;
  }

  const isTextSelected = this.transformer.default
    ?.nodes()
    ?.filter((node) => node.getAttr("name") === this.MODE_OPTIONS.TEXT).length;

  if (event.ctrlKey || event.metaKey) {
    /* * * * * * * * * */
    /* text formatting */
    /* * * * * * * * * */

    // bold: ctrl/cmd + b
    if (event.keyCode === 66) {
      if (!isTextSelected) return;
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

    // underline: ctrl/cmd + u
    if (event.keyCode === 85) {
      if (!isTextSelected) return;
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

    // italic: ctrl/cmd + i
    if (event.keyCode === 73) {
      if (!isTextSelected) return;
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

    // strike-through: ctrl/cmd + shift + x
    if (event.keyCode === 88 && event.shiftKey) {
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

    /* * * * * * * * */
    /* nodes actions */
    /* * * * * * * * */

    // select all nodes: ctrl/cmd + a
    if (event.keyCode === 65) {
      event.preventDefault();

      this.transformer.default?.nodes(
        this.layers.default
          .getChildren()
          .filter((node) =>
            Object.values(this.MODE_OPTIONS).includes(node.getAttr("name")),
          ),
      );

      this.applyTransformerCustomization();
      return;
    }

    // copy: ctrl/cmd + c
    if (event.keyCode === 67) {
      event.preventDefault();
      this.copyNodes();
      return;
    }

    // cut: ctrl/cmd + x
    if (event.keyCode === 88) {
      event.preventDefault();
      this.cutNodes();
      return;
    }

    // paste: ctrl/cmd + v
    if (event.keyCode === 86) {
      event.preventDefault();
      this.pasteNodes();
      return;
    }

    // duplicate: ctrl/cmd + d
    if (event.keyCode === 68) {
      event.preventDefault();
      this.duplicateNodes();
      return;
    }

    // move up: ctrl/cmd + ↑
    // move to the top: ctrl/cmd + shift + ↑
    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (event.shiftKey) {
        this.moveToTop();
      } else {
        this.moveUp();
      }

      return;
    }

    // move down: ctrl/cmd + ↓
    // move to the bottom: ctrl/cmd + shift + ↓
    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (event.shiftKey) {
        this.moveToBottom();
      } else {
        this.moveDown();
      }

      return;
    }

    /* * * * * * * * */
    /* slide actions */
    /* * * * * * * * */

    // save: ctrl/cmd + s
    if (event.keyCode === 83) {
      event.preventDefault();
      this.handleSlideUpdate();
      return;
    }

    // undo: ctrl/cmd + z
    // redo: ctrl/cmd + shift + z
    if (event.keyCode === 90) {
      event.preventDefault();

      if (event.shiftKey) {
        this.redo();
      } else {
        this.undo();
      }

      return;
    }

    // redo: ctrl/cmd + y
    if (event.keyCode === 89) {
      event.preventDefault();
      this.redo();
      return;
    }
  }
}
