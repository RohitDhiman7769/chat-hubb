import { addDoc, collection, onSnapshot, query, serverTimestamp, orderBy, doc } from 'firebase/firestore';
import { useEffect, useState, useRef } from "react";
import UserProfileView from "../user_profile/userProfileView";
import apiService from "../../apiService";
import React from 'react';
import { db } from '../../firebase-config';
import './single-person-chat.css'
// import myImage from '../assets/back.png';
import myImage from '../../assets/back.png';
import { useFormik } from "formik";
import Chat from '../chat/chat';
import PopUp from '../popUp';
import '../newChat.css';

export default function SinglePersonChat() {
    const modalOpenBtn = useRef();
    const modalCloseBtn = useRef()
    const inputRef = useRef()
    const ChatComponent = useRef(null);
    const user = localStorage.getItem('user_id')
    const conversationDocRef = doc(db, "chat-hubb", "conversation")
    const [conversationId, setConversationId] = useState()
    const [showSpinner, setShowSpinner] = useState(true)
    const [listOfUsers, setListOfUsers] = useState([])
    const [selectedUserForFriend, setSelectedUserForFriend] = useState([])
    const [usersList, setUsersList] = useState([])
    const [showUserChat, setShowUserChat] = useState(1)
    const [currentChatUserData, setCurrentChatUserData] = useState()

    useEffect(() => {
        const checkInitialLogin = localStorage.getItem('initial_login')
        fetchData(checkInitialLogin);
    }, [])

    useEffect(() => {
    }, [listOfUsers]);


    useEffect(() => {
        if (showUserChat == 2 && ChatComponent.current) {
            ChatComponent.current.callChatFunct();
        }
    }, [showUserChat]);

    // useEffect(() => {
    //     const socket = new WebSocket('ws://localhost:8000/api/users/ws');

    //     console.log(socket)
    //     socket.onopen = () => {
    //         console.log('Connected to WebSocket');
    //     };

    //     socket.onmessage = (event) => {
    //         console.log('Message from server:', event.data);

    //         if (event.data === "Database changed!") {
    //             // 🔥 Now call your API to fetch latest data
    //             fetch('http://localhost:8000/api/users/simulate_db_change')
    //                 .then(res => res.json())
    //                 .then(data => {
    //                     console.log('Fetched new data:', data);
    //                     // Update your UI state here
    //                 });
    //         }
    //     };

    //     socket.onclose = () => {
    //         console.log('WebSocket connection closed');
    //     };

    //     return () => {
    //         socket.close();
    //     };
    // }, [])


    /**
     * fetch added user list
     */
    const fetchData = async (checkInitialLogin) => {
        try {
            if (checkInitialLogin == 1) {
                modalOpenBtn.current.click()
                fetchAllUser()
            } else {
                const response = await apiService.get(`/added-users-list?userId=${user}`);
                setShowSpinner(false)
                setUsersList(response.data.data)

            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const getUserName = () => {
        console.log('emial', currentChatUserData?.email)
        if (currentChatUserData?.email) {
            return currentChatUserData.email.split('@')[0]
        }
        return 'vishal singh chobber'

    }

    /**
     * fetch all users from backend
     */
    const fetchAllUser = async () => {
        const response = await apiService.get(`/fetch-all-users?userId${user}`);
        setListOfUsers(response.data.data)
        inputRef.current.value = ''
    }

    const showChat = (data) => {
        console.log(data)
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
            modalCloseBtn.current.click()
            localStorage.setItem('initial_login', 2)
        }
    };

    const showUserPorfile = () => {
        setShowUserChat(3)
    }



    const goBack = () => {
        setShowUserChat(1)

    }

    if (showUserChat == 1) {
        return (
            <> 
                <section className="chat_main_section">
                    <div className="container-fluid">
                        <div className="container">
                            <div className="main_form">
                                <div className="row form_row">
                                    <div className="col-lg-12 fom_data ">
                                        <div className="chat_container position-relative">
                                            <h2 style={{ paddingTop: '20px', paddingLeft: '25px' }}>Chats</h2>
                                            <div className="chat_person_head  ">

                                                {showSpinner ?
                                                    <>
                                                        <div className="d-flex justify-content-center main_spinner_box">
                                                            <div className="spinner-border" role="status">
                                                                <span className="visually-hidden">Loading...</span>
                                                            </div>
                                                        </div>
                                                    </>
                                                    :
                                                    <>
                                                        {usersList.length > 0 ?
                                                            usersList.map((user) => {
                                                                return (
                                                                    <div onClick={() => showChat(user)} key={user._id} style={{ margin: '2px', border: '1px solid black' }} className="person_status_box d-flex justify-content-start align-items-center ">
                                                                        <div className="image_box">
                                                                            <img src={user.profile_img} alt="" />
                                                                        </div>
                                                                        <div className="person_status d-block">
                                                                            <h4 className="m-o person_name_head">
                                                                                {user.email.split('@')[0]}
                                                                            </h4>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                            :
                                                            <>
                                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                                    <p>No chat exist</p>


                                                                </div>
                                                                <div>
                                                                    <span style={{ fontWeight: 700 }}>Note:</span> <span>First add friend from world chat or Search user name</span>
                                                                </div>
                                                            </>
                                                        }
                                                    </>

                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <PopUp listOfUsersToShow={listOfUsers} inputRef={inputRef} fetchUserList={updateItems} getAllUser={fetchAllUser} refOpenModal={modalOpenBtn} refCloseModal={modalCloseBtn} />

            </>

        )
    } else if (showUserChat == 2) {
        return (
            <>
                <section>
                    <div className="container py-5">
                        <section className="chat_main_section">
                            <div className="container-fluid">
                                <div className="container">
                                    <div className="main_form">
                                        <div className="row form_row">
                                            <div className="col-lg-12 fom_data ">
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </section>
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