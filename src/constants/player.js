export const COURSE_CHOICES = [
  { value: "stem", label: "STEM" },
  { value: "gas", label: "GAS" },
  { value: "humss", label: "HUMSS" },
  { value: "abm", label: "ABM" },
  { value: "bs_cs", label: "BS Computer Science" },
  { value: "bs_ba", label: "BS Business Administration" },
];

export const YEAR_LEVEL_CHOICES = [
  { value: "grade_7", label: "Grade 7" },
  { value: "grade_8", label: "Grade 8" },
  { value: "grade_9", label: "Grade 9" },
  { value: "grade_10", label: "Grade 10" },
  { value: "grade_11", label: "Grade 11" },
  { value: "grade_12", label: "Grade 12" },
  { value: "1st_year_college", label: "1st Year College" },
  { value: "2nd_year_college", label: "2nd Year College" },
];

export const getCourseLabel = (value) => {
  const match = COURSE_CHOICES.find((option) => option.value === value);
  return match ? match.label : value;
};

export const getYearLevelLabel = (value) => {
  const match = YEAR_LEVEL_CHOICES.find((option) => option.value === value);
  return match ? match.label : value;
};
