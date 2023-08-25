import React from "react";
import {
    MDBBtn,
    MDBContainer,
    MDBRow,
    MDBCol,
    MDBCard,
    MDBCardBody,
    MDBInput,
    MDBSelect,
    MDBRadio,
} from "mdb-react-ui-kit";
import http from "../http-common";
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "../style/Profile.css";
import { useSelector, useDispatch } from "react-redux";
import hide from "../images/hide.png";
import show from "../images/show.png";
const EditUserProfile = () => {
    const [formData, setFormData] = useState({
        username: "",
        fname: "",
        lname: "",
        email: "",
        socials: {
            instagram: "",
            facebook: "",
        },
        password: "",
        newPassword: "",
        newPasswordConfirm: "",
    });

    const [error, setError] = useState({
        fname: "",
        lname: "",
        username: "",
        email: "",
        socials: "",
        password: "",
        newPassword: "",
        newPasswordConfirm: "",
    });
    const navigate = useNavigate();

    const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
    const user = useSelector((state) => state.user.user);

    let id;
    if (isLoggedIn) {
        id = user._id;
    }
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await http.get(`/${id}`);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    ...response.data,
                    selectedSocial: response.data.socials.instagram
                        ? "instagram"
                        : response.data.socials.facebook
                        ? "facebook"
                        : "other",
                }));
            } catch (error) {
                console.error(error);
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Check if the input field belongs to socials and update accordingly
        if (name.startsWith("socials.")) {
            setFormData((prevFormData) => ({
                ...prevFormData,
                socials: {
                    ...prevFormData.socials,
                    [name.split(".")[1]]: value,
                },
            }));
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: value,
            }));
        }
    };

    const handleRadioChange = (e) => {
        const { value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            selectedSocial: value,
        }));
    };

    const validatePassword = (password) => {
        const passwordRegex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{}[\]|\\;:'",.<>/?]).{8,}$/;
        return passwordRegex.test(password);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        console.log("Pasting is not allowed for this input field.");
    };

    const handleSubmit = async (e) => {
        try {
            // Construct the updated user object with the selected social and handle
            const updatedUser = {
                ...formData,
                socials: {
                    [formData.selectedSocial]:
                        formData.socials[formData.selectedSocial],
                },
            };
            console.log(updatedUser);
            await http.put(`/edit/${id}`, updatedUser);
            // After successful update, redirect back to the profile page
            window.location.href = "/profile";
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MDBContainer fluid>
            <MDBRow className="justify-content-center align-items-center m-5">
                <MDBCard>
                    <MDBCardBody className="px-4">
                        <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5">
                            Update Profile
                        </h3>

                        <MDBRow>
                            <MDBCol md="6">
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="First Name"
                                    name="fname"
                                    size="lg"
                                    id="form1"
                                    type="text"
                                    value={formData.fname}
                                    onChange={handleChange}
                                />
                            </MDBCol>

                            <MDBCol md="6">
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Last Name"
                                    name="lname"
                                    size="lg"
                                    id="form2"
                                    type="text"
                                    value={formData.lname}
                                    onChange={handleChange}
                                />
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>
                            <MDBCol md="6">
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Username"
                                    name="username"
                                    size="lg"
                                    id="form3"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </MDBCol>

                            <MDBCol md="6">
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Email"
                                    name="email"
                                    size="lg"
                                    id="form4"
                                    type="text"
                                    value={formData.email}
                                    disabled
                                />
                            </MDBCol>
                        </MDBRow>
                        <MDBRow>
                            <MDBCol md="6" className="mb-4">
                                <h6 className="fw-bold">Social: </h6>
                                <MDBRadio
                                    name="inlineRadio"
                                    id="inlineRadio1"
                                    value="instagram"
                                    label="Instagram"
                                    inline
                                    checked={
                                        formData.selectedSocial === "instagram"
                                    }
                                    onChange={handleRadioChange}
                                />
                                <MDBRadio
                                    name="inlineRadio"
                                    id="inlineRadio2"
                                    value="facebook"
                                    label="Facebook"
                                    inline
                                    checked={
                                        formData.selectedSocial === "facebook"
                                    }
                                    onChange={handleRadioChange}
                                />
                            </MDBCol>

                            <MDBCol md="6">
                                {formData.selectedSocial === "instagram" && (
                                    <MDBInput
                                        wrapperClass="mb-4"
                                        label="Handle"
                                        size="lg"
                                        id="form3"
                                        type="text"
                                        name="socials.instagram"
                                        value={formData.socials.instagram}
                                        onChange={handleChange}
                                    />
                                )}
                                {formData.selectedSocial === "facebook" && (
                                    <MDBInput
                                        wrapperClass="mb-4"
                                        label="Handle"
                                        size="lg"
                                        id="form3"
                                        type="text"
                                        name="socials.facebook"
                                        value={formData.socials.facebook}
                                        onChange={handleChange}
                                    />
                                )}
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>
                            <MDBCol>
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Current password"
                                    size="lg"
                                    id="form3"
                                    type="text"
                                    name="password"
                                    onChange={handleChange}
                                />
                            </MDBCol>
                            <MDBCol>
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="New password"
                                    size="lg"
                                    id="form3"
                                    type="text"
                                    name="newPassword"
                                    onChange={handleChange}
                                />
                                <MDBInput
                                    wrapperClass="mb-4"
                                    label="Re-enter new password"
                                    size="lg"
                                    id="form3"
                                    type="text"
                                    name="newPasswordConfirm"
                                    onChange={handleChange}
                                    onPaste={handlePaste}
                                />
                            </MDBCol>
                        </MDBRow>
                        <button
                            type="button"
                            className="btn btn-outline-info"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </MDBCardBody>
                </MDBCard>
            </MDBRow>
        </MDBContainer>
    );
};

export default EditUserProfile;
