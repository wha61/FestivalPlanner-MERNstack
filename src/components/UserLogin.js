import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import Cookies from "js-cookie";
import hide from "../images/hide.png";
import show from "../images/show.png";

const UserLogin = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [passwordShown, setPasswordShown] = useState(false);

    const [credentials, setCredentials] = useState({
        emailOrUsername: "",
        password: "",
    });

    const [error, setError] = useState({
        emailOrUsername: "",
        password: "",
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials({
            ...credentials,
            [name]: value,
        });
    };

    const validateFormInput = (event) => {
        event.preventDefault();
        let inputError = {
            emailOrUsername: "",
            password: "",
        };

        if (!credentials.emailOrUsername && !credentials.emailOrUsername) {
            setError({
                ...inputError,
                emailOrUsername:
                    "Enter your email address (e.g. email@address.com) or your username",
                password: "Enter your password",
            });
            return;
        }

        if (!credentials.emailOrUsername) {
            setError({
                ...inputError,
                emailOrUsername:
                    "Enter your email address (e.g. email@address.com) or your username",
            });
            return;
        }

        if (!credentials.password) {
            setError({
                ...inputError,
                password: "Enter your password",
            });
            return;
        }

        setError(inputError);

        if (credentials.emailOrUsername && credentials.password) {
            handleSubmit(event);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(
                "http://localhost:3001/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(credentials),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message);
            } else {
                dispatch(setUser(data.user));
                Cookies.set("token", data.token);
                document.cookie = `token=${data.token}; path=/`;
                // alert(data.message);
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            alert("Error occurred while logging in");
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
                                        style={{borderRadius: "1rem 0 0 1rem"}}
                                    />
                                </div> */}
                                    <div className="col-md-6 col-lg-7 d-flex align-items-center">
                                        <div className="card-body p-4 p-lg-5 text-black">
                                            <form onSubmit={validateFormInput}>
                                                <div className="d-flex align-items-center mb-3 pb-1">
                                                    <span className="h1 fw-bold mb-0">
                                                        Log In
                                                    </span>
                                                </div>

                                                <div className="form-floating mb-3">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="floatingInput"
                                                        placeholder="Username or email address"
                                                        name="emailOrUsername"
                                                        value={
                                                            credentials.emailOrUsername
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <p className="error-message">
                                                        {error.emailOrUsername}
                                                    </p>
                                                    <label htmlFor="floatingInput">
                                                        Username or email
                                                        address
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
                                                            className={`form-control ${
                                                                error.password
                                                                    ? "is-invalid"
                                                                    : ""
                                                            }`}
                                                            name="password"
                                                            id="floatingPassword"
                                                            placeholder="Password"
                                                            defaultValue={
                                                                credentials.password
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

                                                    {error.password && (
                                                        <div className="col-md-12 invalid-feedback">
                                                            {error.password}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="pt-1 mb-4">
                                                    <button
                                                        className="btn btn-dark btn-lg btn-block"
                                                        type="submit"
                                                        value="Submit"
                                                    >
                                                        Log in
                                                    </button>
                                                </div>

                                                <p
                                                    className="mb-5 pb-lg-2"
                                                    style={{ color: "#393f81" }}
                                                >
                                                    Don't have an account?{" "}
                                                    <a
                                                        href="/signup"
                                                        style={{
                                                            color: "#393f81",
                                                        }}
                                                    >
                                                        Sign up here
                                                    </a>
                                                </p>
                                                <a
                                                    href="#!"
                                                    className="small text-muted"
                                                >
                                                    Terms of use.
                                                </a>
                                                <a
                                                    href="#!"
                                                    className="small text-muted"
                                                >
                                                    Privacy policy
                                                </a>
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

export default UserLogin;
