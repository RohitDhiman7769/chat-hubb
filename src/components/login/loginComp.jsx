import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import Input from "../input_filed/inputField";
import './login.css'
import GoogleAuth from "../google-auth";
import { useNavigate } from "react-router-dom";
import apiService from "../../apiService";

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

function Login() {
    const navigate = useNavigate();
    const [showSpinner, setShowSpinner] = useState(false)

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            setShowSpinner(true)
            try {
                const response = await apiService.post("/log-in", {
                    password: values.password,
                    email: values.email,
                });
                if (response.data.code == 200) {
                    setShowSpinner(false)
                    alert(response.data.message)
                    localStorage.setItem('auth_token', response.data.access_token)
                    localStorage.setItem('user_id', response.data.user_data._id)
                    localStorage.setItem('email', response.data.user_data.email)
                    localStorage.setItem('profile_img', response.data.user_data.profile_img)
                    localStorage.setItem('initial_login', response.data.user_data.initial_login)
                    console.log(response.data.user_data)
                    navigate("/home");
                }
            } catch (error) {
                setShowSpinner(false)
                console.log(error.response.data.error)
                alert(error.response.data.error)
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
                        <button type="submit">{showSpinner ?
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div> : <>Submit</>}</button>
                    </div>

                    <GoogleAuth></GoogleAuth>
                </form>
            </div>
        </div>
    );
}

export default Login;






