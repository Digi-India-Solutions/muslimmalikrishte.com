// import React, { useEffect, useState } from "react";
// import "./ProfilePage.css";
// import { Link } from "react-router-dom";
// import { Helmet } from "react-helmet";
// import profilebg from "../../Assets/ProfileBg.jpeg";
// import Modal from "react-modal";
// import { axiosInstance } from "../Login/Loginpage";
// import { useNavigate } from "react-router-dom";

// Modal.setAppElement("#root");

// const ProfilePage = () => {
//   const navigate = useNavigate();
//   const [prf, SetPrf] = useState([]);
//   const [allprf, setAllPrf] = useState([]);
//   const [cities, SetCities] = useState([]);

//   useEffect(() => {
//     const savedScroll = sessionStorage.getItem("profileScroll");
//     if (savedScroll) {
//       window.scrollTo(0, parseInt(savedScroll));
//       sessionStorage.removeItem("profileScroll"); // clear after restoring
//     }
//   }, []);



//   const getDETAILS = async () => {
//     try {
//       const response = await axiosInstance.get(
//         "/api/v1/profiles/opposite/users"
//       );
//       console.log("adta is==>", response.data);
//       setAllPrf(response.data.opp);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getALLDETAILS = async () => {
//     try {
//       const response = await axiosInstance.get("/api/v1/adminPanel/allUsers");
//       console.log("adta is==>", response.data);
//       setAllPrf(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // const cityFilters = async () => {
//   //   try {
//   //     const response = await axiosInstance.get(
//   //       `/api/v1/profiles/city/for/option`
//   //     );
//   //     console.log("XXXXXXX::=>",response.data.city);
//   //     SetCities(response.data.city);
//   //   } catch (error) {
//   //     console.log(error);
//   //   }
//   // };

//   const cityFilters = async () => {
//   try {
//     const response = await axiosInstance.get(`/api/v1/profiles/city/for/option`);

//     const uniqueCities = [
//       ...new Set(
//         response.data.city.map(item =>
//           item.city.trim().toLowerCase()
//         )
//       )
//     ].map(c => ({
//       city: c.charAt(0).toUpperCase() + c.slice(1) // Capitalize
//     }));

//     console.log("Clean Cities:", uniqueCities);
//     SetCities(uniqueCities);

//   } catch (error) {
//     console.log(error);
//   }
// };
//   useEffect(() => {
//     const savedScroll = sessionStorage.getItem("profileScroll");

//     const userStatus = localStorage.getItem("user");
//     if (userStatus) {
//       getDETAILS();
//       cityFilters();
//     } else {
//       getALLDETAILS();
//     }

//     // ⭐ Restore scroll only AFTER data loads
//     setTimeout(() => {
//       if (savedScroll) {
//         window.scrollTo(0, parseInt(savedScroll));
//         sessionStorage.removeItem("profileScroll");
//       }
//     }, 300);
//   }, []);


//   const [isModalOpen, setModalOpen] = useState(false);

//   const [filters, setFilters] = useState({
//     gender: "",
//     age: 25,
//     city: "",
//     budget: 100000,
//     unqId: "",
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // console.log("Applied Filters:", filters);
//     alert("Filters applied successfully!");
//   };

//   const handlefilterSubmit = async () => {
//     try {
//       if (localStorage.getItem("user")) {
//         const response = await axiosInstance.post(
//           "/api/v1/profiles/profiles/filter",
//           filters, // Make sure 'filters' contains gender, age, city, and budget
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         setAllPrf(response?.data?.data);
//       } else {
//         const filterData = allprf.filter(user =>
//           (!filters.gender || user.gender === filters.gender) &&
//           (!filters.city || user.city === filters.city) &&
//           (!filters.age || user.age >= filters.age) &&
//           (!filters.budget || user.weddingBudget >= filters.budget)
//         ); // Apply correct filtering conditions
//         setAllPrf(filterData);
//       }

//       // setAllPrf(response?.data.all);
//       // Handle the response (e.g., set the filtered users in state to render them)
//     } catch (error) {
//       console.error("Error applying filters:", error);
//       // You can show an error message to the user
//     }
//   };

//   return (
//     <>
//       {/* <Helmet>
//         <title>Our Top Profiles</title>
//         <meta
//           name="description"
//           content="Explore the top profiles on our platform"
//         />
//       </Helmet>

//       <section>
//         <div className="page-header">
//           <h2>Every Journey Starts With a Connection</h2>
//           <div className="page-render">
//             <Link to="/">Home &nbsp; </Link>
//             <p>&gt; Profile</p>
//           </div>
//         </div>
//       </section> */}

//       <section className="Profile-section">
//         <div className="container">
//           <div className="Heading">
//             <h2>Explore Our Top Profiles</h2>
//           </div>

//           <div className="row filter-bar">
//             <h2 className="col-12 text-center">Find Your Perfect Match</h2>
//             <form
//               className="filter-form d-flex flex-wrap align-items-center justify-content-center"
//               onSubmit={handleSubmit}
//             >
//               {/* Gender Filter */}
//               <div className="filter-item col-md-2 col-12">
//                 <label htmlFor="gender">Gender</label>
//                 <select
//                   id="gender"
//                   name="gender"
//                   value={filters.gender}
//                   onChange={handleInputChange}
//                   className="form-control"
//                 >
//                   <option value="">Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                 </select>
//               </div>

//               {/* City Filter */}
//               <div className="filter-item col-md-3 col-12">
//                 <label htmlFor="city">City</label>
//                 <select
//                   id="city"
//                   name="city"
//                   value={filters.city}
//                   onChange={handleInputChange}
//                   className="form-control"
//                 >
//                   <option value="">Select City</option>
//                   {cities.map((cit, index) => (
//                     <option key={index} value={cit.city}>
//                       {cit.city}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Age Range Slider */}
//               <div className="filter-item col-md-3 col-12">
//                 <label htmlFor="age">Age Range: {filters.age}</label>
//                 <input
//                   type="range"
//                   id="age"
//                   name="age"
//                   min="18"
//                   max="60"
//                   value={filters.age}
//                   onChange={handleInputChange}
//                   className="form-range"
//                 />
//               </div>

//               {/* Wedding Budget Range Slider */}
//               {/* <div className="filter-item col-md-3 col-12">
//                 <label htmlFor="budget">
//                   Wedding Budget Range: ₹{filters.budget}
//                 </label>
//                 <input
//                   type="range"
//                   id="budget"
//                   name="budget"
//                   min="20000"
//                   max="1000000"
//                   step="10000"
//                   value={filters.budget}
//                   onChange={handleInputChange}
//                   className="form-range"
//                 />
//               </div> */}

//               <div className="filter-item col-md-2 col-12">
//                 <label htmlFor="budget">Wedding Budget</label>
//                 <select
//                   id="budget"
//                   name="budget"
//                   value={filters.budget}
//                   onChange={handleInputChange}
//                   className="form-control"
//                 >
//                   <option value=""> Select Budget</option>
//                   <option value={200000}>50K - 2 Lakh</option>
//                   <option value={500000}>2L - 5Lakh</option>
//                   <option value={1000000}>5L - 10Lakh</option>
//                   <option value={2000000}>10L - 20Lakh</option>
//                   <option value={4000000}>20L - 40Lakh</option>
//                   <option value={7000000}>40L - 70Lakh</option>
//                   <option value={10000000}>70L - 1 Crore+</option>
//                 </select>
//               </div>

//               <div className="filter-item col-md-2 col-12">
//                 <label htmlFor="gender">Find By User Id : </label>
//                 <input type="text" name="unqId" onChange={handleInputChange} placeholder="Search By Id " className="form-control" />
//               </div>

//               {/* Submit Button */}
//               <div className="col-md-1 col-12 text-center mt-md-0 mt-3">
//                 <button
//                   type="submit"
//                   className="btn-btn filter-submit mt-4"
//                   onClick={handlefilterSubmit}
//                 >
//                   Search
//                 </button>
//               </div>
//             </form>
//           </div>

//           <div className="row">
//             {/* {localStorage.getItem("user") ? (
//               <div className="profile-container">
//                 {prf.map((profile) => (
//                   <div
//                     className="profile-card col-md-3 col-sm-4 mb-4"
//                     key={profile._id}
//                   >
//                     <div
//                       className="profile-image"
//                     // style={{
//                     //   backgroundImage: `url(${profilebg})`,
//                     // }}
//                     >
//                       <img
//                         src={profile.image}
//                         alt={profile.fullName}
//                         onClick={() => {
//                           sessionStorage.setItem("profileScroll", window.scrollY); // ⭐ Save scroll position
//                           navigate(`/InnerProfile/${profile._id}`);
//                         }}

//                         className="profile-pic"
//                       />
//                     </div>
//                     <div className="profile-details">
//                       <div className="details-row">
//                         <p>
//                           <strong>User ID: </strong>
//                           {`MMR00${profile?.unqId}`}
//                         </p>
//                       </div>
//                       <div className="details-row">
//                         <p>
//                           <strong>Name: </strong> {profile.fullName}
//                         </p>
//                       </div>
//                       <div className="details-row">
//                         <p>
//                           <strong>Place: </strong> {profile.state}
//                         </p>
//                         <p>
//                           <strong>Age: </strong> {profile.age}
//                         </p>
//                       </div>
//                       <div className="details-row">
//                         <p>
//                           <strong>Work: </strong> {profile.working}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : ( */}
//             <div className="profile-container">
//               {allprf.map((profile) => (
//                 <div
//                   id={`profile-${profile._id}`} // unique for each profile
//                   className="profile-card col-md-3 col-sm-4 mb-4"
//                   key={profile._id}
//                 >
//                   <div
//                     className="profile-image"
//                   // style={{
//                   //   backgroundImage: `url(${profilebg})`,
//                   // }}
//                   >
//                     <img
//                       src={profile.image}
//                       alt={profile.fullName}
//                       onClick={() => {
//                         sessionStorage.setItem("scrollToProfile", profile._id); // save clicked profile ID
//                         navigate(localStorage.getItem("user") ? `/InnerProfile/${profile._id}` : `/login`);
//                       }}
//                       className="profile-pic"
//                     />

//                   </div>
//                   <div className="profile-details">
//                     <div className="details-row">
//                       <p>
//                         <strong>User ID: </strong>
//                         {`MMR00${profile.unqId}`}
//                       </p>
//                     </div>
//                     <div className="details-row">
//                       <p>
//                         <strong>Name: </strong> {profile.fullName}
//                       </p>
//                     </div>
//                     <div className="details-row">
//                       <p>
//                         <strong>Place: </strong> {profile.state}
//                       </p>
//                       <p>
//                         <strong>Age: </strong> {profile.age}
//                       </p>
//                     </div>
//                     <div className="details-row">
//                       <p>
//                         <strong>Work: </strong> {profile.working}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {/* )} */}
//           </div>

//           <Modal
//             isOpen={isModalOpen}
//             onRequestClose={() => setModalOpen(false)}
//             style={{
//               content: {
//                 top: "50%",
//                 left: "50%",
//                 right: "auto",
//                 bottom: "auto",
//                 marginRight: "-50%",
//                 transform: "translate(-50%, -50%)",
//                 textAlign: "center",
//                 borderRadius: "10px",
//                 padding: "20px",
//               },
//               overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
//             }}
//           >
//             <h2>Login Request</h2>
//             <p>Please log in to view more details. </p>
//             <Link to="/login">
//               <button
//                 style={{
//                   marginRight: "10px",
//                   padding: "8px 16px",
//                   background: "#800020",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "5px",
//                 }}
//               >
//                 Login
//               </button>
//             </Link>
//             <button
//               style={{
//                 padding: "8px 16px",
//                 background: "#dc3545",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "5px",
//               }}
//               onClick={() => setModalOpen(false)}
//             >
//               Close
//             </button>
//           </Modal>
//         </div>
//       </section>
//     </>
//   );
// };

// export default ProfilePage;





import React, { useEffect, useState } from "react";
import "./ProfilePage.css";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import profilebg from "../../Assets/ProfileBg.jpeg";
import Modal from "react-modal";
import { axiosInstance } from "../Login/Loginpage";

Modal.setAppElement("#root");

const ProfilePage = () => {
  const navigate = useNavigate();
  const [prf, SetPrf] = useState([]);
  const [allprf, setAllPrf] = useState([]);
  const [cities, SetCities] = useState([]);

  // ❌ Old scrollY based restore – not needed now
  // useEffect(() => {
  //   const savedScroll = sessionStorage.getItem("profileScroll");
  //   if (savedScroll) {
  //     window.scrollTo(0, parseInt(savedScroll));
  //     sessionStorage.removeItem("profileScroll"); // clear after restoring
  //   }
  // }, []);

  const getDETAILS = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/profiles/opposite/users"
      );
      console.log("adta is==>", response.data);
      setAllPrf(response.data.opp);
    } catch (error) {
      console.log(error);
    }
  };

  const getALLDETAILS = async () => {
    try {
      const response = await axiosInstance.get("/api/v1/adminPanel/allUsers");
      console.log("adta is==>", response.data);
      setAllPrf(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // City filters with unique + cleaned city names
  const cityFilters = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/profiles/city/for/option`
      );

      const uniqueCities = [
        ...new Set(
          response.data.city.map((item) => item.city.trim().toLowerCase())
        ),
      ].map((c) => ({
        city: c.charAt(0).toUpperCase() + c.slice(1), // Capitalize
      }));

      console.log("Clean Cities:", uniqueCities);
      SetCities(uniqueCities);
    } catch (error) {
      console.log(error);
    }
  };

  // 👉 Load profiles + cities
  useEffect(() => {
    const userStatus = localStorage.getItem("user");
    if (userStatus) {
      getDETAILS();
      cityFilters();
    } else {
      getALLDETAILS();
    }
  }, []);

  const [isModalOpen, setModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    gender: "",
    age: 25,
    city: "",
    budget: 100000,
    unqId: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Filters applied successfully!");
  };

  const handlefilterSubmit = async () => {
    try {
      if (localStorage.getItem("user")) {
        const response = await axiosInstance.post(
          "/api/v1/profiles/profiles/filter",
          filters,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setAllPrf(response?.data?.data);
      } else {
        const filterData = allprf.filter((user) =>
          (!filters.gender || user.gender === filters.gender) &&
          (!filters.city || user.city === filters.city) &&
          (!filters.age || user.age >= filters.age) &&
          (!filters.budget || user.weddingBudget >= filters.budget)
        );
        setAllPrf(filterData);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  // ⭐ Scroll restore using profile ID (more reliable than scrollY)
  useEffect(() => {
    const profileId = sessionStorage.getItem("scrollToProfileId");

    // Only try to scroll if:
    // 1) We have a saved profileId
    // 2) The profiles list is loaded
    if (profileId && allprf.length > 0) {
      const el = document.getElementById(`profile-${profileId}`);

      if (el) {
        // 'behavior: "auto"' is safe across browsers
        el.scrollIntoView({ block: "start", behavior: "auto" });

        // If you have a fixed navbar, you can adjust:
        // const offset = 80; // navbar height
        // window.scrollBy(0, -offset);
      }

      // Clear so it doesn’t affect next visits
      sessionStorage.removeItem("scrollToProfileId");
    }
  }, [allprf]);



  useEffect(() => {
    const profileId = sessionStorage.getItem("scrollToProfileId");
  
    if (profileId && allprf.length > 0) {
      const el = document.getElementById(`profile-${profileId}`);
      if (el) {
        el.scrollIntoView({ block: "start", behavior: "auto" });
      }
      sessionStorage.removeItem("scrollToProfileId");
    }
  }, [allprf]);
  

  return (
    <>
      {/* <Helmet>
        <title>Our Top Profiles</title>
        <meta
          name="description"
          content="Explore the top profiles on our platform"
        />
      </Helmet>

      <section>
        <div className="page-header">
          <h2>Every Journey Starts With a Connection</h2>
          <div className="page-render">
            <Link to="/">Home &nbsp; </Link>
            <p>&gt; Profile</p>
          </div>
        </div>
      </section> */}

      <section className="Profile-section">
        <div className="container">
          <div className="Heading">
            <h2>Explore Our Top Profiles</h2>
          </div>

          <div className="row filter-bar">
            <h2 className="col-12 text-center">Find Your Perfect Match</h2>
            <form
              className="filter-form d-flex flex-wrap align-items-center justify-content-center"
              onSubmit={handleSubmit}
            >
              {/* Gender Filter */}
              <div className="filter-item col-md-2 col-12">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={filters.gender}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              {/* City Filter */}
              <div className="filter-item col-md-3 col-12">
                <label htmlFor="city">City</label>
                <select
                  id="city"
                  name="city"
                  value={filters.city}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value="">Select City</option>
                  {cities.map((cit, index) => (
                    <option key={index} value={cit.city}>
                      {cit.city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age Range Slider */}
              <div className="filter-item col-md-3 col-12">
                <label htmlFor="age">Age Range: {filters.age}</label>
                <input
                  type="range"
                  id="age"
                  name="age"
                  min="18"
                  max="60"
                  value={filters.age}
                  onChange={handleInputChange}
                  className="form-range"
                />
              </div>

              {/* Wedding Budget Dropdown */}
              <div className="filter-item col-md-2 col-12">
                <label htmlFor="budget">Wedding Budget</label>
                <select
                  id="budget"
                  name="budget"
                  value={filters.budget}
                  onChange={handleInputChange}
                  className="form-control"
                >
                  <option value=""> Select Budget</option>
                  <option value={200000}>50K - 2 Lakh</option>
                  <option value={500000}>2L - 5Lakh</option>
                  <option value={1000000}>5L - 10Lakh</option>
                  <option value={2000000}>10L - 20Lakh</option>
                  <option value={4000000}>20L - 40Lakh</option>
                  <option value={7000000}>40L - 70Lakh</option>
                  <option value={10000000}>70L - 1 Crore+</option>
                </select>
              </div>

              {/* Search by User ID */}
              <div className="filter-item col-md-2 col-12">
                <label htmlFor="gender">Find By User Id : </label>
                <input
                  type="text"
                  name="unqId"
                  onChange={handleInputChange}
                  placeholder="Search By Id "
                  className="form-control"
                />
              </div>

              {/* Submit Button */}
              <div className="col-md-1 col-12 text-center mt-md-0 mt-3">
                <button
                  type="submit"
                  className="btn-btn filter-submit mt-4"
                  onClick={handlefilterSubmit}
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          <div className="row">
            <div className="profile-container">
              {allprf.map((profile) => (
                <div
                  id={`profile-${profile._id}`} // unique for each profile
                  className="profile-card col-md-3 col-sm-4 mb-4"
                  key={profile._id}
                >
                  <div className="profile-image">
                    <img
                      src={profile.image}
                      alt={profile.fullName}
                      onClick={() => {
                        // ⭐ Save which profile was clicked
                        sessionStorage.setItem(
                          "scrollToProfileId",
                          profile._id
                        );

                        navigate(
                          localStorage.getItem("user")
                            ? `/InnerProfile/${profile._id}`
                            : `/login`
                        );
                      }}
                      className="profile-pic"
                    />
                  </div>
                  <div className="profile-details">
                    <div className="details-row">
                      <p>
                        <strong>User ID: </strong>
                        {`MMR00${profile.unqId}`}
                      </p>
                    </div>
                    <div className="details-row">
                      <p>
                        <strong>Name: </strong> {profile.fullName}
                      </p>
                    </div>
                    <div className="details-row">
                      <p>
                        <strong>Place: </strong> {profile.state}
                      </p>
                      <p>
                        <strong>Age: </strong> {profile.age}
                      </p>
                    </div>
                    <div className="details-row">
                      <p>
                        <strong>Work: </strong> {profile.working}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setModalOpen(false)}
            style={{
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                borderRadius: "10px",
                padding: "20px",
              },
              overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
            }}
          >
            <h2>Login Request</h2>
            <p>Please log in to view more details. </p>
            <Link to="/login">
              <button
                style={{
                  marginRight: "10px",
                  padding: "8px 16px",
                  background: "#800020",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                Login
              </button>
            </Link>
            <button
              style={{
                padding: "8px 16px",
                background: "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
              }}
              onClick={() => setModalOpen(false)}
            >
              Close
            </button>
          </Modal>
        </div>
      </section>
    </>
  );
};

export default ProfilePage;
