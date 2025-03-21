import React, { useEffect, useState } from "react";
import "./Userdetails.css";
import { useParams } from "react-router-dom";
import axios from "axios";
const Userdetails = () => {
  const [data, setData] = useState({});
  const { _id } = useParams();
  const getApiData = async () => {
    try {
      let res = await axios.get(
        "https://api.muslimmalikrishte.com/api/v1/adminPanel/user/" + _id
      );
      // console.log(res.data.user);
      setData(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getApiData();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <>
      {/* <h2 style={{ marginTop: 100 }}>Home</h2> */}
      <div className="full-details-container mt-5">
        <h2 className="text-center">Full Informations</h2>
        <div className="table-containerfirst">
          <table className="table table-bordered table-striped table-hover tablweidth">
            <tbody>
              <tr>
                <th colSpan={3} style={{ color: "Maroon" }}>
                  PERSONAL INFORMATION
                </th>
              </tr>
              <tr>
                <th>USER ID </th>
                <td>{`MMR00${data.unqId}`}</td>
              </tr>
              <tr>
                <th>Full Name</th>
                <td>{data.fullName}</td>
              </tr>
              <tr>
                <th>Father Name</th>
                <td>{data.fatherName}</td>
              </tr>
              <tr>
                <th>Mother Name</th>
                <td>{data.motherName}</td>
              </tr>
              <tr>
                <th>Grand Father Name</th>
                <td>{data.GrandFatherName}</td>
              </tr>
              <tr>
                <th>Gender</th>
                <td>{data.gender}</td>
              </tr>
              <tr>
                <th>Age</th>
                <td>{data.age}</td>
              </tr>
              <tr>
                <th>Date Of Birth</th>
                <td>{data.dob}</td>
              </tr>

              <tr>
                <th>Height</th>
                <td>{data.height}</td>
              </tr>
              <tr>
                <th>No. of Brother</th>
                <td>{data.siblings}</td>
              </tr>
              <tr>
                <th>No. of Sister</th>
                <td>{data.Sistersiblings}</td>
              </tr>
            </tbody>
          </table>
          <div className="imagediv">
            <a href={data.image} target="_blank" rel="noopener noreferrer">
              <img src={data.image} alt={data.name} className="profile-image" />
            </a>
          </div>
        </div>

        <div className="table-container">
          <table className="table table-bordered table-striped table-hover  ">
            <tbody>
              <tr>
                <th colSpan={8} style={{ color: "Maroon" }}>
                  MORE DETAILS
                </th>
              </tr>
              <tr>
                <th>Family Head</th>
                <td>{data.FamilyHead}</td>
                <th>Family Occupation Head</th>
                <td>{data.FamilyHeadOccupation}</td>
                <th>Married Status</th>
                <td>{data.maritalstatus}</td>
              </tr>

              <tr>
                <th>Belong</th>
                <td>{data.pehchan}</td>
                <th>Education</th>
                <td>{data.education}</td>
                <th>Working</th>
                <td>{data.working}</td>
              </tr>

              <tr>
                <th>Annual Income</th>
                <td colSpan={2}>{data.annualIncome}</td>
                <th>House</th>
                <td colSpan={2}>{data.house}</td>
              </tr>
              <tr>
                <th colSpan={8} style={{ color: "Maroon" }}>
                  CONTACT DETAILS
                </th>
              </tr>
              <tr>
                <th>Email</th>
                <td colSpan={2}>{data.email}</td>
                <th>Phone</th>
                <td colSpan={2}>{data.phone}</td>
              </tr>
              <tr>
                <th colSpan={8} style={{ color: "Maroon" }}>
                  WEDDING DETAILS
                </th>
              </tr>
              <tr>
                <th>Wedding Style</th>
                <td colSpan={2}>{data.weddingStyle}</td>
                <th>Wedding Budget</th>
                <td colSpan={2}>{data.weddingBudget}</td>
              </tr>

              <tr>
                <th colSpan={8} style={{ color: "Maroon" }}>
                  Location / Residence
                </th>
              </tr>
              <tr>
                <th>Area</th>
                <td>{data.area}</td>
                <th>City</th>
                <td>{data.city}</td>
              </tr>
              <tr>
                <th>State</th>
                <td>{data.state}</td>
                <th>Pin Code</th>
                <td>{data.pin}</td>
                <th>Country</th>
                <td>{data.country}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Userdetails;
