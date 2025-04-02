import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import Input from "./inputField"; // Ensure Input is properly imported
import './login.css'
import GoogleAuth from "./google-auth";
import apiService from "../apiService";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

function Login() {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const response = await apiService.post("/log-in", {
                password: values.password,
                email: values.email,
            });
            console.log(response)

            if (response.data.code == 200) {
                alert(response.data.message)
                console.log(response.data.user_data.user_id)
                localStorage.setItem('auth_token', response.data.access_token)
                localStorage.setItem('user_id', response.data.user_data._id)
                localStorage.setItem('email', response.data.user_data.email)
                localStorage.setItem('profile_img', response.data.user_data.profile_img)
                localStorage.setItem('initial_login', response.data.user_data.initial_login)
                navigate("/home")
            }
        }
    });

    return (

        <div className="main auth_form">
            <div className="title">
                <h1>Login</h1>
            </div>

            <div className="form">
                <form onSubmit={formik.handleSubmit}>
                    <Input
                        placeholder="Email"
                        type="email"
                        name="email"
                        value={formik.values.email}
                        setFieldValue={formik.setFieldValue}
                        classname={'emailInput'}
                        paramToKnowComp={1}

                    />
                    <p style={{ color: "red" }}>{formik.errors.email}</p>

                    <Input
                        placeholder="Password"
                        type="password"
                        name="password"
                        value={formik.values.password}
                        paramToKnowComp={1}

                        setFieldValue={formik.setFieldValue}
                        classname={'password'}

                    />
                    <p style={{ color: "red" }}>{formik.errors.password}</p>

                    <div>
                        <button type="submit">Submit</button>
                    </div>

                    <GoogleAuth></GoogleAuth>
                </form>
            </div>
        </div>
    );
}

export default Login;
