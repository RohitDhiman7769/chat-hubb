import { useEffect, useState, useRef } from "react";
import Input from "./input_filed/inputField";
import apiService from "../apiService";
import React from 'react';

export default function PopUp({ refOpenModal, setListOfUsers, inputRef, refCloseModal, getAllUser, fetchUserList, listOfUsersToShow }) {
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
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content shadow-lg rounded-3">
            {/* Header */}
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold" id="exampleModalLabel">
                Add Friend
              </h5>
              <button
                type="button"
                onClick={skipInitialAddPopUp}
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">
              {/* Search + Check Button */}
              <div className="d-flex align-items-center mb-3">
                <div className="flex-grow-1 me-2">
                  <Input
                    placeholder="Search user..."
                    inputRef={inputRef}
                    name="searchUser"
                    setFieldValue={searchUser}
                    paramToKnowComp={2}
                    type="text"
                  />
                </div>
                <button
                  onClick={getAllUser}
                  type="button"
                  className={`btn ${selectedUserForFriend.length > 0
                      ? "btn-success"
                      : "btn-outline-secondary"
                    }`}
                >
                  <i className="fa-solid fa-square-check"></i>
                </button>
              </div>

              {/* Users List */}
              {listOfUsersToShow.length === 0 ? (
                <p className="text-center text-muted">No users found</p>
              ) : (
                listOfUsersToShow.map((user) => (
                  <div
                    key={user._id}
                    className="user-card d-flex align-items-center justify-content-between p-2 mb-2 rounded border"
                    style={{
                      cursor: "pointer",
                      transition: "0.2s",
                    }}
                  >
                    {/* Checkbox */}
                    <Input
                      setFieldValue={() => getSelectedAddedUserId(user._id)}
                      paramToKnowComp={3}
                      type="checkbox"
                      name={user._id}
                      classname="form-check-input me-2"
                    />

                    {/* Avatar + Info */}
                    <div className="d-flex align-items-center flex-grow-1 ms-2">
                      <img
                        className="rounded-circle me-3"
                        style={{
                          height: "60px",
                          width: "60px",
                          objectFit: "cover",
                          border: "2px solid #007bff",
                        }}
                        src={user.profile_img}
                        alt={user.email}
                      />
                      <h6 className="mb-0 fw-semibold text-dark">
                        {user.email.split("@")[0]}
                      </h6>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="modal-footer border-0">
              <button
                ref={refCloseModal}
                hidden
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                disabled={selectedUserForFriend.length < 1}
                onClick={addFriend}
                className="btn btn-primary"
              >
                Add {selectedUserForFriend.length > 0 && `(${selectedUserForFriend.length})`}
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}