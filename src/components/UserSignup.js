import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import hide from "../images/hide.png";
import show from "../images/show.png";

const UserSignup = () => {
    const navigate = useNavigate();

    const [organizer, setOrganizer] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);

    const [input, setInput] = useState({
        fname: "",
        lname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState({
        fname: "",
        lname: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setInput({
            ...input,
            [name]: value,
        });
    };

    const validateUsername = (username) => {
        const usernameRegex = /^[A-Za-z0-9_.]+$/;
        return usernameRegex.test(username);
    };

    const validatePassword = (password) => {
        const passwordRegex =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()-_=+{}[\]|\\;:'",.<>/?]).{8,}$/;
        return passwordRegex.test(password);
    };

    const validateFormInput = (event) => {
        event.preventDefault();
        let inputError = {
            fname: "",
            lname: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        };

        if (!input.fname && !input.lname && !input.email && !input.password) {
            setError({
                ...inputError,
                fname: "Enter your first name",
                lname: "Enter your last name",
                username: "Enter your chosen username",
                email: "Enter a valid email address",
                password: "Enter your chosen password",
            });
            return;
        }

        if (!input.fname) {
            setError({
                ...inputError,
                fname: "Enter your first name",
            });
            return;
        }

        if (!input.lname) {
            setError({
                ...inputError,
                lname: "Enter your last name",
            });
            return;
        }

        if (!validateUsername(input.username)) {
            setError({
                ...inputError,
                username:
                    "Username can only contain letters (a-z), numbers (0-9), underscore (_), and period (.)",
            });
            return;
        }

        if (!input.email) {
            setError({
                ...inputError,
                email: "Enter a valid email address",
            });
            return;
        }

        if (!validatePassword(input.password)) {
            setError({
                ...inputError,
                password:
                    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
            });
            return;
        }

        if (input.confirmPassword !== input.password) {
            setError({
                ...inputError,
                confirmPassword: "Re-enter your password",
            });
            return;
        }

        setError(inputError);

        if (
            input.fname &&
            input.lname &&
            input.email &&
            input.username &&
            input.password === input.confirmPassword
        ) {
            handleSubmit(event);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/api/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: input.username,
                    fname: input.fname,
                    lname: input.lname,
                    email: input.email,
                    password: input.password,
                    role: organizer ? "admin" : "user",
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    const { existingUsername, existingEmail } = responseData;
                    let errorMessage = "User with this ";
                    if (existingUsername && existingEmail) {
                        errorMessage +=
                            "username and email already exists. Do you want to log in?";
                    } else if (existingUsername) {
                        errorMessage +=
                            "username already exists. Do you want to log in ?";
                    } else {
                        errorMessage +=
                            "email already exists. Do you want to log in?";
                    }

                    if (window.confirm(errorMessage)) {
                        navigate("/login");
                    }
                } else {
                    throw new Error("Error occurred while adding user.");
                }
            } else {
                alert("User added successfully!");
                navigate("/login");
            }
        } catch (error) {
            alert(error.message);
            console.error(error);
        }
    };

    const handleShowPass = (event) => {
        event.preventDefault();
        setPasswordShown(!passwordShown);
    };

    const handlePaste = (e) => {
        e.preventDefault();
        console.log("Pasting is not allowed for this input field.");
    };

    return (
        <>
            <section className="vh-100" style={{ backgroundColor: "#eee" }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col col-xl-10">
                            <div
                                className="card"
                                style={{ borderRadius: "1rem" }}
                            >
                                <div className="row g-0">
                                    {/* <div class="col-md-6 col-lg-5 d-none d-md-block">
                                        <img
                                            src=""
                                            alt="login form"
                                            class="img-fluid"
                                            style={{
                                                borderRadius: "1rem 0 0 1rem",
                                            }}
                                        />
                                    </div> */}
                                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                        <div className="card-body p-4 p-lg-6 text-black">
                                            <form onSubmit={validateFormInput}>
                                                <div className="d-flex align-items-center mb-3 pb-1">
                                                    <span className="h1 fw-bold mb-0">
                                                        Sign up
                                                    </span>
                                                </div>

                                                <div className="row g-2">
                                                    <div className="form-floating col-md">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="fname"
                                                            id="floatingInputFN"
                                                            placeholder="First name"
                                                            defaultValue={
                                                                input.fname
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                        <p className="error-message">
                                                            {error.fname}
                                                        </p>
                                                        <label htmlFor="floatingInputFN">
                                                            First name
                                                        </label>
                                                    </div>
                                                    <div className="form-floating col-md">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="lname"
                                                            id="floatingInputLN"
                                                            placeholder="Last name"
                                                            defaultValue={
                                                                input.lname
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                        <p className="error-message">
                                                            {error.lname}
                                                        </p>
                                                        <label htmlFor="floatingInputLN">
                                                            Last name
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="form-floating col-md">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="username"
                                                        id="floatingInputUN"
                                                        placeholder="Username"
                                                        defaultValue={
                                                            input.username
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <p className="error-message">
                                                        {error.username}
                                                    </p>
                                                    <label htmlFor="floatingInputUN">
                                                        Username
                                                    </label>
                                                </div>

                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        name="email"
                                                        id="floatingInputEA"
                                                        placeholder="name@example.com"
                                                        defaultValue={
                                                            input.email
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <p className="error-message">
                                                        {error.email}
                                                    </p>
                                                    <label htmlFor="floatingInputEA">
                                                        Email address
                                                    </label>
                                                </div>

                                                <div className="row g-2">
                                                    <div className="form-floating mb-3 col-md position-relative">
                                                        <input
                                                            type={
                                                                passwordShown
                                                                    ? "text"
                                                                    : "password"
                                                            }
                                                            className="form-control"
                                                            name="password"
                                                            id="floatingPassword"
                                                            placeholder="Password"
                                                            defaultValue={
                                                                input.password
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            onPaste={
                                                                handlePaste
                                                            }
                                                            style={{
                                                                width: "100%",
                                                            }}
                                                        />

                                                        <label
                                                            htmlFor="floatingPassword"
                                                            className="form-label"
                                                        >
                                                            Password
                                                        </label>

                                                        <img
                                                            src={
                                                                passwordShown
                                                                    ? hide
                                                                    : show
                                                            }
                                                            alt="Toggle Password Visibility"
                                                            height={20}
                                                            width={20}
                                                            onClick={
                                                                handleShowPass
                                                            }
                                                            className="password-toggle-btn"
                                                        />
                                                    </div>
                                                </div>
                                                {error.password && (
                                                    <p className="error-message">
                                                        {error.password}
                                                    </p>
                                                )}

                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        name="confirmPassword"
                                                        id="floatingPasswordC"
                                                        placeholder="Password"
                                                        defaultValue={
                                                            input.confirmPassword
                                                        }
                                                        onChange={handleChange}
                                                        onPaste={handlePaste}
                                                    />
                                                    <p className="error-message">
                                                        {error.confirmPassword}
                                                    </p>
                                                    <label htmlFor="floatingPasswordC">
                                                        Confirm your password
                                                    </label>
                                                </div>

                                                <div className="form-check d-flex mb-5">
                                                    <input
                                                        className="form-check-input me-2"
                                                        type="checkbox"
                                                        id="form2Example3c"
                                                        defaultChecked={
                                                            organizer
                                                        }
                                                        onChange={() =>
                                                            setOrganizer(true)
                                                        }
                                                    />
                                                    <label className="form-check-label">
                                                        Sign up as an Organizer
                                                    </label>
                                                </div>

                                                <div className="pt-1 mb-4">
                                                    <button
                                                        className="btn btn-dark btn-lg btn-block"
                                                        type="submit"
                                                        value="Submit"
                                                    >
                                                        Sign up
                                                    </button>
                                                    <p className="small text-muted">
                                                        By clicking Sign up, you
                                                        agree to our{" "}
                                                        <a href="#!">
                                                            Terms of use
                                                        </a>
                                                        {" and "}
                                                        <a href="#!">
                                                            Privacy policy
                                                        </a>
                                                    </p>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default UserSignup;
