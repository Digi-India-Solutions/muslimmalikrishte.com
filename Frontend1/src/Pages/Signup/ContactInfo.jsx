import React, { useState, useEffect } from "react";
import "./SignupPage.css";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import Swal from "sweetalert2";
import axios from "axios";
import { Country, State, City } from 'country-state-city';

Modal.setAppElement("#root"); // Required for accessibility

const ContactInfo = ({ formData, handleChange, goToTab, setFormData }) => {
  const [isFormValid, setIsFormValid] = useState(false);
  const [shw, SetShw] = useState(0);
  const [countryList, setCountryList] = useState([]);
  const [stateList, setStateList] = useState([]);
  const [cityList, setCityList] = useState([]);

  const [countryCode, setCountryCode] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [cityName, setCityName] = useState("");

  // Autocomplete states
  const [countrySearchInput, setCountrySearchInput] = useState("");
  const [stateSearchInput, setStateSearchInput] = useState("");
  const [citySearchInput, setCitySearchInput] = useState("");

  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  // Filtered lists
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [filteredStates, setFilteredStates] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);


  useEffect(() => {
    // window.scrollTo({
    //   top: 0,
    //   behavior: "smooth",
    // });

    const requiredFields = [
      "phone",
      "email",
      "area",
      "state",
      "city",
      "pin",
      "country",
      "weddingStyle",
      "weddingBudget",
      "acceptTerms",
    ];

    const isValid = requiredFields.every(
      (field) => formData[field]?.trim() !== ""
    ) &&
      formData.acceptTerms === true;
    setIsFormValid(isValid);
  }, [formData]);

  // ----------- Email verify ----------

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleEmailChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if a digit is entered
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !otp[index]) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleVerifyEmail = async (email, otp1) => {
    try {
      const otp = otp1.join('');
      console.log(email, otp);
      const response = await axios.post('https://api.muslimmalikrishte.com/api/v1/auth/verifyEmailOTP', { email, otp });

      if (response.data.message === 'OTP verified successfully') {
        Swal.fire({
          title: "OTP Verified Successfully!",
          text: "Your email has been verified.",
          icon: "success",
          confirmButtonText: "OK",
        });
        SetShw(1);
        setIsModalOpen(false);
        setIsFormValid(true);
      } else {
        Swal.fire({
          title: "OTP Verification Failed!",
          text: "Please enter the correct OTP.",
          icon: "error",
          confirmButtonText: "Retry",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data || error.message);
      Swal.fire({
        title: "Verification Error!",
        text: error.response?.data?.error || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };


  const sendMail = async (email) => {
    try {
      console.log("Sending email to:", email);

      const response = await axios.post('https://api.muslimmalikrishte.com/api/v1/auth/verifyEmail', { email });
      console.log("Email verification response:=", response.data);
      setIsModalOpen(true);
      // alert("Email verification response:", response.data);
    } catch (error) {
      console.error("Error sending email:", error.response?.data || error.message);
    }
  };

  const handleCountryInputChange = (e) => {
    const value = e.target.value;
    setCountrySearchInput(value);
    
    if (value.trim() === "") {
      setFilteredCountries(countryList);
    } else {
      const filtered = countryList.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
    setCountryOpen(true);
  };

  const handleSelectCountry = (country) => {
    setCountrySearchInput(country.name);
    const states = State.getStatesOfCountry(country.isoCode);
    
    setFormData(prev => ({
      ...prev,
      country: country.name,
      state: "",
      city: "",
    }));
    
    setStateList(states);
    setFilteredStates(states);
    setCityList([]);
    setCountryOpen(false);
    setStateSearchInput("");
    setCitySearchInput("");
  };

  const handleStateInputChange = (e) => {
    const value = e.target.value;
    setStateSearchInput(value);
    
    if (value.trim() === "") {
      setFilteredStates(stateList);
    } else {
      const filtered = stateList.filter((s) =>
        s.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStates(filtered);
    }
    setStateOpen(true);
  };

  const handleSelectState = (state) => {
    setStateSearchInput(state.name);
    const countryISOs = countryList.find((c) => c.name === formData.country)?.isoCode;
    const cities = City.getCitiesOfState(countryISOs, state.isoCode);
    
    setFormData(prev => ({
      ...prev,
      state: state.name,
      city: "",
    }));

    setCityList(cities);
    setFilteredCities(cities);
    setStateOpen(false);
    setCitySearchInput("");
  };

  const handleCityInputChange = (e) => {
    const value = e.target.value;
    setCitySearchInput(value);
    
    if (value.trim() === "") {
      setFilteredCities(cityList);
    } else {
      const filtered = cityList.filter((c) =>
        c.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
    }
    setCityOpen(true);
  };

  const handleSelectCity = (city) => {
    setCitySearchInput(city.name);
    setFormData(prev => ({
      ...prev,
      city: city.name,
    }));
    setCityOpen(false);
  };


  console.log("HHHHHHH:==>", formData)
  useEffect(() => {
    const countries = Country.getAllCountries();
    setCountryList(countries);
    setFilteredCountries(countries);
  }, []);

  const handleVeriify = () => {
    if (!formData.weddingBudget) {
      alert("Please select wedding budget");
      return;
    }
    if (!formData.weddingStyle) {
      alert("Please select wedding style");
      return;
    }
    if (!formData.phone) {
      alert("Please enter phone number");
      return;
    }
    if (!formData.email) {
      alert("Please enter email");
      return;
    }
    if (!formData.country) {
      alert("Please select country");
      return;
    }
    if (!formData.state) {
      alert("Please select state");
      return;
    }
    if (!formData.city) {
      alert("Please select city");
      return;
    }
    sendMail(formData.email);
    openModal();

  }
  return (
    <>
      <div>
        <h3>Other Details</h3>
        <form>
          <div className="row">
            <div className="col-md-4 col-6">
              <div className="form-field">
                <label htmlFor="phone" className="label-main">
                  Phone <sup>*</sup>
                </label>
                <input
                  type="number"
                  id="phone"
                  min={1}
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="col-md-4 col-6">
              <div className="form-field">
                <label htmlFor="email" className="label-main">
                  Email <sup>*</sup>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-4 col-6">
              <div className="form-field">
                <label htmlFor="area" className="label-main">
                  Area <sup>*</sup>
                </label>
                <input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-4 col-6">
              <div className="form-field position-relative">
                <label htmlFor="country" className="label-main">
                  Country <sup>*</sup>
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={countrySearchInput}
                  onChange={handleCountryInputChange}
                  onFocus={() => setCountryOpen(true)}
                  placeholder="Search country..."
                  className="form-control"
                  autoComplete="off"
                />
                {countryOpen && filteredCountries.length > 0 && (
                  <div className="autocomplete-dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    border: '1px solid #ccc',
                    borderTop: 'none',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}>
                    {filteredCountries.map((country) => (
                      <div
                        key={country.isoCode}
                        onClick={() => handleSelectCountry(country)}
                        style={{
                          padding: '10px 12px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#666'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {country.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-4 col-6">
              <div className="form-field position-relative">
                <label htmlFor="state" className="label-main">
                  State <sup>*</sup>
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={stateSearchInput}
                  onChange={handleStateInputChange}
                  onFocus={() => formData.country && setStateOpen(true)}
                  placeholder="Search state..."
                  className="form-control"
                  disabled={!formData.country}
                  autoComplete="off"
                />
                {stateOpen && filteredStates.length > 0 && (
                  <div className="autocomplete-dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    border: '1px solid #ccc',
                    borderTop: 'none',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}>
                    {filteredStates.map((state) => (
                      <div
                        key={state.isoCode}
                        onClick={() => handleSelectState(state)}
                        style={{
                          padding: '10px 12px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#666'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {state.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-4 col-6">
              <div className="form-field position-relative">
                <label htmlFor="city" className="label-main">
                  City <sup>*</sup>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={citySearchInput}
                  onChange={handleCityInputChange}
                  onFocus={() => formData.state && setCityOpen(true)}
                  placeholder="Search city..."
                  className="form-control"
                  disabled={!formData.state}
                  autoComplete="off"
                />
                {cityOpen && filteredCities.length > 0 && (
                  <div className="autocomplete-dropdown" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    border: '1px solid #ccc',
                    borderTop: 'none',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}>
                    {filteredCities.map((city) => (
                      <div
                        key={city.name}
                        onClick={() => handleSelectCity(city)}
                        style={{
                          padding: '10px 12px',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#666'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      >
                        {city.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>



            <div className="col-md-4 col-6">
              <div className="form-field">
                <label htmlFor="pin" className="label-main">
                  Pin Code <sup>*</sup>
                </label>
                <input
                  type="number"
                  id="pin"
                  name="pin"
                  min={1}
                  value={formData.pin}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="row">

            <div className="col-md-4 col-6">
              <div className="form-field gender-style">
                <label htmlFor="weddingBudget" className="label-main">
                  Wedding Budget
                </label>

                <select
                  id="weddingBudget"
                  name="weddingBudget"
                  className="select-style"
                  value={formData.weddingBudget}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Budget</option>
                  <option value={200000}>50K - 2 Lakh</option>
                  <option value={500000}>2 Lakh - 5 Lakh</option>
                  <option value={1000000}>5 Lakh - 10 Lakh</option>
                  <option value={2000000}>10 Lakh - 20 Lakh</option>
                  <option value={4000000}>20 Lakh - 40 Lakh</option>
                  <option value={7000000}>40 Lakh - 70 Lakh</option>
                  <option value={10000000}>70 Lakh - 1 Crore +</option>
                </select>
              </div>
            </div>

            <div className="col-md-4 col-6">
              <div className="form-field gender-style">
                <label htmlFor="weddingStyle" className="label-main">
                  Wedding Style <sup>*</sup>
                </label>
                <select
                  id="weddingStyle"
                  name="weddingStyle"
                  className="select-style"
                  value={formData.weddingStyle}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Style
                  </option>
                  <option value="Sunnati(Max 15 People)">
                    Sunnati (Max 15 People)
                  </option>
                  <option value="Traditional">Traditional</option>
                  <option value="Expensive">Expensive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="container my-2">
            <input
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
              required
            />
            I have read and agree to the{" "}
            <Link to="/termCondition" className="text-decoration-none text-light" rel="noopener noreferrer">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacyPolicy" className="text-decoration-none text-light" rel="noopener noreferrer">
              Privacy Policy
            </Link>
          </div>
          <button
            type="button"
            className="next-btn login-page-btn bg-secondary mx-1"
            onClick={() => goToTab(1)}
          >
            Back
          </button>
          {shw ?
            <button
              type="button"
              className="next-btn login-page-btn"
              onClick={() => goToTab(3)}
              disabled={!isFormValid}
              title={!isFormValid ? "Please fill all mandatory fields." : ""} // ✅ Shows message when disabled
            >
              Next
            </button>
            :
            <button
              type="button"
              className="btn bg-info mx-2"
              onClick={() => {
                handleVeriify()

              }}
            >
              Verify Email
            </button>
          }
        </form>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          className="otp-modal-content OtpModal"
          overlayClassName="modal-overlay bg-transparent  "
        >
          <div className="modal-header d-flex justify-content-between ">
            <h5 className="modal-title ">OTP has been sent to your Email</h5>
            <button className="btn-close bg-light p-2 " onClick={closeModal}></button>
          </div>

          <div className="modal-body text-center">
            <p>Please enter the OTP</p>
            {/* <div className="d-flex justify-content-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  pattern="[0-9]*"
                  className="otp-input text-center"
                  value={digit}
                  onChange={(e) => handleEmailChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div> */}

            <div className="d-flex justify-content-center">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  // autoComplete={index === 0 ? "one-time-code" : "off"}
                  maxLength="1"
                  className="otp-input text-center"
                  value={digit}
                  onChange={(e) => handleEmailChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <button
              type="button"
              className="verfity-btn"
              onClick={() => handleVerifyEmail(formData.email, otp)} // Pass true for success, false for error
            >
              Verify Email
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default ContactInfo;
