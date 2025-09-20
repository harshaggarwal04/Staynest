const router = require("express").Router();
const Listing = require("../Models/Listing.js");
const { uploadListing, cloudinary } = require("../cloudConfig.js");

// ================= CREATE LISTING =================
router.post("/create", uploadListing.array("listingPhotos"), async (req, res) => {
  try {
    const {
      creator,
      category,
      type,
      address,
      aptSuite,
      city,
      state,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    const listingPhotos = req.files;
    if (!listingPhotos || listingPhotos.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    // Upload files to Cloudinary and collect secure URLs
    const listingPhotoPaths = [];
    for (const file of listingPhotos) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "house-rental",
      });
      listingPhotoPaths.push(result.secure_url); // <-- Cloudinary URL
    }

    const newListing = new Listing({
      creator,
      category,
      type,
      address,
      aptSuite,
      city,
      state,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    });

    await newListing.save();
    res.status(200).json(newListing);
  } catch (err) {
    console.error(err);
    res.status(409).json({ message: "Failed to create listing", error: err.message });
  }
});

// ================= GET ALL LISTINGS =================
router.get("/", async (req, res) => {
  const qCategory = req.query.category;
  try {
    const listings = qCategory
      ? await Listing.find({ category: qCategory }).populate("creator")
      : await Listing.find().populate("creator");

    res.status(200).json(listings);
  } catch (err) {
    console.error(err);
    res.status(409).json({ message: "Failed to find listings", error: err.message });
  }
});

// ================= SEARCH LISTINGS =================
router.get("/search/:search", async (req, res) => {
  try {
    const { search } = req.params;
    const regex = new RegExp(search, "i"); // case-insensitive search

    // Search in city, state, country, title, description
    const listings = await Listing.find({
      $or: [
        { city: regex },
        { state: regex },
        { country: regex },
        { title: regex },
        { description: regex },
      ],
    }).populate("creator");

    res.status(200).json(listings);
  } catch (err) {
    console.error(err);
    res.status(409).json({ message: "Search failed", error: err.message });
  }
});


// ================= LISTING DETAILS =================
router.get("/:listingId", async (req, res) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId).populate("creator");
    res.status(200).json(listing);
  } catch (err) {
    console.error(err);
    res.status(404).json({ message: "Listing can't be found", error: err.message });
  }
});



// DELETE LISTING - Only creator can delete
router.delete("/:listingId/:userId", async (req, res) => {
  try {
    const { listingId, userId } = req.params;

    const listing = await Listing.findById(listingId);
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    if (listing.creator.toString() !== userId)
      return res.status(403).json({ message: "You are not authorized to delete this listing" });

    await Listing.findByIdAndDelete(listingId);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete listing", error: err.message });
  }
});


module.exports = router;
