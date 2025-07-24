// Utility for attendance status color mapping
const getStatusColor = (status) => {
  const colors = {
    present: "#8B0000",
    absent: "#DC143C",
    late: "#DAA520",
    excused: "#B8860B",
    pending: "#CD853F",
  };
  return colors[status] || "#CD853F";
};

export default getStatusColor;
