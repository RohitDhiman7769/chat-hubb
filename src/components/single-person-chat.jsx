import { addDoc, collection, onSnapshot, query, serverTimestamp, orderBy, doc } from 'firebase/firestore';
import { useEffect, useState, useRef } from "react";
import UserProfileView from "./userProfileView";
import apiService from "../apiService";
import Input from "./inputField";
import React from 'react';
import { db } from '../firebase-config';
import './single-person-chat.css'
import myImage from '../assets/back.png';
import Chat from './chat';
import PopUp from './popUp';


export default function SinglePersonChat() {
    const modalOpenBtn = useRef();
    const modalCloseBtn = useRef()
    const inputRef = useRef()
    const ChatComponent = useRef(null);
    const user = localStorage.getItem('user_id')
    const conversationDocRef = doc(db, "chat-hubb", "conversation")
    const [conversationId, setConversationId] = useState()

    const [listOfUsers, setListOfUsers] = useState([])
    const [selectedUserForFriend, setSelectedUserForFriend] = useState([])
    const [usersList, setUsersList] = useState([])
    const [showUserChat, setShowUserChat] = useState(1)
    // const [messages, setMessages] = useState([])
    // const [newMessage, setNewMessage] = useState("")
    const [currentChatUserData, setCurrentChatUserData] = useState()
    // const [currentUserId, setCurrentUserId] = useState(localStorage.getItem('user_id'))

  // Detect state change using useEffect
  useEffect(() => {
    console.log("Updated Value in useEffect:", showUserChat);
    
    if(showUserChat== 2 && ChatComponent.current){
        ChatComponent.current.callChatFunct();

    }
}, [showUserChat]);

    useEffect(() => {
        const checkInitialLogin = localStorage.getItem('initial_login')

        const fetchData = async () => {
            try {
                if (checkInitialLogin == 1) {
                    modalOpenBtn.current.click()
                    fetchAllUser()
                } else {
                    const response = await apiService.get(`/added-users-list?userId=${user}`);
                    setUsersList(response.data.data)

                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [])

    useEffect(() => {
        // console.log()
        console.log("Updated State:", listOfUsers);
       

    }, [listOfUsers]);


    const getUserName = () => {
        console.log('emial', currentChatUserData?.email)
        if (currentChatUserData?.email) {
            return currentChatUserData.email.split('@')[0]
        }
        return 'vishal singh chobber'

    }

    // /**
    //  * 
    //  * @param {*} value get input text to search user 
    //  */
    // const searchUser = async (value) => {
    //     console.log("Received from child:", value);
    //     const response = await apiService.get(`/search-user?chr=${value}`);
    //     setListOfUsers(response.data.data)
    // };

    // /**
    //  * 
    //  * @param {*} value get selected user id to check in array if user exist it will be remove otherwise it will be push into array
    //  */
    // const getSelectedAddedUserId = (value) => {
    //     setSelectedUserForFriend((prev) => {
    //         if (prev.includes(value)) {
    //             // If value exists, remove it
    //             return prev.filter((item) => item !== value);
    //         } else {
    //             // If value does not exist, add it
    //             return [...prev, value];
    //         }
    //     });
    // };

    /**
     * Hit request to send array of id into backend
     */
    // const addFriend = async () => {
    //     console.log(selectedUserForFriend)
    //     const response = await apiService.post(`/add-friend`, {
    //         user_id: localStorage.getItem('user_id'),
    //         arrayOfAddedUsersId: selectedUserForFriend
    //     });
    //     if (response.data?.code == 200) {
    //         modalCloseBtn.current.click()
    //         localStorage.setItem('initial_login', 2)
    //     }
    // };

    // /**
    //  * if user skip popup on click this function will be update into database
    //  */
    // const skipInitialAddPopUp = async () => {
    //     try {
    //         const response = await apiService.get(`/update-initial-status?userId=${user}`);
    //         localStorage.setItem('initial_login', 2)
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }

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
        console.log(showUserChat)
        // if (showUserChat == 2 && childRef.current) {
        //     // ChatComponent.current.childFunction();
        // } else {
        //     console.log("Child component is not rendered yet");
        // }
        console.log(ChatComponent)
        setConversationId(conversationId)
        // ChatComponent.current.childFunction()
        // const messagesCollectionRef = collection(conversationDocRef, conversationId);
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

    // const sendMessage = async () => {

    //     const conversationId = [currentChatUserData._id, localStorage.getItem('user_id')].sort().join('_')

    //     console.log(conversationId)
    //     const conversationData = {
    //         text: newMessage,
    //         name: localStorage.getItem('email').split('@')[0],
    //         createdAt: serverTimestamp(),
    //         user: localStorage.getItem('user_id'),
    //         image: localStorage.getItem('profile_img'),
    //         conversationId: conversationId
    //     }

    //     const messagesCollectionRef = collection(conversationDocRef, conversationId);
    //     await addDoc(messagesCollectionRef, conversationData)
    //     setNewMessage('')
    // }

    const showUserPorfile = () => {
        setShowUserChat(3)
    }


    // const formatTimestamp = (firebaseTimestamp, val) => {
    //     if (!firebaseTimestamp) return "";

    //     const date = new Date(firebaseTimestamp.seconds * 1000);
    //     return date.toLocaleString().split(',')[1]
    // };


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
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <p>No chat exist</p>
                                                    </div>
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

                {/* <button type="button" hidden ref={modalOpenBtn} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Launch demo modal
                </button> */}



                {/* <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Add Friend</h5>
                                <button type="button" onClick={skipInitialAddPopUp} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div style={{ display: 'block' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', }}>
                                        <Input placeholder={'Search user'} inputRef={inputRef} name={'searchUser'} setFieldValue={searchUser} paramToKnowComp={2} type={'text'} />
                                        <button onClick={fetchAllUser} type="button" className="btn-close" ></button>
                                    </div>
                                    {listOfUsers.map((user) => {
                                        return (
                                            <React.Fragment key={user._id}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid black' }}>
                                                    <div className="image_box">
                                                        <img className="rounded-circle" style={{ height: '80px', width: '80px', objectFit: 'cover' }} src={user.profile_img} alt="" />
                                                    </div>
                                                    <div className="person_status" style={{ paddingRight: '170px' }}>
                                                        <h4 className="m-0 person_name_head">
                                                            {user.email.split('@')[0]}
                                                        </h4>
                                                    </div>
                                                    <div style={{ display: 'flex' }}>
                                                        <Input
                                                            setFieldValue={(e) => getSelectedAddedUserId(user._id)}
                                                            paramToKnowComp={3}
                                                            type={"checkbox"}
                                                            name={user._id}
                                                            classname={"checkBox"}
                                                        />
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}

                                </div>     </div>
                            <div className="modal-footer">
                                <button type="button" ref={modalCloseBtn} hidden className="btn-close" data-bs-dismiss="modal" aria-label="Close">Save changes</button>
                                <button disabled={selectedUserForFriend.length < 1} onClick={addFriend}>Add {selectedUserForFriend != 0 && (selectedUserForFriend.length)}</button>
                            </div>
                        </div>
                    </div>
                </div> */}
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
                                                    <Chat conversationDocRef={conversationDocRef} conversationId={conversationId}  ref={ChatComponent} appendUserId={(e) => setShowUserChat(3)} ></Chat>

                                                    {/* <div className="chat_body ">


                                                         {
                                                            messages.map((mes) => (
                                                                <>
                                                                    {mes.user == currentUserId
                                                                        ?
                                                                        <div key={mes.id} className="right_chat chat_main d-flex justify-content-end align-items-end">
                                                                            <div className="chat_inner d-flex justify-content-start align-items-center">
                                                                                <div className="messsage">
                                                                                    {mes.text}
                                                                                </div>
                                                                                <span className="time">{formatTimestamp(mes.createdAt)}</span>
                                                                            </div>
                                                                            <div className="image_box">
                                                                                <img src={mes.image} alt="Avatar" />
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        <div key={mes.id} className="left_chat chat_main d-flex justify-content-start align-items-end">
                                                                            <div className="image_box">
                                                                                <img src={mes.image} alt="Avatar" />
                                                                            </div>
                                                                            <div className="chat_inner d-flex justify-content-start align-items-center">
                                                                                <div className="messsage">{mes.text}</div>
                                                                                <span className="time">{formatTimestamp(mes.createdAt)}</span>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </>
                                                            ))
                                                        } 
                                                    </div>*/}

                                                    {/* <div className="main_chat_send position-relative">
                                                        <div className="chat_send_box position-relative">
                                                            <div className="input_box">
                                                                <textarea type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="inPut_send" placeholder="Skriv meddelande..." rows="1"></textarea>
                                                            </div>
                                                            <div className="send_btns">
                                                                <div className="file_open">
                                                                    <label htmlFor="file_input">
                                                                        <i className="fa-solid fa-paperclip"></i>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        id="file_input"

                                                                        hidden
                                                                    />
                                                                </div>
                                                                <button className="send_chat" onClick={sendMessage}>
                                                                    <i className="fa-solid fa-paper-plane"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div> */}
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