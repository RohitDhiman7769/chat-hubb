import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import Input from "./inputField"; // Ensure Input is properly imported
import './signUp.css'

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
});

function ForgetPassword() {
    // const handleChildData = (event) => {
    //     console.log(event);
    // };

    const formik = useFormik({
        initialValues: { email: ""},
        validationSchema: validationSchema,
        onSubmit: (values) => console.log(values),
    });

    return (
        <div className="main auth_form">
            <div className="title">
            <h1>Forget Password</h1>
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

                    />
                    <p style={{ color: "red" }}>{formik.errors.email}</p>

                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgetPassword;
