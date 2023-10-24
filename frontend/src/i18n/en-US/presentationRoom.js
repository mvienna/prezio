export default {
  presentationRoom: {
    header: {
      backToStudio: "Back to Studio",
      roomLink: {
        title: "To join, go to:",
        copyToClipboard: "Click to copy",
        copied: "Copied, ready to share!",
      },
      invitationPanel: {
        show: "Show QR code",
        hide: "Hide QR code",
      },
    },

    footer: {
      menu: {
        title: "Menu",

        terminateRoom: "End Presentation",
        openBackstage: "Show Backstage",
        fullscreen: {
          on: "Full Screen Mode",
          off: "Windowed Mode",
        },
        invitationPanel: {
          show: "Show QR code",
          hide: "Hide QR code",
        },
        informationPanel: {
          show: "Show Header",
          hide: "Hide Header",
        },
        privacy: {
          private: "Make Private",
          public: "Make Public",
        },
      },

      hideResults: {
        tooltip: {
          on: "Results are displayed",
          off: "Results are hidden",
        },

        dialog: {
          title: "Results are hidden",
          description: `Received {answersCount} answers`,
          toggle: "Show results",
        },
      },

      submissionLock: {
        on: "Submission allowed",
        off: "Submission blocked",

        toggle: {
          on: "Click to unlock answer submission",
          off: "Click to lock answer submission",
        },

        resetTime: {
          sec: "sec",
        },
      },
    },

    invitationPanel: {
      title: "Scan",
      otherOption: {
        or: "or",
        url: "Go to",
        id: "And enter",
      },
    },

    auth: {
      form: {
        submit: "Join Now",
      },
      guest: "Гость",
    },
    isPrivate: {
      title: "The presentation is in private mode",
      description:
        "Once the presenter has switched to public, you can see and interact with their slides",
    },

    answers: {
      placeholder: "Your Answer...",
      invalidLength: "The answer should contain no more than 25 characters",
      submit: {
        title: "Submit",
        submissionIsLocked: "Submission is locked",
      },
      waitForSubmissionToBeUnlocked: "Wait for the voting to begin",
      multipleEntriesAvailable:
        "You can submit answers an unlimited number of times",
      answersSubmittedWait:
        "You've already answered this question. Please wait for the presenter to show the next slide.",
    },
  },
};
