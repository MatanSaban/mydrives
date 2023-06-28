export const israeliDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let formattedDate = "";

  if (isNaN(year) || isNaN(month) || isNaN(day)) {
    // Invalid date format
    return formattedDate;
  }

  if (day === 1) {
    formattedDate = `${month}/${year}`;
  } else {
    formattedDate = `${day}/${month}/${year}`;
  }

  return formattedDate;
};
