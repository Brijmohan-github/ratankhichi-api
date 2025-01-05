// export default function CurrentTime() {
//   const nowUTC = new Date();
//   const offset = 5.5 * 60 * 60 * 1000;
//   const now = new Date(nowUTC.getTime() + offset);
//   const startOfToday = new Date(nowUTC.setHours(0, 0, 0, 0) + offset);
//   return { now, startOfToday };
// }
export default function CurrentTime() {
  const nowUTC = new Date();

  // Convert the current UTC time to IST
  const now = new Date(nowUTC.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

  // Get the start of today in IST
  const startOfToday = new Date(
    new Date(now).setHours(0, 0, 0, 0)
  );

  return { now, startOfToday };
}


console.log(CurrentTime())