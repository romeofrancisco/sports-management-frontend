export const DIVISIONS = [
  { value: "male", label: "Men's Division" },
  { value: "female", label: "Women's Division" },
];

export const getDivisionLabel = (value) => {
  const match = DIVISIONS.find((option) => option.value === value);
  return match ? match.label : value;
};
