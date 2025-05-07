import { addDoc, collection, onSnapshot, deleteDoc, query, serverTimestamp, orderBy, doc } from 'firebase/firestore';
import { ReportUserId, fetchParticularUserProfile } from '../../utils/chat-funtion';
import { useEffect, useState, useRef } from 'react';
import { db } from '../../firebase-config';
import UserProfileView from '../user_profile/userProfileView';
import apiService from '../../apiService';
import './wall.css';
import Chat from '../chat/chat';
function Wall() {
    const ChatComponent = useRef()
    const conversationId = [localStorage.getItem('user_id')].sort().join('_')
    const [isShowUserProfileComponent, setShowUserProfileComponent] = useState(true)
    const [userProfileViewData, setUserProfileViewData] = useState()
    const conversationDocRef = doc(db, "chat-hubb", "wall");

        useEffect(() => {
            console.log(conversationId);
            if (ChatComponent.current) {
                ChatComponent.current.callChatFunct()
    
            }
        }, [conversationId])

    /**
     * 
     * @param {*} data fetch user profile for view
     */
    const showUserProfileComp = async (data) => {
        console.log(data)
        try {
            const response = fetchParticularUserProfile(data);
            console.log(response)
            if (response.status == 200) {
                setUserProfileViewData(response.data.data)
                setShowUserProfileComponent(false)
            }
        } catch (err) {
            console.log(err)
        }
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
                                                    <h4 className="m-o person_name_head">
                                                        Wall
                                                    </h4>
                                                </div>
                                            </div>
                                            <div className="dropdown setting_drop three_dot seeting_btn_mobile">
                                                <a className="btn" href="javascript:void(0)" role="button" data-bs-toggle="modal"
                                                    data-bs-target="#selectTag" aria-expanded="false">

                                                    <img className="threeDOt" src="assets/images/3dot.svg" alt="" />
                                                </a>
                                            </div>
                                        </div>
                                            <Chat paramToKnowComponent={2} conversationDocRef={conversationDocRef} conversationId={conversationId} ref={ChatComponent} appendUserId={(e) => showUserProfileComp(e)} ></Chat>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );

    } else {
        return (
            <UserProfileView userData={userProfileViewData}></UserProfileView>
        )
    }

}
export default Wall;
