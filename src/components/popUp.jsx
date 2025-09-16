import { useEffect, useState, useRef } from "react";
import Input from "./input_filed/inputField";
import apiService from "../apiService";
import React from 'react';

export default function PopUp({ refOpenModal,setListOfUsers, inputRef, refCloseModal, getAllUser, fetchUserList, listOfUsersToShow }) {
    const [selectedUserForFriend, setSelectedUserForFriend] = useState([])
    /**
         * if user skip popup on click this function will be update into database
         */
    const skipInitialAddPopUp = async () => {
        try {
            const response = await apiService.get(`/update-initial-status?userId=${user}`);
            localStorage.setItem('initial_login', 2)
        } catch (err) {
            console.log(err)
        }
    }



    /**
     * 
     * @param {*} value get selected user id to check in array if user exist it will be remove otherwise it will be push into array
     */
    const getSelectedAddedUserId = (value) => {
        setSelectedUserForFriend((prev) => {
            if (prev.includes(value)) {
                // If value exists, remove it
                return prev.filter((item) => item !== value);
            } else {
                // If value does not exist, add it
                return [...prev, value];
            }
        });
    };

    /**
     * 
     * @param {*} value get input text to search user 
     */
    const searchUser = async (value) => {
        console.log("Received from child:", value);
        const response = await apiService.get(`/search-user?chr=${value}`);
        console.log(response)
        setListOfUsers(response.data.data)
    };



    const addFriend = () => {
        console.log(selectedUserForFriend)
        fetchUserList(selectedUserForFriend)
        // creatRoom()
    }
    return (
        <>
            <button type="button" hidden ref={refOpenModal} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>

            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Friend</h5>
                            <button type="button" onClick={skipInitialAddPopUp} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'block' }}>
                                <div className="pop_up_search" style={{ display: 'flex', justifyContent: 'space-between', }}>
                                    <Input placeholder={'Search user'} inputRef={inputRef} name={'searchUser'} setFieldValue={searchUser} paramToKnowComp={2} type={'text'} />
                                    <button onClick={getAllUser} type="button" className={selectedUserForFriend.length > 0 ? 'check_btn color_check' : 'check_btn'} ><i className="fa-solid fa-square-check"></i></button>
                                </div>
                                {listOfUsersToShow?.map((user) => {
                                    return (
                                        <React.Fragment key={user._id}>

                                            <div className="user_parent position-relative">
                                                <Input
                                                    setFieldValue={(e) => getSelectedAddedUserId(user._id)}
                                                    paramToKnowComp={3}
                                                    type={"checkbox"}
                                                    name={user._id}
                                                    classname={"checkBox user_checkBox"}
                                                />
                                                <div className="user_list" style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid black' }}>
                                                    <div className="image_box">
                                                        <img className="rounded-circle" style={{ height: '80px', width: '80px', objectFit: 'cover' }} src={user.profile_img} alt="" />
                                                    </div>
                                                    <div className="person_status" style={{ paddingRight: '170px' }}>
                                                        <h4 className="m-0 person_name_head">
                                                            {user.email.split('@')[0]}
                                                        </h4>
                                                    </div>

                                                </div>

                                            </div>


                                        </React.Fragment>
                                    );
                                })}

                            </div>     </div>
                        <div className="modal-footer">
                            <button type="button" ref={refCloseModal} hidden className="btn-close" data-bs-dismiss="modal" aria-label="Close">Save changes</button>
                            <button disabled={selectedUserForFriend.length < 1} onClick={addFriend}>Add {selectedUserForFriend != 0 && (selectedUserForFriend.length)}</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}