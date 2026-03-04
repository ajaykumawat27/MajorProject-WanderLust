const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(() => console.log("Database connected successfully!"))
.catch(err => console.log(err));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");//connect with local db wanderlust
}

const initDB = async() => {
    await Listing.deleteMany({});

    // it will add array named owner with each listing
    const newData = initData.data.map((obj) =>({
        ...obj,
        owner: new mongoose.Types.ObjectId("690a455830e1a72417bb64a2")
    }));

    //Here initData is Object bcz exported as Object from data.js
    await Listing.insertMany(newData);
    console.log("data was initialized");
}
initDB();