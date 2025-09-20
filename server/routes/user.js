const router = require("express").Router();
const Booking = require("../Models/Booking");
const User = require("../Models/User");
const Listing = require("../Models/Listing");

// get trip list
router.get("/:userId/trips", async(req,res)=>{
    try {
        const {userId} = req.params;
        const trips = await Booking.find({customerId: userId}).populate("customerId hostId listingId");
        res.status(202).json(trips);
    } catch (err) {
        res.status(404).json({message: "can not find trips!", error: err.message});
    }
});

// Add listing to wishlist


router.patch("/:userId/:listingId", async (req, res) => {
  try {
    const { userId, listingId } = req.params;
    const user = await User.findById(userId);

    const alreadyAdded = user.wishList.some(
      (id) => id.toString() === listingId
    );

    if (alreadyAdded) {
      // remove
      user.wishList = user.wishList.filter(
        (id) => id.toString() !== listingId
      );
    } else {
      // add
      user.wishList.push(listingId);
    }

    await user.save();
    res.status(200).json({ wishList: user.wishList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



/* GET PROPERTY LIST */
router.get("/:userId/properties", async (req, res) => {
  try {
    const { userId } = req.params
    const properties = await Listing.find({ creator: userId }).populate("creator")
    res.status(202).json(properties)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find properties!", error: err.message })
  }
})

/* GET RESERVATION LIST */
router.get("/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.params
    const reservations = await Booking.find({ hostId: userId }).populate("customerId hostId listingId")
    res.status(202).json(reservations)
  } catch (err) {
    console.log(err)
    res.status(404).json({ message: "Can not find reservations!", error: err.message })
  }
})


module.exports = router;
