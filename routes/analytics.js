const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

router.get("/", async (req, res) => {
  const [totalMessages, lastWeekMessages] = await Promise.all([
    Contact.countDocuments(),
    Contact.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    }),
  ]);

  res.json({
    totalMessages,
    lastWeekMessages,
    messagesPerDay: await getMessagesPerDay(),
  });
});

async function getMessagesPerDay() {
  return Contact.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
}

module.exports = router;
