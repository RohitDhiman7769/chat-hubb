import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import Input from "./inputField"; // Ensure Input is properly imported
import './signUp.css'
import GoogleAuth from "./google-auth";
import AWS from "aws-sdk";
import.meta.env.VITE_API_KEY
// import apiService
import apiService from "../apiService";
import { useNavigate } from "react-router-dom";


const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    profilePicture: Yup.mixed().required("Profile picture is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").min(6, "Confirm Password must be at least 6 characters").required("Confirm Password is required"),
});

function SignUp({updateCompValue}) {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { email: "", password: "", confirmPassword: "", profilePicture: '' },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            AWS.config.update({
                accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY,
                secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY,
            });
            console.log('values')

            const s3 = new AWS.S3({
                params: { Bucket: 'rohit-dhiman-buckt' },
                region: 'us-east-1',
            });
            console.log('values')

            const params = {
                Bucket: 'rohit-dhiman-buckt',
                Key: values.profilePicture.name,
                Body: values.profilePicture,
            };

            console.log('values')

            try {
                const upload = s3
                    .putObject(params)
                    .on("httpUploadProgress", (evt) => {
                        console.log("Uploading " + parseInt((evt.loaded * 100) / evt.total) + "%");
                    })
                    .promise();

                await upload;

                // Construct the file URL manually
                const fileUrl = `https://rohit-dhiman-buckt.s3.eu-north-1.amazonaws.com/${params.Key}`;
                const response = await apiService.post("/sign-up", {
                    password: values.password,
                    email: values.email,
                    profileImage: fileUrl
                });

                if (response.data.code == 200) {
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
                    }} className="password"
                    />
                    {formik.touched.profilePicture && formik.errors.profilePicture && (<p style={{ color: "red" }}>{formik.errors.profilePicture}</p>)}
                    <div>
                        <button type="submit">Submit</button>
                    </div>

                    <GoogleAuth />

                </form>
            </div>
        </div>
    );
}

export default SignUp;