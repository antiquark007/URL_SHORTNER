const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl"); // Ensure the model file is properly named and imported
const app = express();

mongoose.connect("mongodb://localhost/urlShortener", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls }); // Pass the fetched URLs to the view
});

app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});

app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl == null) return res.sendStatus(404);

  shortUrl.clicks++;
  await shortUrl.save();

  res.redirect(shortUrl.full);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running on port 3000");
});