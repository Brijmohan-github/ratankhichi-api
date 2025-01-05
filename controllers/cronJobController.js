import schedule from "node-schedule";
import user from "../models/userModel.js";
import game from "../models/gameModal.js";
import {bet, oldBet} from "../models/betModal.js";
// import { bet } from "../models/betModal.js";
import transection from "../models/transectionModel.js";
import { getDayNameFromNumber } from "../utils/getDayNameFromNumber.js";



// ==========  Schedule task to run this in every 5 minutes =========

schedule.scheduleJob("*/5 * * * *", async () => {
  try {
    await user.deleteMany({ validuser: false });
  } catch (error) {
    console.error("Error during scheduled task:", error);
  }
});

// ======= Schedule task for 00:02 AM ========

schedule.scheduleJob({ hour: 0, minute: 5, tz: 'Asia/Kolkata' },  async () => {

  try{
    await bet.deleteMany();

  }
  catch (e){
    console.log(e)
  }
  try{
    await transection.updateMany(
      { status: "Pending" },
      { $set: { status: "Rejected" } }
    );
  }
  catch (e){
    console.log(e)
  }
  try {
    // console.log("********* Game Creation Start ***************");


    // Get the current time in the Indian timezone


    // let today = new Date();
    // today.setHours(today.getHours() + 5);
    // today.setMinutes(today.getMinutes() + 30);
    const nowUTC = new Date();
    let today = new Date(nowUTC.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);
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


    console.log("Yesterday (IST): ", yesterday);
    console.log("Today (IST): ", today);
    console.log("Tomorrow (IST): ", tomorrow);
    // // delete all todays game
    // const result = await game.deleteMany({
    //   createdAt: {
    //     $gte: today,
    //     $lte: tomorrow,
    //   },
    // });
    // print(`today deleted game ---> ${result}`)


    const allGames = await game.find({
      createdAt: {
        $gte: yesterday,
        $lte: today,
      },
    });

    // Remove duplicate games based on 'name'
    const uniqueGames = allGames.filter((gameItem, index, self) =>
      index === self.findIndex((t) => t.name === gameItem.name)
    );


    console.log("all games: ", allGames.length);
    console.log("Unique games: ", uniqueGames.length);

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
      console.log(`${newItemData.name} is created ---->`)
      item.status = "close";
      await item.save();
    }


    // delete old game data


    try {
      // Calculate the date 31 days ago from the current date
      const date31DaysAgo = new Date();
      date31DaysAgo.setDate(date31DaysAgo.getDate() - 25);

      // Delete documents older than 31 days
      const result = await game.deleteMany({
        createdAt: { $lt: date31DaysAgo }
      });

      console.log(`Deleted ${result.deletedCount} old DeclareResult  history records.`);
    } catch (error) {
      console.error('Error deleting old winning history records:', error);
    }
// delete old bet data
    try {
      // Calculate the date 31 days ago from the current date
      const date31DaysAgo = new Date();
      date31DaysAgo.setDate(date31DaysAgo.getDate() - 25);

      // Delete documents older than 31 days
      const result = await bet.deleteMany({
        createdAt: { $lt: date31DaysAgo }
      });

      console.log(`Deleted ${result.deletedCount} old DeclareResult  history records.`);
    } catch (error) {
      console.error('Error deleting old winning history records:', error);
    }
    try {
      // Calculate the date 31 days ago from the current date
      const date31DaysAgo = new Date();
      date31DaysAgo.setDate(date31DaysAgo.getDate() - 25);

      // Delete documents older than 31 days
      const result = await oldBet.deleteMany({
        createdAt: { $lt: date31DaysAgo }
      });

      console.log(`Deleted ${result.deletedCount} old DeclareResult  history records.`);
    } catch (error) {
      console.error('Error deleting old winning history records:', error);
    }
    try {
      // Calculate the date 31 days ago from the current date
      const date31DaysAgo = new Date();
      date31DaysAgo.setDate(date31DaysAgo.getDate() - 25);

      // Delete documents older than 31 days
      const result = await transection.deleteMany({
        createdAt: { $lt: date31DaysAgo }
      });

      console.log(`Deleted ${result.deletedCount} old DeclareResult  history records.`);
    } catch (error) {
      console.error('Error deleting old winning history records:', error);
    }


    // try {
    //   // Fetch all games from the database
    //   const allGames = await game.find({});

    //   // Get the current date and time, adjusted to your timezone
    //   let now = new Date();
    //   now.setHours(now.getHours() + 5);
    //   now.setMinutes(now.getMinutes() + 30);
    //   console.log(now);

    //   // Get the current day of the week as a string
    //   const day = getDayNameFromNumber(now.getDay());

    //   // Iterate through each game and update the required fields
    //   for (const item of allGames) {
    //     let status = "close";
    //     if (item[day] === true) {
    //       status = "active";
    //     }

    //     // Prepare the new data object with updated fields
    //     let newItemData = {
    //       status,
    //       openResult: 5000,
    //       closeResult: 5000,
    //       combination: 5000,
    //       closeAnk: 5000,
    //       openAnk: 5000,
    //       canPlaceBetonOpen: true,
    //       canPlaceBetonClose: true,
    //       createdAt: now,
    //       resetDate: now,
    //     };

    //     // Update the game in the database
    //     await game.updateOne({ _id: item._id }, { $set: newItemData });
    //   }

    //   console.log('All games updated successfully');
    // } catch (error) {
    //   console.error('Error updating games:', error);
    // }
    // let now = new Date();
    // now.setHours(now.getHours() + 5);
    // now.setMinutes(now.getMinutes() + 30);

    // // Get the current day of the week as a string
    // const day = getDayNameFromNumber(now.getDay());

    // try {
    //   // Update games that should be active on the current day
    //   const activateGamesResult = await game.updateMany(
    //     { [day]: true }, // Query for games that should be active on the current day
    //     { $set: { status: 'active' } } // Set status to 'active'
    //   );

    //   // Update games that should be inactive on the current day
    //   const deactivateGamesResult = await game.updateMany(
    //     { [day]: false }, // Query for games that should be inactive on the current day
    //     { $set: { status: 'close' } } // Set status to 'close'
    //   );

    //   console.log(`Game statuses updated successfully.
    // ${activateGamesResult.modifiedCount} games set to 'active'.
    // ${deactivateGamesResult.modifiedCount} games set to 'close'.`);
    // } catch (err) {
    //   console.error('Error updating game statuses:', err);
    // }

    // let today = new Date();
    // today.setHours(today.getHours() + 5);
    // today.setMinutes(today.getMinutes() + 30);
    // let yesterday = new Date(today);
    // yesterday.setDate(today.getDate() - 1);
    // yesterday = new Date(
    //   yesterday.toISOString().split("T")[0] + "T00:00:00.000Z"
    // );
    // today = new Date(today.toISOString().split("T")[0] + "T00:00:00.000Z");
    // console.log(today, yesterday);
    // const allGames = await game.find({
    //   createdAt: {
    //     $gte: yesterday,
    //     $lte: today,
    //   },
    // });
    // let now = new Date();
    // now.setHours(now.getHours() + 5);
    // now.setMinutes(now.getMinutes() + 30);
    // console.log(now);
    // const day = getDayNameFromNumber(today.getDay());
    // for (const item of allGames) {
    //   let status = "close";
    //   if (item[day] === true) {
    //     status = "active";
    //   }
    //   let newItemData = item.toObject({ versionKey: false });
    //   delete newItemData._id;
    //   newItemData = {
    //     ...newItemData,
    //     status,
    //     openResult: 5000,
    //     closeResult: 5000,
    //     combination: 5000,
    //     closeAnk: 5000,
    //     openAnk: 5000,
    //     canPlaceBetonOpen: true,
    //     canPlaceBetonClose: true,
    //     createdAt: now,
    //     resetDate: now,
    //   };
    //   await game.create(newItemData);
    //   item.status = "close";
    //   await item.save();
    // }


    // console.log("********* Game Creation End ***************");
  } catch (error) {
    console.error("Error during scheduled task:", error);
  }
});
