export const convertToFormData = (data) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item.toString()));
      } else {
        formData.append(key, value);
      }
    }
  });

  return formData;
};
