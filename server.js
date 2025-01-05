
// import cluster from 'cluster';
// import "dotenv/config";
// import { connect } from "mongoose";
// import app from "./app.js";
// import game from './models/gameModal.js';
// import { getDayNameFromNumber } from "./utils/getDayNameFromNumber.js";
// async function updateDB() {
//   try {
//     let today = new Date();
//     today.setHours(today.getHours() + 5);
//     today.setMinutes(today.getMinutes() + 30);
//     let yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);
//     yesterday = new Date(
//       yesterday.toISOString().split("T")[0] + "T00:00:00.000Z"
//     );
//     today = new Date(today.toISOString().split("T")[0] + "T00:00:00.000Z");
//     console.log(today, yesterday);
//     const allGames = await game.find({
//       createdAt: {
//         $gte: yesterday,
//         $lte: today,
//       },
//     });
//     console.log("all games: ", allGames.length);
//     // Remove duplicate games based on 'name'
//     const uniqueGames = allGames.filter((gameItem, index, self) =>
//       index === self.findIndex((t) => t.name === gameItem.name)
//     );

//     console.log("Unique games: ", uniqueGames.length);

//     // Get the current date and time, adjusted to your timezone
//     let now = new Date();
//     now.setHours(now.getHours() + 5);
//     now.setMinutes(now.getMinutes() + 30);
//     console.log(now);

//     // Get the current day of the week as a string
//     const day = getDayNameFromNumber(now.getDay());

//     // Iterate through each game and update the required fields
//     for (const item of uniqueGames) {
//       let status = "close";
//       if (item[day] === true) {
//         status = "active";
//       }

//       // Prepare the new data object with updated fields
//       let newItemData = {
//         status,
//         openResult: 5000,
//         closeResult: 5000,
//         combination: 5000,
//         closeAnk: 5000,
//         openAnk: 5000,
//         canPlaceBetonOpen: true,
//         canPlaceBetonClose: true,
//         createdAt: now,
//         resetDate: now,
//       };

//       // Update the game in the database
//       await game.updateOne({ _id: item._id }, { $set: newItemData });
//     }

//     console.log('All games updated successfully');
//   } catch (error) {
//     console.error('Error updating games:', error);
//   }
// }

// const numCPUs = 1;
// // const numCPUs = os.cpus().length;
// console.log(`number of processor --> ${numCPUs}`);

// if (cluster.isPrimary) {
//   // Fork workers based on CPU count (2 * numCPUs + 1)
//   for (let i = 0; i < (numCPUs ); i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died. Forking a new one.`);
//     cluster.fork();
//   });
// } else {
//   // Worker processes have their own instance of the server

//   // Set the timezone to IST
//   process.env.TZ = "Asia/Kolkata";

//   // Connect to the database and start the server
//   connect(process.env.DB_URI)
//     .then(() => {
//       console.log("DB connection successful!");

//       // Optionally call updateDB here or set it up as a scheduled task
//       // updateDB();
//     })
//     .catch((err) => console.log(err.message, `\n DB Connection Failed!...`));

//   // Starting the server in worker processes
//   const PORT = process.env.PORT || 5000;
//   const server = app.listen(PORT, () => {
//     console.log(`Worker ${process.pid}: Server is running on port ${PORT}`);
//   });

//   server.on("error", (err) => {
//     console.error("Error starting the server: ", err.message);
//   });
// }


import { connect } from "mongoose";
import "dotenv/config";
import game from './models/gameModal.js'
import { getDayNameFromNumber } from "./utils/getDayNameFromNumber.js";
async function updateDB() {
  try {

    let today = new Date();
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    yesterday = new Date(
      yesterday.toISOString().split("T")[0] + "T00:00:00.000Z"
    );
    today = new Date(today.toISOString().split("T")[0] + "T00:00:00.000Z");
    console.log(today, yesterday);
    const allGames = await game.find({
      createdAt: {
        $gte: yesterday,
        $lte: today,
      },
    });

    console.log("all games: ", allGames);
    // Remove duplicate games based on 'name'
    const uniqueGames = allGames.filter((gameItem, index, self) =>
      index === self.findIndex((t) => t.name === gameItem.name)
    );

    console.log("Unique games: ", uniqueGames);
    let now = new Date();
    now.setHours(now.getHours() + 5);
    now.setMinutes(now.getMinutes() + 30);
    console.log(now);
    const day = getDayNameFromNumber(today.getDay());
    for (const item of uniqueGames) {
      let status = "close";
      if (item[day] === true) {
        status = "active";
      }
      let newItemData = item.toObject({ versionKey: false });
      delete newItemData._id;
      newItemData = {
        ...newItemData,
        status,
        openResult: 5000,
        closeResult: 5000,
        combination: 5000,
        closeAnk: 5000,
        openAnk: 5000,
        canPlaceBetonOpen: true,
        canPlaceBetonClose: true,
        createdAt: now,
        resetDate: now,
      };
      await game.create(newItemData);
      item.status = "close";
      await item.save();
    }


    console.log('All games updated successfully');
  } catch (error) {
    console.error('Error updating games:', error);
  }

}

import app from "./app.js";
// Set the timezone to IST
process.env.TZ = "Asia/Kolkata";
connect(process.env.DB_URI)
  .then(()=> {
    const nowUTC = new Date();
    console.log("DB connection successfull!....")
    let today = new Date(nowUTC.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);
    console.log("Today (IST): ", today);
    let yesterday = new Date(today);
    let tomorrow = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    tomorrow.setDate(today.getDate() + 1);
    yesterday = new Date(
      yesterday.toISOString().split("T")[0] + "T00:00:00.000Z"
    );
    tomorrow = new Date(
      tomorrow.toISOString().split("T")[0] + "T00:00:00.000Z"
    );
    today = new Date(today.toISOString().split("T")[0] + "T00:00:00.000Z");

    // let today = new Date();
    // today.setHours(today.getHours() + 5);  // Adjust hours for IST
    // today.setMinutes(today.getMinutes() + 30); // Adjust minutes for IST

    // let yesterday = new Date(today);
    // let tomorrow = new Date(today);

    // yesterday.setDate(today.getDate() - 1);  // Set yesterday's date
    // tomorrow.setDate(today.getDate() + 1);  // Set tomorrow's date

    // // Format to ISO date strings and reset to midnight in IST
    // yesterday = new Date(
    //   yesterday.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(",")[0] + "T00:00:00.000Z"
    // );
    // tomorrow = new Date(
    //   tomorrow.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(",")[0] + "T00:00:00.000Z"
    // );
    // today = new Date(
    //   today.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(",")[0] + "T00:00:00.000Z"
    // );

    console.log("Yesterday (IST): ", yesterday);
    console.log("Today (IST): ", today);
    console.log("Tomorrow (IST): ", tomorrow);
    // updateDB()

  }


  )
  .catch((err) => console.log(err.message, `\n Db Connection Failed!...`));

// starting the server
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on the port ${PORT}`);
});

server.on("error", (err) => {
  console.error("Error starting the server: ", err.message);
});
