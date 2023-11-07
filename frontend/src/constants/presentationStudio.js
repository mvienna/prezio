export const SLIDE_TYPES = {
  /*
   * content
   */
  CONTENT: "content",
  QR: "qr",
  VIDEO: "video",

  /*
   * quizzes & games
   */
  PICK_ANSWER: "pick_answer",
  PICK_IMAGE: "pick_image",
  TYPE_ANSWER: "type_answer",
  SPINNER_WHEEL: "spinner_wheel",
  MATCH_PAIRS: "match_pairs",
  CORRECT_ORDER: "correct_order",

  /*
   * opinion & qna
   */
  POLL: "poll",
  OPEN_ENDED: "open_ended",
  WORD_CLOUD: "word_cloud",
  SCALES: "scales",
  QNA: "qna",
  BRAIN_STORM: "brain_storm",
};

export const SLIDE_TYPES_OF_QUIZ = [
  SLIDE_TYPES.PICK_ANSWER,
  SLIDE_TYPES.PICK_IMAGE,
  SLIDE_TYPES.TYPE_ANSWER,
];
