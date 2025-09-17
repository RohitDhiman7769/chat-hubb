import { use, useEffect, useState } from "react";
import apiService from "../../apiService";
import './profile.css'
import { useNavigate } from "react-router-dom";
import React from "react";
import UserProfileView from "../user_profile/userProfileView";
import.meta.env.VITE_API_KEY

function Profile() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState()
    const [requestToAddData, setRequestToAddData] = useState([])
    const [isShowUserProfileComponent, setShowUserProfileComponent] = useState(true)
    const [userProfileViewData, setUserProfileViewData] = useState()

    useEffect(() => {
        fetchUserProfile();
    }, [])
    /**
     * fetch user profile to show 
     */
    const fetchUserProfile = async () => {
        try {
            const response = await apiService.get(`/profile?user_id=${localStorage.getItem('user_id')}`);
            console.log(response)
            setUserData(response.data.data.profileData)
            setRequestToAddData(response.data.data.addingRequest)

        } catch (error) {
            console.error("Error fetching data:", error);
        }
        console.log(requestToAddData)
    };

    /**
     * 
     * @param {*} id get user id which friend request has been accepted
     */
    const confirmAddRequest = async (id) => {
        const response = await apiService.post(`/confirm-request`, {
            user_id: localStorage.getItem('user_id'),
            confirm_user_request_id: id
        });

        setRequestToAddData(requestToAddData.filter(item => item._id !== response?.data.data._id))
    }

    /**
     * Logout user account
     */
    const logOut = () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('email')
        localStorage.removeItem('profile_img')
        localStorage.removeItem('user_id')
        localStorage.removeItem('initial_login')
        navigate("/log-in")

    }

    /**
     * 
     * @param {*} data  show user profile comp
     */
    const showUserProfileComponent = (data) => {
        console.log(data)
        setShowUserProfileComponent(false)
        setUserProfileViewData(data)
    }

    if (isShowUserProfileComponent) {
        return (
            <section className="chat_main_section">
                <div className="container-fluid">
                    <div className="container">

                        <div className="main_form">
                            <div className="row form_row">


                                <div className="col-lg-12 fom_data ">

                                    <div className="chat_container position-relative">
                                        <div className="chat_person_head d-flex justify-content-between align-items-center">
                                            <div className="person_status_box d-flex justify-content-start align-items-center">

                                                <div className="person_status">
                                                    {/* <h1>{import.meta.env.VITE_BACKEND_URL}</h1> */}
                                                    <h2 style={{ fontWeight: '700' }} className="m-o person_name_head">
                                                        Profile
                                                    </h2>
                                                    <br />
                                                    <h4 style={{ paddingLeft: '20px' }} className="m-o person_name_head">
                                                        {userData?.email}
                                                    </h4>

                                                </div>
                                            </div>
                                            
                                            <div className=" setting_drop three_dot seeting_btn_desktop">
                                                <button
                                                    className="btn"
                                                    type="button"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                                </button>

                                                <ul className="dropdown-menu">
                                                    <li onClick={logOut}>
                                                        <button className="dropdown-item">
                                                            <img src="assets/images/customer-contact.svg" alt="" /> Log-out
                                                        </button>
                                                    </li>
                                                    <li>
                                                        <button className="dropdown-item delete_item" data-bs-toggle="modal" data-bs-target="#delete_chat">
                                                            <img src="assets/images/delete.svg" alt="" /> Delete Account
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>

                                        </div>
                                        <div className="chat_body ">

                                            <div style={{ borderBottom: '1px solid lightGrey' }}>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <div style={{ marginTop: '20px' }}>
                                                        <img
                                                            className="profile-img"
                                                            src={userData?.profile_img}
                                                            alt="Profile"
                                                            style={{
                                                                width: '150px',
                                                                height: '150px',
                                                                borderRadius: '50%',
                                                                objectFit: 'cover',
                                                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <h1 className="namePRofile" style={{ margin: '20px' }}>{userData?.email.split('@')[0]}</h1>
                                                </div>
                                            </div>
                                            <h2 className="add_request">Add Request : </h2>
                                            {requestToAddData.length > 0 ? (
                                                requestToAddData.map((user) => (

                                                    <React.Fragment key={user._id}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '13px' }}>
                                                            <div className="image_box" style={{ cursor: 'pointer' }} onClick={() => showUserProfileComponent(user)}>
                                                                <img className="rounded-circle" style={{ border: '1px solid black ', height: '80px', width: '80px', objectFit: 'cover' }} src={user.profile_img} alt="" />
                                                            </div>
                                                            <div className="person_status" onClick={() => showUserProfileComponent(user)} style={{ cursor: 'pointer', paddingRight: '530px' }}>
                                                                <h2 className="m-0 person_name_head">
                                                                    {user.email.split('@')[0]}
                                                                </h2>
                                                            </div>
                                                            <div style={{ display: 'flex' }}>
                                                                <button onClick={() => confirmAddRequest(user._id)}>Accept</button>
                                                            </div>
                                                        </div>
                                                    </React.Fragment>
                                                ))
                                            ) : (
                                                <div className="no_data" style={{ display: 'flex', justifyContent: 'center' }}>

                                                    <h2> <i className="fa-regular fa-message"></i> No Request Exist</h2>
                                                </div>

                                            )}

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    } {
        return (
            <>
                <UserProfileView userData={userProfileViewData} setFieldValue={setShowUserProfileComponent} />


            </>

        )
    }







}
export default Profile;
