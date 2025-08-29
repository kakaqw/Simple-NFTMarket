var express = require("express");
var router = express.Router();

const NFTList = require("../db/mongodb");

/* GET home page. */
router.post("/list", async (req, res, next) => {
  try {
    const NFTItem = req.body.data;

    console.log("NFTItem:", NFTItem);

    const getData = await NFTList.find({
      id: NFTItem.id,
      name: NFTItem.name,
      image: NFTItem.image,
      price: NFTItem.price,
      creator: NFTItem.creator,
      NFTAddress: NFTItem.NFTAddress,
    });

    if (getData.length > 0) {
      console.log("getData:", getData);

      res.send("Success");
    } else {
      await NFTList.create({
        NFTAddress: NFTItem.NFTAddress,
        id: NFTItem.id,
        name: NFTItem.name,
        image: NFTItem.image,
        price: NFTItem.price,
        creator: NFTItem.creator,
      });

      console.log(
        "NFTAddress:",
        NFTItem.NFTAddress,
        "id:",
        NFTItem.id,
        "name:",
        NFTItem.name,
        "image:",
        NFTItem.image,
        "price:",
        NFTItem.price,
        "creator:",
        NFTItem.creator
      );
      console.log("Success");

      // console.log(NFTItemArray);
      res.send("Success");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/cancelList", async (req, res) => {
  try {
    const NFTItem = req.body.data;
    console.log("NFTItem", NFTItem);

    const getData = await NFTList.find({
      id: NFTItem.id,
      name: NFTItem.name,
      image: NFTItem.image,
      price: NFTItem.price,
      creator: NFTItem.creator,
      NFTAddress: NFTItem.NFTAddress,
    });

    if (getData.length > 0) {
      await NFTList.deleteOne({
        id: NFTItem.id,
        name: NFTItem.name,
        image: NFTItem.image,
        price: NFTItem.price,
        creator: NFTItem.creator,
        NFTAddress: NFTItem.NFTAddress,
      });

      res.send("cancelList Success");
    } else {
      console.log("getData:", getData.length);

      res.send("no List");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/updatePrice", async (req, res) => {
  try {
    const NFTItem = req.body.data;
    console.log("NFTItem", NFTItem);

    const getData = await NFTList.find({
      id: NFTItem.id,
      name: NFTItem.name,
      image: NFTItem.image,
      creator: NFTItem.creator,
      NFTAddress: NFTItem.NFTAddress,
    });

    if (getData.length > 0) {
      await NFTList.updateOne(
        {
          id: NFTItem.id,
          NFTAddress: NFTItem.NFTAddress,
          image: NFTItem.image,
        },
        { $set: { price: NFTItem.price } }
      );

      res.send("updatePrice Success");
    } else {
      res.send("no List");
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/getList", async (req, res) => {
  try {
    const getData = await NFTList.find();
    res.send(getData);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
