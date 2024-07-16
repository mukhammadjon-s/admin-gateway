export const formatErrorMessage = (error: string): string | string[] => {
  const filed = error
    .split('Unique constraint failed on the fields: (')[1]
    ?.match(/[a-zA-Z0-9]+/)[0];

  const message = filed
    ? `Field '${filed}' should be unique. '${filed}' already registered`
    : error;

  return message;
};
