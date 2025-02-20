import React from "react";
import { useState, useEffect } from "react";
import testimonail from "../../Assets/Testimonail.png";
import "./ConnectionReq.css";
import { Link } from "react-router-dom";
import { axiosInstance } from "../Login/Loginpage.jsx";

const MyConnection = () => {
  const [myConnection, SetMyConnection] = useState([]);

  const myConnectionDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/v1/connectionRequest/connection/myconn`
      );
      SetMyConnection(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    myConnectionDetails();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 my-2">
            <div className="connecReq-maindiv">
              <h4 className="text-center my-3">My Connections</h4>
              <div className="request-list">
                {myConnection.length === 0 ? (
                  <p className="no-data-message">No Connection Available</p>
                ) : (
                  myConnection.map((user) => (
                    <div key={user._id} className="request-data">
                      <div className="req-image">
                        <img src={user.image} alt="User" />
                      </div>
                      <div className="req-user-data row">
                        <div className="col-md-3 col-6">
                          <strong>Gender:</strong> <p>{user.gender}</p>
                        </div>
                        <div className="col-md-3 col-6">
                          <strong>Age:</strong> <p>{user.age}</p>
                        </div>
                        <div className="col-md-3 col-6">
                          <strong>City:</strong> <p>{user.city}</p>
                        </div>
                        <div className="col-md-3 col-6">
                          <strong>Work:</strong> <p>{user.working}</p>
                        </div>
                      </div>
                      <Link to={`/InnerProfile/${user._id}`}>
                        <button className="view-profile">View Profile</button>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyConnection;
