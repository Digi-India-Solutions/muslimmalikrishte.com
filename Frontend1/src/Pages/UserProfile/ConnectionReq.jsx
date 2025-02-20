import React, { useEffect, useState } from "react";
import "./ConnectionReq.css";
import { axiosInstance } from "../Login/Loginpage.jsx";

const ConnectionReq = () => {
  const [data, setData] = useState([]);

  const getALLRequestDetail = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/v1/connectionRequest/forme"
      );
      console.log(response.data.requests);
      setData(response.data.requests);
    } catch (error) {
      console.log(error);
    }
  };

  const acceptRequest = async (id) => {
    try {
      await axiosInstance.get(`/api/v1/connectionRequest/sendrq/accept/${id}`);
      setData(data.filter((user) => user._id !== id)); // Remove accepted request from state
    } catch (error) {
      console.log(error);
    }
  };

  const RejectRequest = async (id) => {
    try {
      await axiosInstance.get(`/api/v1/connectionRequest/sendrq/reject/${id}`);
      setData(data.filter((user) => user._id !== id)); // Remove rejected request from state
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getALLRequestDetail();
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 my-2">
          <div className="connecReq-maindiv">
            <h4 className="text-center my-3">Connection Requests</h4>
            {data.length === 0 ? (
              <p className="no-data-message">
                No Connection Requests Available
              </p>
            ) : (
              <div className="request-list">
                {data.map((user) => (
                  <div key={user._id} className="request-data">
                    <div className="req-image">
                      <img src={user.sender.image} alt="User" />
                      <p>
                        {user.sender.fullName} has sent you a connection
                        request.
                      </p>
                    </div>
                    <div className="req-user-data row">
                      <div className="col-md-3 col-6">
                        <strong>Gender:</strong> <p>{user.sender.gender}</p>
                      </div>
                      <div className="col-md-3 col-6">
                        <strong>Age:</strong> <p>{user.sender.age}</p>
                      </div>
                      <div className="col-md-3 col-6">
                        <strong>City:</strong> <p>{user.sender.city}</p>
                      </div>
                      <div className="col-md-3 col-6">
                        <strong>Work:</strong> <p>{user.sender.working}</p>
                      </div>
                    </div>
                    <div className="request-actions">
                      <button
                        className="accept-btn"
                        onClick={() => acceptRequest(user._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => RejectRequest(user._id)}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionReq;
