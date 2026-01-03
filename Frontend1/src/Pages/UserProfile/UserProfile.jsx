import React, { useState, useRef, useEffect } from "react";
import ReactModal from "react-modal";
import "./userprofile.css";
import { Link, useNavigate } from "react-router-dom";
import AvatarEditor from "react-avatar-editor";
import { Helmet } from "react-helmet";
import axios from "axios";
import { axiosInstance } from "../Login/Loginpage";
import Swal from "sweetalert2";
import { City, Country, State } from 'country-state-city';

ReactModal.setAppElement("#root");

// Helper function to format budget value
const getBudgetLabel = (value) => {
  const budgetMap = {
    200000: "50K - 2 Lakh",
    500000: "2 Lakh - 5 Lakh",
    1000000: "5 Lakh - 10 Lakh",
    2000000: "10 Lakh - 20 Lakh",
    4000000: "20 Lakh - 40 Lakh",
    7000000: "40 Lakh - 70 Lakh",
    10000000: "70 Lakh - 1 Crore +"
  };
  return budgetMap[value] || value;
};

const UserProfile = () => {
  const [countryList, setCountryList] = useState([])
  const [stateList, setStateList] = useState([])
  const [cityList, setCityList] = useState([])
  const [disData, SetDisdata] = useState({
    _id: "",
    fullName: "",
    age: "",
    gender: "",
    fatherName: "",
    motherName: "",
    height: "",
    dob: "",
    MarriedStatus: "",
    FamilyHead: "",
    FamilyHeadOccupation: "",
    siblings: "",
    Sistersiblings: "",
    pehchan: "",
    education: "",
    working: "",
    annualIncome: "",
    house: "",
    phone: "",
    email: "",
    image: "",
    area: "",
    country: "",
    state: "",
    city: "",
    state: "",
    pin: "",
    country: "",
    weddingBudget: "",
    weddingStyle: "",
    role: "",
    blockByADMIN: "",
    Verified: "",
    connections: [],
  });

  const displayUserDetail = async () => {
    const response = await axiosInstance.get("/api/v1/myprofile/viewProfile");
    SetDisdata(response.data.message);
  };

  useEffect(() => {
    if (disData.fullName) {
      setFormData({
        fullName: disData.fullName,
        fatherName: disData.fatherName,
        motherName: disData.motherName,
        dob: disData.dob,
        phone: disData.phone,
        email: disData.email,
        gender: disData.gender,
        age: disData.age,
        height: disData.height,
        MarriedStatus: disData.maritalstatus,
        belong: disData.pehchan,
        sibling: disData.siblings,
        education: disData.education,
        working: disData.working,
        income: disData.annualIncome,
        address: disData.area,
        country: disData.country,
        state: disData.state,
        city: disData.city,
        pin: disData.pin,
        weddingBudget: disData.weddingBudget,
        weddingStyle: disData.weddingStyle,
        familyHead: disData.FamilyHead,
      });
      console.log("CCCCCC::=>", disData?.state, disData?.country)
    }

  }, [disData]);
  console.log("CCCCCC::=>", cityList)
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    displayUserDetail();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Loading...",
    fatherName: "Loading...",
    motherName: "Loading...",
    dob: "Loading...",
    phone: "Loading...",
    email: "Loading...",
    gender: "Loading...",
    age: "Loading...",
    height: "Loading...",
    MarriedStatus: "Loading...",
    belong: "Loading...",
    sibling: "Loading...",
    education: "Loading...",
    working: "Loading...",
    income: "Loading...",
    address: "Loading...",
    country: 'Loading...',
    state: "Loading...",
    city: "Loading...",
    pin: "Loading...",
    weddingBudget: "Loading...",
    weddingStyle: "Loading...",

    familyHead: "Loading...",
  });

  const [showAvatarEditor, setShowAvatarEditor] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const editorRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'country') {
      setFormData({ ...formData, [name]: value, state: '', city: '' });
    } else if (name === 'state') {
      setFormData({ ...formData, [name]: value, city: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }

  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setShowAvatarEditor(true);
    }
  };

  const handleSaveImage = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const handleInputChange = canvas.toDataURL();
      setImageFile(handleInputChange);
      setShowAvatarEditor(false);
    }
  };
  console.log("FORMDATA:==>", formData)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (formData.MarriedStatus) {
        formDataToSend.append("maritalstatus", formData.MarriedStatus)
      }
      if (formData.belong) {
        formDataToSend.append("pehchan", formData.belong)
      }
      if (formData.sibling) {
        formDataToSend.append("siblings", formData.sibling)
      }
      if (formData.income) {
        formDataToSend.append("annualIncome", formData.income)
      }
      if (formData.familyHead) {
        formDataToSend.append("FamilyHead", formData.familyHead)
      }
      if (formData.address) {
        formDataToSend.append("area", formData.address)
      }

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      console.log("Sending formData:=>", formDataToSend);

      const response = await axiosInstance.patch(
        "/api/v1/myprofile/viewProfile",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Correct content type for FormData
          },
        }
      );

      console.log("API Response:", response.data);

      // Ensure we update state correctly with the new user data
      SetDisdata(response.data);

      alert("Profile updated successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error);
      alert("There was an error updating the profile. Please try again.");
    }

    setShowModal(false);
  };

  // ------------- Logout function --------------

  const navigate = useNavigate(); // Initialize navigation

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://api.muslimmalikrishte.com/api/v1/auth/logout",
        {},
        { withCredentials: true }
      );

      if (response.data.message === "Logged out successfully") {
        document.cookie =
          "cookieName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        localStorage.removeItem("user");

        window.dispatchEvent(new Event("userStatusChanged"));

        navigate("/");

        Swal.fire({
          icon: "success",
          title: "Logout Successful!",
          text: "You have been logged out.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Logout Failed!",
          text: "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Logout request failed.",
      });
    }
  };

  useEffect(() => {
    const countries = Country.getAllCountries();
    setCountryList(countries);

    // 3️⃣ Resolve country ISO
    let countryISO = formData.country;
    if (countryISO && countryISO.length > 2) {
      countryISO = countries.find(c => c.name === countryISO)?.isoCode;
    }

    // 4️⃣ Load states
    let states = [];
    let stateISO = formData.state;

    if (countryISO) {
      states = State.getStatesOfCountry(countryISO);
      setStateList(states);

      if (stateISO && stateISO.length > 2) {
        stateISO = states.find(s => s.name === stateISO)?.isoCode;
      }
    } else {
      setStateList([]);
    }

    // 5️⃣ Load cities
    if (countryISO && stateISO) {
      const cities = City.getCitiesOfState(countryISO, stateISO);
      setCityList(cities);
    } else {
      setCityList([]);
    }
  }, [formData])

  return (
    <>
      <Helmet>
        <title>User Profile - {formData.fullName}</title>
        <meta
          name="description"
          content="User profile page with editable details and profile image."
        />
        <meta
          name="keywords"
          content="User Profile, React, Editable Profile, Avatar Editor"
        />
        <meta name="author" content="Your Name or Organization" />
      </Helmet>

      <section>
        <div className="container">
          <div className="main-body">
            <div className="row gutters-sm">
              {/* Profile Section */}
              <div className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex flex-column align-items-center text-center">
                      <img
                        src={disData.image || "https://via.placeholder.com/150"}
                        alt="Admin"
                        className="rounded-circle profile-user-image"
                        width={200}
                      />
                      <div className="profile-data mt-3">
                        <h4>{disData.fullName}</h4>
                        <p className="text-secondary mb-1">{disData.working}</p>
                        <p className="text-muted font-size-sm">
                          {disData.city}
                        </p>

                        <button
                          className="btn userprofile-logout"
                          onClick={handleLogout}
                        >
                          Log Out
                        </button>

                        <button
                          className="btn userprofile-creataccount text-white mt-2"
                          onClick={() => {
                            setShowModal(true);
                          }}
                        >
                          Edit Profile
                        </button>

                        <Link to="/connectionReq">
                          <button className="btn userprofile-logout mt-2">
                            Connection Request
                          </button>
                        </Link>
                        <div>
                          <Link to="/myConnection">
                            <button className="btn userprofile-creataccount mt-2">
                              My Connections
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Profile Details */}
                <div className="card mt-3">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 className="mb-0">
                        <i className="bi bi-arrow-bar-right"></i>
                        Father name
                      </h6>
                      <span className="text-secondary">
                        {disData.fatherName}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 className="mb-0">
                        <i className="bi bi-arrow-bar-right"></i>
                        Mother name
                      </h6>
                      <span className="text-secondary">
                        {disData.motherName}
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 className="mb-0">
                        <i className="bi bi-arrow-bar-right"></i>
                        Date of birth
                      </h6>
                      <span className="text-secondary">{disData.dob}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 className="mb-0">
                        <i className="bi bi-arrow-bar-right"></i>
                        Phone
                      </h6>
                      <span className="text-secondary">{disData.phone}</span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center flex-wrap">
                      <h6 className="mb-0">
                        <i className="bi bi-arrow-bar-right"></i>
                        Email
                      </h6>
                      <span className="text-secondary">{disData.email}</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Avatar Editor Modal */}
              {showAvatarEditor && (
                <ReactModal
                  isOpen={showAvatarEditor}
                  onRequestClose={() => setShowAvatarEditor(false)}
                  className="modal-container-avtar"
                  overlayClassName="modal-overlay-avtar"
                  style={{ background: 'red', }}
                >
                  <h2 className="text-white mt-2" >Edit Profile Image</h2>
                  <AvatarEditor
                    ref={editorRef}
                    image={imageFile}
                    width={200}
                    height={200}
                    border={50}
                    borderRadius={100}
                    className="d-flex m-auto"
                    scale={1}
                    color={[255, 255, 255, 0.6]} // RGBA
                  />
                  <div className="d-flex justify-content-center mt-3">
                    <button
                      className="btn save-change"
                      onClick={handleSaveImage}
                    >
                      Save Image
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setImageFile(null);
                        setShowAvatarEditor(false);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </ReactModal>
              )}

              {/* Main Profile Data */}
              <div className="col-md-8">
                <div className="card mb-3">
                  <div className="card-body">
                    {/* Profile Details */}

                    {Object.entries(formData)
                      .filter(
                        ([key]) =>
                          !["name", "fatherName", "motherName", "dob", "phone", "email"].includes(
                            key
                          )
                      )
                      .map(([key, value]) => {
                        const labelMap = {
                          fullName: "Full Name",
                          fatherName: "Father Name",
                          motherName: "Mother Name",
                          dob: "Date of Birth",
                          phone: "Phone",
                          email: "Email",
                          gender: "Gender",
                          age: "Age",
                          height: "Height",
                          MarriedStatus: "Status",
                          belong: "Belong",
                          sibling: "Siblings",
                          education: "Education",
                          working: "Occupation",
                          income: "Annual Income",
                          address: "Address",
                          country: 'Country',
                          state: "State",
                          city: "City",
                          pin: "Pin Code",
                          weddingBudget: "Wedding Budget",
                          weddingStyle: "Wedding Style",
                          familyHead: "Family Head",
                        };

                        // Format the display value
                        let displayValue = value;
                        if (key === "weddingBudget") {
                          displayValue = getBudgetLabel(value);
                        }

                        return (
                          <div className="row" key={key}>
                            <div className="col-sm-3">
                              <h6 className="mb-0">{labelMap[key] || key}</h6>
                            </div>
                            <div className="col-sm-9 text-secondary">{displayValue}</div>
                            <hr />
                          </div>
                        );
                      })}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        <ReactModal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          className="modal-container "
          overlayClassName="modal-overlay"
        >
          <h2 className="text-white mt-2">Edit Profile</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="row modal-row">
              {Object.entries(formData).map(([key, value]) => {
                const labelMap = {
                  fullName: "Full Name",
                  fatherName: "Father Name",
                  motherName: "Mother Name",
                  dob: "Date of Birth",
                  phone: "Phone",
                  email: "Email",
                  gender: "Gender",
                  age: "Age",
                  height: "Height",
                  MarriedStatus: "Status",
                  belong: "Belong",
                  sibling: "Siblings",
                  education: "Education",
                  working: "Occupation",
                  income: "Annual Income",
                  address: "Address",
                  country: 'Country',
                  state: "State",
                  city: "City",
                  pin: "Pin Code",
                  weddingBudget: "Wedding Budget",
                  weddingStyle: "Wedding Style",
                  familyHead: "Family Head",
                };

                return (
                  <div className="col-md-4 mb-3" key={key}>
                    <div className="form-group">
                      <label htmlFor={key} className="pb-2">
                        {labelMap[key] || key.replace(/_/g, " ").toUpperCase()}
                      </label>
                      {key === "weddingBudget" ? (
                        <select
                          id={key}
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="">Select Wedding Budget</option>

                          <option value="">Select Budget</option>
                          <option value={200000}>50K - 2 Lakh</option>
                          <option value={500000}>2 Lakh - 5 Lakh</option>
                          <option value={1000000}>5 Lakh - 10 Lakh</option>
                          <option value={2000000}>10 Lakh - 20 Lakh</option>
                          <option value={4000000}>20 Lakh - 40 Lakh</option>
                          <option value={7000000}>40 Lakh - 70 Lakh</option>
                          <option value={10000000}>70 Lakh - 1 Crore +</option>
                        </select>
                      ) : key === "weddingStyle" ? (
                        <select
                          id={key}
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="">Select Wedding Style</option>

                          <option value="" disabled>Select Style</option>
                          <option value="Sunnati(Max 15 People)">Sunnati (Max 15 People)</option>
                          <option value="Traditional">Traditional</option>
                          <option value="Expensive">Expensive</option>
                        </select>
                      ) : key === "MarriedStatus" ? (
                        <select
                          id={key}
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="" disabled>
                            Marital Status
                          </option>
                          <option value="Unmarried">Never Married</option>
                          <option value="Divorced">Divorced</option>
                          <option value="Windowed">Widow</option>
                        </select>
                      ) : key === "country" ? (
                        <select
                          id={key}
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="">Select Country</option>
                          {countryList?.map((item, i) => <option value={item?.name}>{item?.name}</option>)}

                        </select>
                      ) : key === "state" ? (
                        <select
                          id={key}
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="">Select State</option>
                          {stateList?.map((item, i) => <option value={item?.name}>{item?.name}</option>)}

                        </select>
                      ) : key === "city" ? (
                        <select
                          id={key}
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          className="form-control"
                        >
                          <option value="">Select City</option>
                          {cityList?.map((item, i) => <option value={item?.name}>{item?.name}</option>)}

                        </select>
                      ) : (
                        <input
                          type="text"
                          id={key}
                          name={key}
                          value={value}
                          onChange={handleInputChange}
                          className="form-control"
                        />
                      )}


                    </div>
                  </div>
                )
              })}

              <div
                className="form-group"
                style={{
                  marginTop: "20px",
                  marginLeft: "20px",
                  marginBottom: "20px",
                  background: "white",
                  color: "black",
                  width: "50%",            // perfect for laptop view
                  borderRadius: "10px",
                  padding: "12px 16px",
                  border: "1px solid #ddd",
                }}
              >
                <label htmlFor="updatepic" style={{ fontWeight: "600" }}>
                  Update Picture
                </label>

                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                  style={{
                    display: "block",
                    marginTop: "8px",
                    width: "100%",
                    padding: "8px",
                    background: "#f8f9fa",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                />
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn save-change">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </ReactModal>
      </section>
    </>
  );
};

export default UserProfile;
