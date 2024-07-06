export const inlineButton = (text: string, url: string) => {
  return {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text,
            url,
          },
        ],
      ],
    },
  };
};
