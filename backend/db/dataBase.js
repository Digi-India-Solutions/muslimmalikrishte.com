// const mongoose = require("mongoose");

// const connectDB = ({process.env.URL})=>{
//     mongoose.connect({process.env.URL}).then(()=>{
//         console.log("connected to db");
//     }).catch(()=>{
//         console.log("connection Error");
//     })
// }

// module.exports = connectDB;



const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose
    .connect(process.env.URL)
    .then(() => console.log("DB connected"))
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectDatabase;