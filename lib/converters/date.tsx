const monthsNames: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const monthShortNames: string[] = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// convert SQL date to readable date sting format
// convert date from YYYY_MM_DD to DD month, YYYY
// this is useful in nextjs response from API
export const fromYYYY_MM_DD_to_DD_month_YYYY = (
  databaseFormat: string,
): [string, string] => {
  console.log("databaseFormat:", databaseFormat);
  const splitDatabaseFormat = databaseFormat.split("-");
  if (splitDatabaseFormat.length != 3) {
    return ["the date format in invalide", ""];
  }
  if (
    !(
      splitDatabaseFormat[0].match(/\d{4}/) &&
      splitDatabaseFormat[1].match(/\d{2}/) &&
      splitDatabaseFormat[2].match(/\d{2}/)
    )
  ) {
    return ["the date format in invalide", ""];
  }

  splitDatabaseFormat[2] = splitDatabaseFormat[2].split("T")[0];

  const splitDatabaseFormatNumber = splitDatabaseFormat.map((element) =>
    Number(element),
  );

  if (
    splitDatabaseFormatNumber[0] < 1000 &&
    splitDatabaseFormatNumber[0] > 9999 &&
    splitDatabaseFormatNumber[1] < 1 &&
    splitDatabaseFormatNumber[1] > 12 &&
    splitDatabaseFormatNumber[2] < 1 &&
    splitDatabaseFormatNumber[2] > 31
  ) {
    return ["the date is incorrect", ""];
  }

  console.log(
    `${splitDatabaseFormat[2]} ${monthsNames[Number(splitDatabaseFormat[1]) - 1]}, ${splitDatabaseFormat[0]}`,
  );

  return [
    "",
    `${splitDatabaseFormat[2]} ${monthsNames[Number(splitDatabaseFormat[1]) - 1]}, ${splitDatabaseFormat[0]}`,
  ];
};

// Function to format a JavaScript Date object to "YYYY-MM-DD"
export const formatDateToSQL = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// convert date from Mon DD YYYY 01:00:00 GMT+0100 (GMT+01:00) to DD Month, YYYY
// useful in nextjs server actions and server side rendering
export const fromFullStringDateTo_month_DD_YYYY = (
  fullStringFormat: string,
): [string, string] => {
  console.log("fullStringFormat:", fullStringFormat);
  const splitedDate = fullStringFormat.split(" ");
  if (splitedDate.length != 7) {
    return ["the date format in invalide", ""];
  }

  for (let i = 0; i < monthShortNames.length; i++) {
    if (splitedDate[1] === monthShortNames[i]) {
      splitedDate[1] = monthsNames[i];
      break;
    }
  }

  return ["", `${splitedDate[2]} ${splitedDate[1]}, ${splitedDate[3]}`];
};
