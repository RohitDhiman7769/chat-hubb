
import { addDoc, collection, onSnapshot, deleteDoc, query, serverTimestamp, orderBy, doc } from 'firebase/firestore';
import { useState, useRef, useEffect, use } from "react";
import Input from "./inputField";
import * as Yup from "yup";
import apiService from "../apiService";
import.meta.env.VITE_API_KEY
import AWS from "aws-sdk";
import './room-chat.css';
import './newChat.css';
import React from 'react';
import PopUp from "./popUp";
import { addImageInS3Bucket } from "../utils/chat-funtion";
import { db } from "../firebase-config";
import Chat from './chat';
import myImage from '../assets/back.png';

function RoomChat() {
    const modalOpenBtn = useRef();
    const inputRef = useRef()
    const modalCloseBtn = useRef()
    const ChatComponent = useRef()
    const conversationDocRef = doc(db, "chat-hubb", "rooms");
    const [currentUserId, setCurrentUserId] = useState(localStorage.getItem("user_id"))
    const [roomName, setRoomName] = useState()
    const [showRoomCreatInput, setShowRoomCreatInput] = useState(false)
    const [roomMember, setRoomMember] = useState([])
    const [showChatComp, setShowChatComp] = useState(1)
    const [roomList, setRoomList] = useState([])
    const [selecetedRoomImage, setSelecetedRoomImage] = useState(null)
    const [roomType, setRoomType] = useState()
    const [listOfUsers, setListOfUsers] = useState([])
    const [currentOpenedRoomDetails, setCurrentOpenedRoomDetails] = useState()
    const [conversationId, setConversationId] = useState()
    const [showSpinner, setShowSpinner] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                fetchUserFriends()

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Runs only once when the component mounts



    useEffect(() => {
        console.log(currentOpenedRoomDetails);
    }, [currentOpenedRoomDetails])

    useEffect(() => {
        console.log(listOfUsers);
    }, [listOfUsers])

    useEffect(() => {
        console.log(conversationId);
        if (ChatComponent.current) {
            ChatComponent.current.callChatFunct()

        }
    }, [conversationId])

    // ChatComponent

    const fetchUserFriends = async () => {
        try {
            const getRoomList = await apiService.get(`/room-list?userId=${currentUserId}`);
            setShowSpinner(false)
            setRoomList(getRoomList.data.data)
        } catch (err) {
            console.log(err)
        }
    }

    /**
     * update room name state
     */
    const getRoomName = async (data) => {
        const image = await addImageInS3Bucket(selecetedRoomImage)
        data.push(currentUserId)
        console.log(data)
        try {
            const response = await apiService.post(`/creat-room`, {
                'userId': currentUserId,
                'roomName': roomName,
                'roomType': roomType,
                'roomImgIcon': image,
                'roomMembersIds': data
            });
            setRoomList(response.data.room_list)

            modalCloseBtn.current.click()
            setShowChatComp(2)
        } catch (err) {

        }
    }

    /**
     * 
     * @param {*} id get room chat based on id
     */
    const getAllChatOnRoomId = async (data) => {
        setCurrentOpenedRoomDetails(data)
        setShowChatComp(2)
        setConversationId(data?.room_id)
    }


    const getUserList = async () => {
        console.log(roomType)
        if (roomType == 2) {
            try {
                const response = await apiService.get(`/fetch-all-users?userId${currentUserId}`);
                setListOfUsers(response.data.data)
                inputRef.current.value = ''
            } catch (err) {
                console.log(err)
            }

        } else {
            try {
                const getAddedFriendList = await apiService.get(`/added-users-list?userId=${currentUserId}`);
                setListOfUsers(getAddedFriendList.data.data)
                console.log(listOfUsers)
            } catch (err) {
                console.log(err)
            }
        }
        modalOpenBtn.current.click()
    }




    const openGroupInfo = () => {
        setShowChatComp(3)
    }



    if (showChatComp == 1) {
        return (
            <>
                <section className="chat_main_section">
                    <div className="container-fluid">
                        <div className="container">
                            <div className="main_form">
                                <div className="row form_row">
                                    <div className="col-lg-12 fom_data ">
                                        <div className="chat_container position-relative">
                                            <div className="chat_person_head d-flex justify-content-between align-items-center">
                                                <div>
                                                    <label>Search room: </label>
                                                    <Input type={Text} name={'searchRoom'} placeholder={'Enter room name'} setFieldValue={setRoomName} paramToKnowComp={2} />
                                                </div>
                                                <div>
                                                    <label>Creat room: </label>
                                                    <p onClick={() => setShowRoomCreatInput(true)}>+</p>
                                                </div>


                                            </div>
                                            <h1>{showRoomCreatInput}</h1>

                                            {showRoomCreatInput == false ?
                                                <>
                                                    {showSpinner ?
                                                        <>
                                                            <div class="d-flex justify-content-center">
                                                                <div class="spinner-border" role="status">
                                                                    <span class="visually-hidden">Loading...</span>
                                                                </div>
                                                            </div>

                                                        </>
                                                        :
                                                        <div className="chat_person_head  ">
                                                            {roomList.map((room) => (
                                                                <div key={room.room_id} style={{ display: 'flex' }} className="person_status_box d-flex justify-content-start align-items-center ">
                                                                    <div onClick={() => getAllChatOnRoomId(room)} className="roomNameBox">
                                                                        <div className="image_box">
                                                                            <img src={room.image} alt="" />
                                                                        </div>
                                                                        <h1 style={{ marginLeft: '20px' }}>{room.room_name}</h1>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    }
                                                </>


                                                :

                                                (<div className="chat_body ">
                                                    {showRoomCreatInput ?
                                                        <div style={{ display: 'block', justifyContent: 'center', marginLeft: '236px', marginTop: '100px' }}>
                                                            <div>
                                                                <label style={{ marginLeft: '16px' }}>Enter room name : </label>
                                                                <Input type={Text} name={'roomchat'} placeholder={'Enter room name'} setFieldValue={setRoomName} paramToKnowComp={2} />
                                                            </div>

                                                            <div style={{ marginTop: '10px' }}>
                                                                <label>Room profile image : </label>
                                                                <input type="file" name="profilePicture" onChange={(event) => {
                                                                    setSelecetedRoomImage(event.currentTarget.files[0]);
                                                                }} className="password" />
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '300px' }}>
                                                                <label style={{ cursor: 'pointer' }}><Input type={'radio'} name={'check'} setFieldValue={(e) => setRoomType(1)} paramToKnowComp={3} />Private</label>
                                                                <label style={{ cursor: 'pointer' }}><Input type={'radio'} name={'check'} setFieldValue={(e) => setRoomType(2)} paramToKnowComp={3} />Public</label>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'center', width: '300px', marginTop: '10px' }}>
                                                                <button onClick={getUserList} disabled={roomName === ''}>Add Member</button>
                                                                {/* <button onClick={getRoomName} disabled={roomName === ''}>Add Member</button> */}
                                                            </div>
                                                        </div>
                                                        :
                                                        <div style={{ display: 'flex', justifyContent: 'center' }} >
                                                            <h2>No room exisst</h2>
                                                        </div>
                                                    }
                                                </div>)
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <PopUp listOfUsersToShow={listOfUsers} inputRef={inputRef} fetchUserList={getRoomName} getAllUser={getUserList} refOpenModal={modalOpenBtn} refCloseModal={modalCloseBtn} />
            </>
        )
    } else if (showChatComp == 2) {


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
                                                <div onClick={openGroupInfo} className="image_box">
                                                    <img src={currentOpenedRoomDetails?.image} alt="" />
                                                </div>
                                                <div onClick={openGroupInfo} className="person_status">
                                                    <h4 className="m-o person_name_head">
                                                        {currentOpenedRoomDetails?.room_name}
                                                    </h4>
                                                </div>
                                            </div>


                                            <div className="dropdown setting_drop three_dot seeting_btn_desktop">
                                                <a className="btn" href="javascript:void(0)" role="button" data-bs-toggle="dropdown"
                                                    aria-expanded="false">
                                                    <i className="fa-solid fa-ellipsis-vertical"></i>
                                                    {/* <img className="threeDOt" src="assets/images/3dot.svg" alt="" /> */}
                                                </a>

                                                <ul className="dropdown-menu">
                                                    <li>
                                                        <a className="dropdown-item" href="javascript:void(0)" data-bs-toggle="modal"
                                                            data-bs-target="#chat_support"><img src="assets/images/customer-contact.svg" alt="" />
                                                            Delete Room </a>
                                                    </li>
                                                    <li>
                                                        <a className="dropdown-item delete_item" href="javascript;void(0)" data-bs-toggle="modal"
                                                            data-bs-target="#delete_chat">
                                                            <img src="assets/images/delete.svg" alt="" />
                                                            Clear all Chat</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* <Chat appendUserId={(e) => setShowUserChat(e)} ></Chat> */}
                                        <Chat conversationDocRef={conversationDocRef} conversationId={conversationId} ref={ChatComponent} appendUserId={(e) => setShowUserChat(e)} ></Chat>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    } else if (showChatComp == 3) {
        return (
            <section className="chat_main_section">
                <div className="container-fluid">
                    <div className="container">

                        <div className="main_form">
                            <div className="row form_row">


                                <div className="col-lg-12 fom_data ">

                                    <div className="chat_container position-relative">
                                        <div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                                <div className="person_status">
                                                    <img style={{ height: '25px' }} src={myImage} alt="" />

                                                    <h2 style={{ fontWeight: '700', marginLeft: '15px', marginTop: '7px' }} className="m-o person_name_head">
                                                        Room Info
                                                    </h2>
                                                    <br />


                                                </div>
                                                <div className="dropdown setting_drop three_dot seeting_btn_desktop">
                                                    <a className="btn" href="javascript:void(0)" role="button" data-bs-toggle="dropdown"
                                                        aria-expanded="false">
                                                        <i className="fa-solid fa-ellipsis-vertical" style={{ marginTop: '10px' }}></i>
                                                        {/* <img className="threeDOt" src="assets/images/3dot.svg" alt="" /> */}
                                                    </a>

                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <a className="dropdown-item" href="javascript:void(0)" data-bs-toggle="modal"
                                                                data-bs-target="#chat_support"><img src="assets/images/customer-contact.svg" alt="" />
                                                                Clear all chat</a>
                                                        </li>
                                                        <li>
                                                            <a className="dropdown-item delete_item" href="javascript;void(0)" data-bs-toggle="modal"
                                                                data-bs-target="#delete_chat">
                                                                <img src="assets/images/delete.svg" alt="" />
                                                                Delete room</a>
                                                        </li>

                                                    </ul>
                                                </div>
                                            </div>

                                            <div>
                                                <div>
                                                    <div className="image_box" style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <img style={{ height: '100px', width: '100px' }} src={myImage} alt="" />
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <h2>Room Name</h2>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '300px' }}>
                                                        <label style={{ cursor: 'pointer' }}><Input type={'radio'} name={'check'} setFieldValue={(e) => setRoomType(1)} paramToKnowComp={3} />Private</label>
                                                        <label style={{ cursor: 'pointer' }}><Input type={'radio'} name={'check'} setFieldValue={(e) => setRoomType(2)} paramToKnowComp={3} />Public</label>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div class="dropdown">
                                                        <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                            Dropdown button
                                                        </button>
                                                        <ul class="dropdown-menu">
                                                            <li><a class="dropdown-item"><button onClick={() => console.log('worrking')}> ok</button></a></li>
                                                            <li><a class="dropdown-item">Another action</a></li>
                                                            <li><a class="dropdown-item">Something else here</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );

    }
}

export default RoomChat;
