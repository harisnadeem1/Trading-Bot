import { startPlanRoiRegenerator } from "./planRoiRegenerator.js";
import { startDailyRoiJob } from "./dailyRoiJob.js";
import { startDailyBalanceSnapshot } from "./dailyBalanceSnapshot.js";

export const startDailyJobs = () => {
  console.log("Initializing Daily Job System...");

  // Order matters: generate ROI → apply ROI → snapshot balances
  startPlanRoiRegenerator();      // 1 AM
  startDailyRoiJob();             // 2 AM
  startDailyBalanceSnapshot();    // 2:15 AM

  console.log("All daily jobs initialized successfully.");
};
