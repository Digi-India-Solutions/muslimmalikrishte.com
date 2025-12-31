const userModel = require('../Model/UserModel.js');

const oppUsers = async (req, res) => {
  try {
    // Find users whose gender is not equal to req.user.gender
    const opp = await userModel.find({ gender: { $ne: req.user.gender } }).sort({ unqId: -1 });

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
    console.log("XXXXXXXDDD::=>", req.body, gender, age, city, budget, unqId);
    const query = {};

    // ✅ Gender (case-insensitive)
    if (typeof gender === 'string' && gender.trim()) {
      query.gender = { $regex: `^${gender.trim()}$`, $options: 'i' };
    }

    // ✅ Unique ID (extract digits only)
    if (typeof unqId === 'string' && unqId.trim()) {
      const id = unqId.replace(/\D/g, '');
      if (id) {
        query.unqId = id;
      }
    }

    // ✅ City filter (matches BOTH city & state)
    if (typeof city === 'string' && city.trim()) {
      query.$or = [
        { city: { $regex: `^${city.trim()}$`, $options: 'i' } },
        { state: { $regex: `^${city.trim()}$`, $options: 'i' } }
      ];
    }

    // ✅ Age (number)
    if (!isNaN(age) && Number(age) > 0) {
      query.age = { $gte: Number(age) };
    }

    // ✅ Budget (stored as STRING → convert in query)
    if (!isNaN(budget) && Number(budget) > 0) {
      query.$expr = {
        $gte: [
          { $toInt: '$weddingBudget' },
          Number(budget)
        ]
      };
    }

    const users = await userModel
      .find(query)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      total: users.length,
      data: users
    });

  } catch (error) {
    console.error('Filter Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
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
    console.log("allCity:=>", allCity);
    return res.status(200).json({ city: allCity });
  } catch (error) {
    return res.status(502).json({ error: error });
  }
}

const allStates = async (req, res) => {
  try {
    const allCity = await userModel.find();
    console.log("allCity:=>", allCity);
    return res.status(200).json({ city: allCity });
  } catch (error) {
    return res.status(502).json({ error: error });
  }
}

module.exports = { oppUsers, filteredData, getSingleUser, allCities, allStates };