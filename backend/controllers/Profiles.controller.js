const userModel = require('../Model/UserModel.js');

const oppUsers = async (req, res) => {
  try {
    // Find users whose gender is not equal to req.user.gender
    const opp = await userModel.find({ gender: { $ne: req.user.gender } }).sort({ createdAt: -1 });

    // If no users are found, send a 400 response with a message
    if (!opp || opp.length === 0) {
      return res.status(400).json({ msg: "No users found" });
    }

    // Return the found users
    return res.status(201).json({ opp: opp });
  } catch (error) {
    // Handle any errors and send a 400 response with the error message
    return res.status(400).json({ error: error.message });
  }

};

// const filteredData = async (req, res) => {
//   try {
//     const { gender, age, city, budget } = req.body;

//     console.log("req.body=>>", req.body);
//     const all = await userModel.find(); 

//     const filterData = all.filter(user =>
//       (!gender || user.gender === gender) &&
//       (!city || user.city === city) &&
//       (!age || user.age >= age) &&
//       (!budget || user.weddingBudget >= budget)
//     ); // Apply correct filtering conditions

//     // console.log(filterData);
//     return res.status(200).json({ all: filterData });

//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };

const filteredData = async (req, res) => {
  try {
    const { gender, age, city, budget, unqId } = req.body;
    console.log("SSSXXXXXXXSS:=>", req.body);
    let id = null;
    if (unqId) {
      // Remove MMR or any letters, keep only digits
      id = unqId.replace(/\D/g, "");   // "MMR0046" → "46"
    }
    // 🔥 Build MongoDB query (much faster than filtering in JS)
    const query = {};

    if (gender) query.gender = gender;

    if (id && id.trim() !== "") {
      query.unqId = id;     // direct match
    }

    if (city && city.trim() !== "") query.city = city.trim();

    if (age) query.age = { $gte: Number(age) };

    if (budget) query.weddingBudget = { $gte: Number(budget) };

    const users = await userModel.find(query).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, total: users.length, data: users, });

  } catch (error) {
    console.error("Filter Error:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
};


const getSingleUser = async (req, res) => { // give user with id
  const id = req.params.id;
  const user = await userModel.findOne({ _id: id });
  if (!user) return res.status(400).json({ msg: "user not found" });
  return res.status(202).json({ user: user });
}

const allCities = async (req, res) => {
  try {
    const allCity = await userModel.find();
    return res.status(200).json({ city: allCity });
  } catch (error) {
    return res.status(502).json({ error: error });
  }
}

module.exports = { oppUsers, filteredData, getSingleUser, allCities };