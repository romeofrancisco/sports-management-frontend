export const DIVISIONS = [
    {value: "male", label: "Men's Division"},
    {value: "female", label: "Women's Division"}
]

export const SEX = [
    {value: "male", label: "Male"},
    {value: "female", label: "Female"}
]

export const getDivisionLabel = (value) => {
  const match = DIVISIONS.find((option) => option.value === value);
  return match ? match.label : value;
};