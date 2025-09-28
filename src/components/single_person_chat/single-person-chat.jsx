import { addDoc, collection, onSnapshot, query, serverTimestamp, orderBy, doc } from 'firebase/firestore';
import { useEffect, useState, useRef } from "react";
import UserProfileView from "../user_profile/userProfileView";
import apiService from "../../apiService";
// import React from 'react';
import Input from '../input_filed/inputField';
import { db } from '../../firebase-config';
import './single-person-chat.css'
// import myImage from '../assets/back.png';
import myImage from '../../assets/back.png';
// import { useFormik } from "formik";
import Chat from '../chat/chat';
// import PopUp from '../popUp';
import '../newChat.css';
import { useSnackbar } from "notistack";
import Skeleton from '@mui/material/Skeleton';
import { useCallback } from "react";
import { debounce } from "lodash";
import NoDataFound from '../noDataFound/noDataFound';
// import skeleton, { Skeleton } from '@mui/material/Skeleton';
// import circular
export default function SinglePersonChat() {
    const modalOpenBtn = useRef();
    const modalCloseBtn = useRef()
    const inputRef = useRef()
    const ChatComponent = useRef(null);
    const user = localStorage.getItem('user_id')
    const conversationDocRef = doc(db, "chat-hubb", "conversation")
    const [conversationId, setConversationId] = useState()
    // const [showSpinner, setShowSpinner] = useState(true)
    // const [listOfUsers, setListOfUsers] = useState([])
    const [selectedUserForFriend, setSelectedUserForFriend] = useState([])
    const [usersList, setUsersList] = useState([])
    const [showUserChat, setShowUserChat] = useState(1)
    const [currentChatUserData, setCurrentChatUserData] = useState()
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [globalUsersList, setGlobalUsersList] = useState([]);
    // const [globalUsersList, setGlobalUsersList] = useState([]);
    const checkInitialLogin = localStorage.getItem('initial_login')
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchData(checkInitialLogin);
    }, [])

    // useEffect(() => {
    // }, [listOfUsers]);


    useEffect(() => {
        if (showUserChat == 2 && ChatComponent.current) {
            ChatComponent.current.callChatFunct();
        }
    }, [showUserChat]);


    /**
     * fetch added user list
     */
    const fetchData = async (checkInitialLogin) => {
        try {
            // if (checkInitialLogin == 1) {
            // fetchAllUser()
            // modalOpenBtn.current.click()
            localStorage.setItem('initial_login', 2)

            // } else {
            setShowSkeleton(true);

            const response = await apiService.get(`/added-users-list?userId=${user}`);
            setUsersList(response.data.data)
            setShowSkeleton(false);

            // }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    /**
     * 
     * @returns split user name from email
     */
    const getUserName = () => {
        // console.log('emial', currentChatUserData?.email)
        if (currentChatUserData?.email) {
            return currentChatUserData.email.split('@')[0]
        }
        // return 'vishal singh chobber'

    }

    /**
     * fetch all users from backend
     */
    const fetchAllUser = async () => {
        const response = await apiService.get(`/fetch-all-users?userId=${user}`);
        setUsersList(response.data.data)
        inputRef.current.value = ''
    }

    /**
     * 
     * @param {*} data 
     */
    const showChat = (data) => {
        // console.log(data)
        setShowUserChat(2)
        setCurrentChatUserData(data)
        const conversationId = [data._id, localStorage.getItem('user_id'),].sort().join('_');
        setConversationId(conversationId)
    }

    /**
     * 
     * @param {*} newItems get selected friend list 
     */
    const updateItems = async (newItems) => {
        console.log(newItems)
        setSelectedUserForFriend(newItems);

        const response = await apiService.post(`/add-friend`, {
            user_id: localStorage.getItem('user_id'),
            arrayOfAddedUsersId: newItems
        });
        if (response.data?.code == 200) {
            enqueueSnackbar(response.data.message, { variant: "success" });
            modalCloseBtn.current.click()
            localStorage.setItem('initial_login', 2)
        }
    };

    /**
     * open user profile component
     */
    const showUserPorfile = () => {
        setShowUserChat(3)
    }


    /**
     * 
     */
    const goBack = () => {
        setShowUserChat(1)

    }



    const searchUser = useCallback(
        debounce(async (value) => {
            console.log("Received from child:", value);
            // if (!value) {
            //     setUsersList([]);
            //     return;
            // }
            try {
                setShowSkeleton(true)
                const response = await apiService.get(`/search-user?chr=${value} &userId=${user}`);
                setShowSkeleton(false)
                setUsersList(response.data.data?.alreadyFriends ? response.data.data?.alreadyFriends : response.data.data);
                setGlobalUsersList(response.data.data?.notFriends);
            } catch (error) {
                console.error("Error searching user:", error);
            }
        }, 2000),
        []
    );

    if (showUserChat == 1) {
        return (
            // <div className="col-lg-12 fom_data">
            <div className="chat_container bg-white rounded shadow-sm p-3 position-relative">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                    <h2 className="fw-bold text-primary mb-0">Chats</h2>
                    <div className="d-flex align-items-center">
                        <div
                            className="d-flex align-items-center rounded-pill px-3 py-2 shadow-sm"
                            style={{
                                maxWidth: "280px",
                                backgroundColor: "white",
                                border: "1px solid #dee2e6",
                                flexGrow: 1,
                            }}
                        >
                            {/* Search Icon */}
                            <i className="fa-solid fa-magnifying-glass text-muted me-2"></i>

                            {/* Custom Input */}
                            <Input
                                placeholder="Search user..."
                                inputRef={inputRef}
                                name="searchUser"
                                setFieldValue={searchUser}
                                paramToKnowComp={2}
                                type="text"
                                className="bg-transparent flex-grow-1"
                                style={{ outline: "none", boxShadow: "none" }}
                            />
                        </div>
                    </div>

                </div>
                {/* <CircularProgress color="inherit" /> */}

                {/* Chat List */}


                {showSkeleton ?
                    (
                        // Skeleton loader list
                        <div className="chat-list" style={{ maxHeight: "65vh", overflowY: "auto" }}>
                            {[...Array(6)].map((_, index) => (
                                <div
                                    key={index}
                                    className="user-card d-flex align-items-center p-2 mb-2 rounded"
                                    style={{
                                        background: "#fff",
                                        border: "1px solid #e0e0e0",
                                    }}
                                >
                                    {/* Skeleton Avatar */}
                                    <Skeleton
                                        variant="circular"
                                        width={45}
                                        height={45}
                                        className="me-3"
                                    />

                                    {/* Skeleton Text */}
                                    <div className="d-flex flex-column flex-grow-1">
                                        <Skeleton variant="text" width="60%" height={20} />
                                        <Skeleton variant="text" width="40%" height={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                    :
                    usersList.length > 0 || checkInitialLogin != 1 ? (
                        // Actual user list
                        <div className="chat-list" style={{ maxHeight: "65vh", overflowY: "auto" }}>
                            {usersList.map((user) => (
                                <div
                                    onClick={() => showChat(user)}
                                    key={user._id}
                                    className="user-card d-flex align-items-center p-2 mb-2 rounded"
                                    style={{
                                        cursor: "pointer",
                                        transition: "all 0.2s ease-in-out",
                                        background: "#fff",
                                        border: "1px solid #e0e0e0",
                                    }}
                                >
                                    {/* Avatar */}
                                    <div
                                        className="user-avatar me-3"
                                        style={{
                                            width: "45px",
                                            height: "45px",
                                            borderRadius: "50%",
                                            overflow: "hidden",
                                            border: "2px solid #007bff",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <img
                                            src={user.profile_img}
                                            alt={user.email}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* User Info */}
                                    <div className="d-flex flex-column">
                                        <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "15px" }}>
                                            {user.email.split("@")[0]}
                                        </h6>
                                        <small className="text-muted">Click to chat</small>
                                    </div>
                                </div>
                            ))}

                            {(globalUsersList && globalUsersList.length > 0) && <div className='fw-bold'>Global Search</div>}


                            {(globalUsersList && globalUsersList.length > 0) || usersList.length > 0 ? globalUsersList && globalUsersList.map((user) => (
                                <div
                                    onClick={() => showChat(user)}
                                    key={user._id}
                                    className="user-card d-flex align-items-center p-2 mb-2 rounded"
                                    style={{
                                        cursor: "pointer",
                                        transition: "all 0.2s ease-in-out",
                                        background: "#fff",
                                        border: "1px solid #e0e0e0",
                                    }}
                                >
                                    {/* Avatar */}
                                    <div
                                        className="user-avatar me-3"
                                        style={{
                                            width: "45px",
                                            height: "45px",
                                            borderRadius: "50%",
                                            overflow: "hidden",
                                            border: "2px solid #007bff",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <img
                                            src={user.profile_img}
                                            alt={user.email}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    </div>

                                    {/* User Info */}
                                    <div className="d-flex flex-column">
                                        <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "15px" }}>
                                            {user.email.split("@")[0]}
                                        </h6>
                                        <small className="text-muted">Click to chat</small>
                                    </div>
                                </div>
                            ))
                                :
                                <><NoDataFound /></>
                            }
                        </div>
                    ) : (
                        // Empty state
                        <div className="text-center mt-4">
                            <p className="fw-bold text-secondary">No chats available</p>
                            <div className="alert alert-info small mt-2 text-start">
                                <span className="fw-bold">💡 Tip:</span> First add a friend from{" "}
                                <b>World Chat</b>, or click <b>Add Friend</b> to search and connect with users.
                            </div>
                        </div>
                    )}



            </div>
            // </div>
        )
    } else if (showUserChat == 2) {
        return (
            <>
                <div className="chat_container position-relative">

                    <div className="chat_person_head d-flex justify-content-between align-items-center">
                        <div className="person_status_box d-flex justify-content-start align-items-center">
                            <h2 style={{ cursor: 'pointer' }} className="m-o person_name_head" onClick={goBack}>
                                <img style={{ height: '25px' }} src={myImage} alt="" />
                            </h2>
                            <div onClick={showUserPorfile} className="image_box">
                                <img src={currentChatUserData.profile_img} alt="" />
                            </div>
                            <div className="person_status d-block">
                                <h1 className="m-o person_name_head" >
                                    {getUserName()}
                                </h1>
                                <p className="last_seen">
                                    <i className="fa-solid fa-circle onlineDot"></i> Online
                                </p>
                            </div>
                        </div>
                    </div>
                    <Chat conversationDocRef={conversationDocRef} conversationId={conversationId} ref={ChatComponent} appendUserId={(e) => setShowUserChat(3)} ></Chat>
                </div>
            </>
        )
    } else if (showUserChat == 3) {
        return (
            <>
                <UserProfileView userData={currentChatUserData} setFieldValue={(val) => setShowUserChat(2)}> </UserProfileView>
            </>
        )
    }

}
