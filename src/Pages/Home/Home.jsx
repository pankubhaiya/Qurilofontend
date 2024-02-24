import React, { useState } from "react";
import axios from "axios";
import "./Home.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaPlusSquare } from "react-icons/fa";
import { HiMiniArrowUpTray } from "react-icons/hi2";
const Home = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    residentialAddress: "",
    residentialAddress2: "",
    permanentAddress: "",
    permanentAddress2: "",
    sameAsResidential: false,
    documents: [{ fileName: "", fileType: "", file: null }],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "sameAsResidential") {
      setFormData((prevState) => ({
        ...prevState,
        [name]: checked,
        permanentAddress: checked ? formData.residentialAddress : "",
        permanentAddress2: checked ? formData.residentialAddress2 : "",
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleDocumentChange = (index, e) => {
    const { name, value, files } = e.target;
    const newDocuments = [...formData.documents];
    if (name === "file") {
      newDocuments[index][name] = files[0];
    } else {
      newDocuments[index][name] = value;
    }
    setFormData((prevState) => ({
      ...prevState,
      documents: newDocuments,
    }));
  };

  const handleFileTypeChange = (index, e) => {
    const { value } = e.target;
    const newDocuments = [...formData.documents];
    newDocuments[index]["fileType"] = value;
    setFormData((prevState) => ({
      ...prevState,
      documents: newDocuments,
    }));
  };

  const addDocumentField = () => {
    setFormData((prevState) => ({
      ...prevState,
      documents: [
        ...prevState.documents,
        { fileName: "", fileType: "", file: null },
      ],
    }));
  };

  const removeDocumentField = (index) => {
    const newDocuments = [...formData.documents];
    newDocuments.splice(index, 1);
    setFormData((prevState) => ({
      ...prevState,
      documents: newDocuments,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("firstname", formData.firstName);
      formDataToSend.append("lastname", formData.lastName);
      formDataToSend.append("dob", formData.dob);
      formDataToSend.append("address", formData.residentialAddress);
      formDataToSend.append("email", formData.email);
      formDataToSend.append(
        "conforgaddress",
        formData.sameAsResidential
          ? formData.residentialAddress
          : formData.permanentAddress
      );

      // Append files
      for (let i = 0; i < formData.documents.length; i++) {
        formDataToSend.append("files", formData.documents[i].file);
      }

      const response = await axios.post(
        "http://localhost:9090/upload",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status == 200) {
        alert("Document upload successful");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          dob: "",
          residentialAddress: "",
          residentialAddress2: "",
          permanentAddress: "",
          permanentAddress2: "",
          sameAsResidential: false,
          documents: [{ fileName: "", fileType: "", file: null }],
        });
      }
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error, show error message, etc.
    }
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const age = calculateAge(value);
    if (age >= 18) {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    } else {
      alert("Age must be 18 or above.");
    }
  };

  return (
    <>
      <h1>MERN STACK MACHINE TEST</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div>
            <label htmlFor="firstName">First Name *</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName">Last Name *</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div>
            <label htmlFor="dob">Date of Birth *</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleDateChange}
              placeholder="Date of Birth"
              required
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <div>
          <h6>Residential Address </h6>
        </div>
        <div className="form-row">
          <div>
            <label htmlFor="residentialAddress">Street 1 *</label>
            <input
              type="text"
              id="residentialAddress"
              name="residentialAddress"
              value={formData.residentialAddress}
              onChange={handleChange}
              placeholder="Residential Address"
              required
            />
          </div>
          <div>
            <label htmlFor="residentialAddress2">Street 2 *</label>
            <input
              type="text"
              id="residentialAddress2"
              name="residentialAddress2"
              value={formData.residentialAddress2}
              onChange={handleChange}
              placeholder="Residential Address 2"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div>
            <input
              type="checkbox"
              id="sameAsResidential"
              name="sameAsResidential"
              checked={formData.sameAsResidential}
              onChange={handleChange}
            />
            <label htmlFor="sameAsResidential">
              Same as Residential Address
            </label>
          </div>
        </div>
        <div>
          <h6>Permanent Address</h6>
        </div>
        <div className="form-row">
          <div>
            <label htmlFor="permanentAddress">Street 1</label>
            <input
              type="text"
              id="permanentAddress"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              placeholder="Permanent Address"
              required={!formData.sameAsResidential}
            />
          </div>
          <div>
            <label htmlFor="permanentAddress2">Street 2</label>
            <input
              type="text"
              id="permanentAddress2"
              name="permanentAddress2"
              value={formData.permanentAddress2}
              onChange={handleChange}
              placeholder="Permanent Address 2"
              required={!formData.sameAsResidential}
            />
          </div>
        </div>
        <div>
          {" "}
          <h6>Upload Document</h6>
        </div>
        <div>
          <div className="uplodeform">
            <div>
              <label htmlFor="fileName">fileName *</label>
              <input
                type="text"
                id="fileName"
                name="fileName"
                value={formData.documents[0].fileName}
                onChange={(e) => handleDocumentChange(0, e)}
                placeholder="File Name"
                required
              />
            </div>
            <div>
              <label htmlFor="fileType">fileType *</label>
              <select
                id="fileType"
                name="fileType"
                value={formData.documents[0].fileType}
                onChange={(e) => handleFileTypeChange(0, e)}
                required
              >
                <option value="">File Type </option>
                <option value="image">Image</option>
                <option value="pdf">PDF</option>
              </select>
            </div>
            <div>
              <div>
                <label htmlFor="file">Upload Document *</label>
                <label className="file-label">
                  <HiMiniArrowUpTray />
                  <input
                    id="file"
                    type="file"
                    name="file"
                    accept={
                      formData.documents[0].fileType === "image"
                        ? "image/*"
                        : ".pdf"
                    }
                    onChange={(e) => handleDocumentChange(0, e)}
                    required
                  />
                  {formData.documents[0].file && (
                    <span className="file-name">
                      {formData.documents[0].file.name}
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div>
              <span type="button" onClick={addDocumentField}>
                <FaPlusSquare />
              </span>
            </div>
          </div>
          {formData.documents.slice(1).map((document, index) => (
            <div key={index} className="uplodeform">
              <div>
                <label htmlFor="fileName">fileName *</label>
                <input
                  type="text"
                  name="fileName"
                  value={document.fileName}
                  onChange={(e) => handleDocumentChange(index + 1, e)}
                  placeholder="File Name"
                  required
                />
              </div>
              <div>
                <label htmlFor="fileName">fileType *</label>
                <select
                  name="fileType"
                  value={document.fileType}
                  onChange={(e) => handleFileTypeChange(index + 1, e)}
                  required
                >
                  <option value="">File Type</option>
                  <option value="image">Image</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>
              <div>
                <div className="upload-form">
                  <label htmlFor="fileName">Upload Document *</label>
                  <label className="file-label">
                    <HiMiniArrowUpTray />
                    <input
                      type={document.fileType === "image" ? "file" : "file"}
                      name="file"
                      accept={
                        document.fileType === "image" ? "image/*" : ".pdf"
                      }
                      onChange={(e) => handleDocumentChange(index + 1, e)}
                      required
                    />
                    {document.file && (
                      <span className="file-name">{document.file.name}</span>
                    )}
                  </label>
                </div>
              </div>
              <div>
                <span
                  type="button"
                  onClick={() => removeDocumentField(index + 1)}
                >
                  <RiDeleteBin6Line />
                </span>
              </div>
            </div>
          ))}
        </div>

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Home;
