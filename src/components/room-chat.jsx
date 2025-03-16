// import { useState } from "react";
// import { useFormik } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import Input from "./inputField"; // Ensure Input is properly imported
import './newChat.css';


import './room-chat.css';

function RoomChat() {
    return (
        <section>
            <div className="container py-5">
                {/* <div className="row d-flex justify-content-center">
                    <div className="col-md-8 col-lg-6 col-xl-4">
                        <div className="card" id="chat1" style={{ borderRadius: "15px" }}>
                            <div
                                className="card-header d-flex justify-content-between align-items-center p-3 bg-info text-white border-bottom-0"
                                style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}>
                                <i className="fas fa-angle-left"></i>
                                <p className="mb-0 fw-bold">Live chat</p>
                                <i className="fas fa-times"></i>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-row justify-content-start mb-4">
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                        alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                    <div className="p-3 ms-3" style={{ borderRadius: "15px", backgroundColor: "rgba(57, 192, 237, 0.2)" }}>
                                        <p className="small mb-0">Hello and thank you for visiting MDBootstrap. Please click the video below.</p>
                                    </div>
                                </div>

                                <div className="d-flex flex-row justify-content-end mb-4">
                                    <div className="p-3 me-3 border bg-body-tertiary" style={{ borderRadius: "15px" }}>
                                        <p className="small mb-0">Thank you, I really like your product.</p>
                                    </div>
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                                        alt="avatar 2" style={{ width: "45px", height: "100%" }} />
                                </div>

                                <div className="d-flex flex-row justify-content-start mb-4">
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                        alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                    <div className="ms-3" style={{ borderRadius: "15px" }}>
                                        <div className="bg-image">
                                            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/screenshot1.webp"
                                                style={{ borderRadius: "15px" }} alt="video" />
                                            <a href="#!">
                                                <div className="mask"></div>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-flex flex-row justify-content-start mb-4">
                                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                                        alt="avatar 1" style={{ width: "45px", height: "100%" }} />
                                    <div className="p-3 ms-3" style={{ borderRadius: "15px", backgroundColor: "rgba(57, 192, 237, 0.2)" }}>
                                        <p className="small mb-0">...</p>
                                    </div>
                                </div>

                                <div data-mdb-input-init className="form-outline">
                                    <textarea className="form-control bg-body-tertiary" id="textAreaExample" rows="4"></textarea>
                                    <label className="form-label" htmlFor="textAreaExample">Type your message</label>
                                </div>

                            </div>
                        </div>
                    </div>
                </div> */}
                <section className="chat_main_section">
                    <div className="container-fluid">
                        <div className="container">
                          
                            <div className="main_form">
                                <div className="row form_row">


                                    <div className="col-lg-12 fom_data ">

                                        <div className="chat_container position-relative">

                                            <div className="chat_person_head d-flex justify-content-between align-items-center">
                                                <div className="person_status_box d-flex justify-content-start align-items-center">
                                                    <div className="image_box">
                                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" alt="" />
                                                    </div>
                                                    <div className="person_status">
                                                        <h4 className="m-o person_name_head">
                                                            Chat Group name 
                                                        </h4>
                                                        <p className="last_seen">
                                                            <i className="fa-solid fa-circle onlineDot"></i> Online


                                                        </p>
                                                    </div>
                                                </div>


                                                <div className="dropdown setting_drop three_dot seeting_btn_desktop">
                                                    <a className="btn" href="javascript:void(0)" role="button" data-bs-toggle="dropdown"
                                                        aria-expanded="false">
                                                        <i class="fa-solid fa-ellipsis-vertical"></i>
                                                        {/* <img className="threeDOt" src="assets/images/3dot.svg" alt="" /> */}
                                                    </a>

                                                    <ul className="dropdown-menu">
                                                        <li>
                                                            <a className="dropdown-item" href="javascript:void(0)" data-bs-toggle="modal"
                                                                data-bs-target="#chat_support"><img src="assets/images/customer-contact.svg" alt="" />
                                                                Kontakta supporten</a>
                                                        </li>
                                                        <li>
                                                            <a className="dropdown-item delete_item" href="javascript;void(0)" data-bs-toggle="modal"
                                                                data-bs-target="#delete_chat">
                                                                <img src="assets/images/delete.svg" alt="" />
                                                                Radera konversation</a>
                                                        </li>

                                                        <li>
                                                            <a className="dropdown-item delete_item" href="javascript;void(0)" data-bs-toggle="modal"
                                                                data-bs-target="#reporttDetail">
                                                                <img src="assets/images/block.svg" alt="" />
                                                                Blockera användare</a>
                                                        </li>
                                                    </ul>
                                                </div>


                                                <div className="dropdown setting_drop three_dot seeting_btn_mobile">
                                                    <a className="btn" href="javascript:void(0)" role="button" data-bs-toggle="modal"
                                                        data-bs-target="#selectTag" aria-expanded="false">

                                                        <img className="threeDOt" src="assets/images/3dot.svg" alt="" />
                                                    </a>
                                                </div>





                                            </div>

                                            <div className="chat_body ">


                                                <div className="left_chat chat_main d-flex justify-content-start align-items-end">
                                                    <div className="image_box">
                                                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp" alt="" />

                                                    </div>
                                                    <div className="chat_inner d-flex justify-content-start align-items-center">
                                                        <div className="messsage">
                                                            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat
                                                            duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                                                        </div>
                                                        <span className="time">14:00</span>
                                                    </div>
                                                </div>


                                                <div className="right_chat chat_main d-flex justify-content-end align-items-end">
                                                   
                                                    <div className="chat_inner d-flex justify-content-start align-items-center">
                                                        <div className="messsage">
                                                            Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat
                                                            duis enim velit mollit. Exercitation veniam consequat sunt nostrud amet.
                                                        </div>
                                                        <span className="time">14:00</span>
                                                    </div>
                                                    <div className="name_box_chat">
                                                        AE

                                                    </div>
                                                </div>

                                                <p className="m-0 date_body">12/20/2023</p>


                                            </div>

                                            <div className="main_chat_send position-relative">

                                                <div className="chat_send_box position-relative">
                                                    <div className="input_box">
                                                        <textarea type="text" className="inPut_send" placeholder="Skriv meddelande..." rows="1"></textarea>
                                                    </div>
                                                    <div className="send_btns">
                                                        <div className="file_open">
                                                            <label for="file_input">
                                                                {/* <img src="assets/images/clip.svg" alt="" /> */}
                                                                 <i class="fa-solid fa-paperclip"></i> 
                                                            </label>
                                                            <input type="file" id="file_input" hidden multiple accept="image/*,video/*" />
                                                        </div>
                                                        <button className="send_chat">
                                                        <i class="fa-solid fa-paper-plane"></i>
                                                        </button>
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
            </div>
        </section>
    );
}

export default RoomChat;
