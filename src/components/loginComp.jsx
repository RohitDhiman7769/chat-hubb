import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import Input from "./inputField"; // Ensure Input is properly imported
import './login.css'

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

function Login() {
    // const handleChildData = (event) => {
    //     console.log(event);
    // };

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: validationSchema,
        onSubmit: (values) => console.log(values),
    });

    return (
        
        <div className="main">
            <div className="title">
                <h1>Login</h1>
            </div>

            <div  className="form">
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

                    <Input
                        placeholder="Password"
                        type="password"
                        name="password"
                        value={formik.values.password}
                        // onChange={formik.handleChange}
                        setFieldValue={formik.setFieldValue} 
                        classname={'password'}

                    />
                    <p style={{ color: "red" }}>{formik.errors.password}</p>

                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
