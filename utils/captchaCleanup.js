const cron = require("node-cron");
const Captcha = require("../models/Captcha");

cron.schedule("*/10 * * * *", async()=>{

  const tenMinutesAgo =
    new Date(Date.now() - 10*60*1000);

  await Captcha.deleteMany({
    createdAt:{
      $lt:tenMinutesAgo
    }
  });

});