// messages.js (backend)
router.get("/admin/messages", authenticateAdmin, async (req, res) => {
  const messages = await Contact.find().sort({ createdAt: -1 });
  res.json(messages);
});
