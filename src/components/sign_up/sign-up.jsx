import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; 
import Input from "../input_filed/inputField"; 
import './signUp.css'
import GoogleAuth from "../google-auth";
import AWS from "aws-sdk";
import.meta.env.VITE_API_KEY
import { addImageInS3Bucket } from "../../utils/chat-funtion";
import apiService from "../../apiService";
import { useNavigate } from "react-router-dom";


const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    profilePicture: Yup.mixed().required("Profile picture is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").min(6, "Confirm Password must be at least 6 characters").required("Confirm Password is required"),
});

function SignUp({ updateCompValue }) {
    const navigate = useNavigate();
    const [showSpinner, setShowSpinner] = useState(false)

    const formik = useFormik({
        initialValues: { email: "", password: "", confirmPassword: "", profilePicture: '' },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            const image = await addImageInS3Bucket(values.profilePicture)
            try {
                setShowSpinner(true)
                const response = await apiService.post("/sign-up", {
                    password: values.password,
                    email: values.email,
                    profileImage: image
                });

                if (response.data.code == 200) {
                    setShowSpinner(false)
                    alert(response.data.message)
                    updateCompValue(1)
                    navigate("/log-in");
                }
            } catch (error) {
                console.log("Error uploading file:", error);
            }


        }
    });



    return (
        <div className="main auth_form">

            <div className="title">
                <h1>Sign-Up</h1>
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
                        setFieldValue={formik.setFieldValue}
                        classname={'password'}
                        paramToKnowComp={1}

                    />
                    <p style={{ color: "red" }}>{formik.errors.password}</p>


                    <Input
                        placeholder="Confirm-passowrd"
                        type="password"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        setFieldValue={formik.setFieldValue}
                        classname={'password'}
                        paramToKnowComp={1}

                    />
                    <p style={{ color: "red" }}>{formik.errors.confirmPassword}</p>

                    <input type="file" name="profilePicture" onChange={(event) => {
                        formik.setFieldValue("profilePicture", event.currentTarget.files[0]);
                    }} className="password profilePicture_input"
                    />
                    {formik.touched.profilePicture && formik.errors.profilePicture && (<p style={{ color: "red" }}>{formik.errors.profilePicture}</p>)}
                    <div>

                        <button type="submit"> {showSpinner ?
                            <div className="d-flex justify-content-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div> : <>Submit</>}</button>
                    </div>

                    <GoogleAuth />

                </form>
            </div>
        </div>
    );
}

export default SignUp;