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
import { useSnackbar } from "notistack";

// import circular
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
    const { enqueueSnackbar } = useSnackbar();

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


    /**
     * fetch added user list
     */
    const fetchData = async (checkInitialLogin) => {
        try {
            fetchAllUser()
            if (checkInitialLogin == 1) {
                modalOpenBtn.current.click()
                localStorage.setItem('initial_login', 2)

            } else {
                const response = await apiService.get(`/added-users-list?userId=${user}`);
                setShowSpinner(false)
                setUsersList(response.data.data)

            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    /**
     * 
     * @returns split user name from email
     */
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
        const response = await apiService.get(`/fetch-all-users?userId=${user}`);
        setListOfUsers(response.data.data)
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

    if (showUserChat == 1) {
        return (
            <>
                {/* <section className="chat_main_section py-4" style={{ minHeight: "100vh" }}>
                    <div className="container-fluid">
                        <div className="container">
                            <div className="main_form">
                                <div className="row form_row"> */}
                <div className="col-lg-12 fom_data">
                    <div className="chat_container bg-white rounded shadow-sm p-3 position-relative">

                        {/* Header */}
                        <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
                            <h2 className="fw-bold text-primary mb-0">Chats</h2>
                            <button
                                onClick={() => modalOpenBtn.current.click()}
                                className="btn btn-sm btn-primary rounded-pill px-3"
                            >
                                + Add Friend
                            </button>
                        </div>
                        {/* <CircularProgress color="inherit" /> */}

                        {/* Chat List */}
                        {usersList.length > 0 ? (
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
                            </div>
                        ) : (
                            <div className="text-center mt-4">
                                <p className="fw-bold text-secondary">No chats available</p>
                                <div className="alert alert-info small mt-2 text-start">
                                    <span className="fw-bold">💡 Tip:</span> First add a friend from <b>World Chat</b>,
                                    or click <b>Add Friend</b> to search and connect with users.
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                {/* </div>
                            </div>
                        </div>
                    </div>
                </section> */}


                <PopUp listOfUsersToShow={listOfUsers} setListOfUsers={setListOfUsers} inputRef={inputRef} fetchUserList={updateItems} getAllUser={fetchAllUser} refOpenModal={modalOpenBtn} refCloseModal={modalCloseBtn} />

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

























// import { addDoc, collection, onSnapshot, query, serverTimestamp, orderBy, doc } from 'firebase/firestore';
// import { useEffect, useState, useRef } from "react";
// import UserProfileView from "../user_profile/userProfileView";
// import apiService from "../../apiService";
// import React from 'react';
// import { db } from '../../firebase-config';
// import './single-person-chat.css'
// // import myImage from '../assets/back.png';
// import myImage from '../../assets/back.png';
// import { useFormik } from "formik";
// import Chat from '../chat/chat';
// import PopUp from '../popUp';
// import '../newChat.css';
// // import Input from "./input_filed/inputField";
// import Input from "../input_filed/inputField";

// export default function SinglePersonChat() {
//     const modalOpenBtn = useRef();
//     const modalCloseBtn = useRef()
//     const inputRef = useRef()
//     const ChatComponent = useRef(null);
//     const user = localStorage.getItem('user_id')
//     const conversationDocRef = doc(db, "chat-hubb", "conversation")
//     const [conversationId, setConversationId] = useState()
//     const [showSpinner, setShowSpinner] = useState(true)
//     const [listOfUsers, setListOfUsers] = useState([])
//     const [selectedUserForFriend, setSelectedUserForFriend] = useState([])
//     const [usersList, setUsersList] = useState([])
//     const [showUserChat, setShowUserChat] = useState(1)
//     const [currentChatUserData, setCurrentChatUserData] = useState()

//     useEffect(() => {
//         const checkInitialLogin = localStorage.getItem('initial_login')
//         fetchData(checkInitialLogin);
//     }, [])

//     useEffect(() => {
//     }, [listOfUsers]);


//     useEffect(() => {
//         // if (showUserChat == 2 && ChatComponent.current) {
//         //     ChatComponent.current.callChatFunct();
//         // }
//     }, [showUserChat]);


//     /**
//      * fetch added user list
//      */
//     const fetchData = async (checkInitialLogin) => {
//         try {
//             fetchAllUser()
//             if (checkInitialLogin == 1) {
//                 modalOpenBtn.current.click()
//                 localStorage.setItem('initial_login', 2)

//             } else {
//                 const response = await apiService.get(`/added-users-list?userId=${user}`);
//                 setShowSpinner(false)
//                 setUsersList(response.data.data)

//             }
//         } catch (error) {
//             console.error("Error fetching data:", error);
//         }
//     };

//     /**
//      *
//      * @returns split user name from email
//      */
//     const getUserName = () => {
//         console.log('emial', currentChatUserData?.email)
//         if (currentChatUserData?.email) {
//             return currentChatUserData.email.split('@')[0]
//         }
//         return 'vishal singh chobber'

//     }

//     /**
//      * fetch all users from backend
//      */
//     const fetchAllUser = async () => {
//         const response = await apiService.get(`/fetch-all-users?userId=${user}`);
//         setListOfUsers(response.data.data)
//         inputRef.current.value = ''
//     }

//     /**
//      *
//      * @param {*} data
//      */
//     const showChat = (data) => {
//         // console.log(data)
//         setShowUserChat(2)
//         setCurrentChatUserData(data)
//         const conversationId = [data._id, localStorage.getItem('user_id'),].sort().join('_');
//         setConversationId(conversationId)
//     }

//     /**
//      *
//      * @param {*} newItems get selected friend list
//      */
//     const updateItems = async (newItems) => {
//         console.log(newItems)
//         setSelectedUserForFriend(newItems);

//         const response = await apiService.post(`/add-friend`, {
//             user_id: localStorage.getItem('user_id'),
//             arrayOfAddedUsersId: newItems
//         });
//         if (response.data?.code == 200) {
//             modalCloseBtn.current.click()
//             localStorage.setItem('initial_login', 2)
//         }
//     };

//     /**
//      * open user profile component
//      */
//     const showUserPorfile = () => {
//         setShowUserChat(3)
//     }


//     /**
//      *
//      */
//     const goBack = () => {
//         setShowUserChat(1)

//     }

//     /**
//  *
//  * @param {*} value get input text to search user
//  */
//     const searchUser = async (value) => {
//         console.log("Received from child:", value);
//         const response = await apiService.get(`/search-user?chr=${value}`);
//         console.log(response)
//         setListOfUsers(response.data.data)
//     };




//     if (showUserChat == 1) {
//         return (
//             <>
//                 <section className="chat_main_section " >
//                     <div className="container-fluid">
//                         <div className="container">
//                             <div className="main_form">
//                                 <div className="row form_row">
//                                     <div className="col-lg-12 fom_data">
//                                         <div className="chat_container bg-white rounded shadow-sm p-3 position-relative">

//                                             {/* Header */}
//                                             <div className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-3">
//                                                 <h2 className="fw-bold text-primary mb-0">Chats</h2>
//                                                 {/* <button
//                                                     onClick={() => modalOpenBtn.current.click()}
//                                                     className="btn btn-sm btn-primary rounded-pill px-3"
//                                                 >
//                                                     + Add Friend
//                                                 </button> */}
//                                                 <div className='d-flex align-items-center gap-2'>

//                                                     <div>
//                                                         <button
//                                                             // onClick={() => modalOpenBtn.current.click()}
//                                                             className="btn btn-sm btn-primary rounded-pill px-3"
//                                                         >
//                                                             Chat bot
//                                                         </button>
//                                                     </div>

//                                                     <div>
//                                                         <Input
//                                                             placeholder="Search user..."
//                                                             inputRef={inputRef}
//                                                             name="searchUser"
//                                                             setFieldValue={searchUser}
//                                                             paramToKnowComp={2}
//                                                             type="text"
//                                                             classname="form-control border-0"
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>

//                                             {/* Chat List */}
//                                             {usersList.length > 0 ? (
//                                                 <div className="chat-list" style={{ maxHeight: "65vh", overflowY: "auto" }}>
//                                                     {usersList.map((user) => (
//                                                         <div
//                                                             onClick={() => showChat(user)}
//                                                             key={user._id}
//                                                             className="user-card d-flex align-items-center p-2 mb-2 rounded"
//                                                             style={{
//                                                                 cursor: "pointer",
//                                                                 transition: "all 0.2s ease-in-out",
//                                                                 background: "#fff",
//                                                                 border: "1px solid #e0e0e0",
//                                                             }}
//                                                         >
//                                                             {/* Avatar */}
//                                                             <div
//                                                                 className="user-avatar me-3"
//                                                                 style={{
//                                                                     width: "45px",
//                                                                     height: "45px",
//                                                                     borderRadius: "50%",
//                                                                     overflow: "hidden",
//                                                                     border: "2px solid #007bff",
//                                                                     flexShrink: 0,
//                                                                 }}
//                                                             >
//                                                                 <img
//                                                                     src={user.profile_img}
//                                                                     alt={user.email}
//                                                                     style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                                                                 />
//                                                             </div>

//                                                             {/* User Info */}
//                                                             <div className="d-flex flex-column">
//                                                                 <h6 className="mb-0 fw-bold text-dark" style={{ fontSize: "15px" }}>
//                                                                     {user.email.split("@")[0]}
//                                                                 </h6>
//                                                                 <small className="text-muted">Click to chat</small>
//                                                             </div>
//                                                         </div>
//                                                     ))}
//                                                 </div>
//                                             ) : (
//                                                 <div className="text-center mt-4">
//                                                     <p className="fw-bold text-secondary">No chats available</p>
//                                                     <div className="alert alert-info small mt-2 text-start">
//                                                         <span className="fw-bold">💡 Tip:</span> First add a friend from <b>World Chat</b>,
//                                                         or click <b>Add Friend</b> to search and connect with users.
//                                                     </div>
//                                                 </div>
//                                             )}

//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>


//                 {/* <PopUp listOfUsersToShow={listOfUsers} setListOfUsers={setListOfUsers} inputRef={inputRef} fetchUserList={updateItems} getAllUser={fetchAllUser} refOpenModal={modalOpenBtn} refCloseModal={modalCloseBtn} /> */}

//             </>

//         )
//     } else if (showUserChat == 2) {
//         return (
//             <>
//                 <section>
//                     <div className="container py-5">
//                         <section className="chat_main_section">
//                             <div className="container-fluid">
//                                 <div className="container">
//                                     <div className="main_form">
//                                         <div className="row form_row">
//                                             <div className="col-lg-12 fom_data ">
//                                                 <div className="chat_container position-relative">

//                                                     <div className="chat_person_head d-flex justify-content-between align-items-center">
//                                                         <div className="person_status_box d-flex justify-content-start align-items-center">
//                                                             <h2 style={{ cursor: 'pointer' }} className="m-o person_name_head" onClick={goBack}>
//                                                                 <img style={{ height: '25px' }} src={myImage} alt="" />
//                                                             </h2>
//                                                             <div onClick={showUserPorfile} className="image_box">
//                                                                 <img src={currentChatUserData.profile_img} alt="" />
//                                                             </div>
//                                                             <div className="person_status d-block">
//                                                                 <h1 className="m-o person_name_head" >
//                                                                     {getUserName()}
//                                                                 </h1>
//                                                                 <p className="last_seen">
//                                                                     <i className="fa-solid fa-circle onlineDot"></i> Online
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                     </div>
//                                                     <Chat conversationDocRef={conversationDocRef} conversationId={conversationId} ref={ChatComponent} appendUserId={(e) => setShowUserChat(3)} ></Chat>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </section>
//                     </div>
//                 </section>
//             </>
//         )
//     } else if (showUserChat == 3) {
//         return (
//             <>
//                 <UserProfileView userData={currentChatUserData} setFieldValue={(val) => setShowUserChat(2)}> </UserProfileView>
//             </>
//         )
//     }

// }

