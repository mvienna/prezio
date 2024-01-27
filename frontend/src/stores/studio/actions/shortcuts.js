export function handleShortcuts(event) {
  const activeElement = document.activeElement;
  if (activeElement && activeElement.tagName === "INPUT") return;
  if (this.mode === this.MODE_OPTIONS.TEXT_EDITING) return;

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

    // undo & redo
    if (event.key === "z") {
      event.preventDefault();

      // redo
      if (event.shiftKey) {
        this.redo();

        // undo
      } else {
        this.undo();
      }
    }

    if (event.key === "y") {
      event.preventDefault();
      this.redo();
    }
  }
}
