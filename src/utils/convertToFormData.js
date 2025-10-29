export const convertToFormData = (data) => {
  const formData = new FormData();

  // Define fields that are file fields and should be omitted when null
  const fileFields = ['logo', 'image', 'profile', 'avatar', 'photo'];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value === null) {
        // For file fields, don't append anything when null
        if (fileFields.includes(key)) {
          return; // Skip file fields when null
        }
        // For other fields (like foreign keys), send empty string to explicitly clear
        formData.append(key, "");
      } else if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (Array.isArray(value)) {
        value.forEach((item) => {
          formData.append(key, item);
        });
      } else if (value instanceof FileList) {
        if (value.length > 0) {
          formData.append(key, value[0]);
        }
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    }
  });

  return formData;
};
