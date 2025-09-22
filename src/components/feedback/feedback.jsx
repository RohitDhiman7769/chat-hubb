// import React, { useState } from "react";

// const Feedback = ({ onSubmit }) => {
//   const [rating, setRating] = useState(0);
//   const [hover, setHover] = useState(0);
//   const [comment, setComment] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!rating || !comment.trim()) {
//       alert("Please give a rating and write feedback!");
//       return;
//     }
//     onSubmit({ rating, comment });
//     setRating(0);
//     setHover(0);
//     setComment("");
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6">
//       <h2 className="text-xl font-bold mb-4 text-center">Give Feedback</h2>

//       {/* Star Rating */}
//       <div className="flex justify-center mb-4">
//         {[...Array(5)].map((_, index) => {
//           const starValue = index + 1;
//           return (
//             <button
//               key={index}
//               type="button"
//               onClick={() => setRating(starValue)}
//               onMouseEnter={() => setHover(starValue)}
//               onMouseLeave={() => setHover(0)}
//               className="text-3xl focus:outline-none"
//             >
//               <span
//                 className={
//                   starValue <= (hover || rating)
//                     ? "text-yellow-400"
//                     : "text-gray-300"
//                 }
//               >
//                 ★
//               </span>
//             </button>
//           );
//         })}
//       </div>

//       {/* Textarea */}
//       <textarea
//         value={comment}
//         onChange={(e) => setComment(e.target.value)}
//         className="w-full border rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         rows="4"
//         placeholder="Write your feedback..."
//       ></textarea>

//       {/* Submit Button */}
//       <button
//         onClick={handleSubmit}
//         className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
//       >
//         Submit Feedback
//       </button>
//     </div>
//   );
// };

// export default Feedback;


import React, { useState } from "react";
// import "./feedback.css";

function Feedback({ onBack }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !comment.trim()) {
      alert("Please select rating and write feedback!");
      return;
    }
    console.log("Feedback submitted:", { rating, comment });
    alert("Thank you for your feedback!");
    setRating(0);
    setHover(0);
    setComment("");
  };

  return (
    // <section className="chat_main_section">
    //   <div className="container-fluid">
    //     <div className="container">
    //       <div className="main_form">
    //         <div className="row form_row">
    //           <div className="col-lg-12 fom_data ">
                <div className="chat_container position-relative">
                  {/* Header */}
                  <div className="chat_person_head d-flex justify-content-between align-items-center">
                    <div className="person_status_box d-flex justify-content-start align-items-center">
                      <div className="person_status">
                        <h2 style={{ fontWeight: "700" }} className="m-0 person_name_head">
                          Feedback
                        </h2>
                        <br />
                        <h4 style={{ paddingLeft: "20px" }} className="m-0 person_name_head">
                          We value your opinion
                        </h4>
                      </div>
                    </div>

                    {/* Dropdown */}
                    <div className="setting_drop three_dot seeting_btn_desktop">
                      <button
                        className="btn"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                      </button>

                      <ul className="dropdown-menu">
                        <li onClick={onBack}>
                          <button className="dropdown-item">
                            <img src="assets/images/customer-contact.svg" alt="" /> Back
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="chat_body">
                    {/* Stars */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                      {[...Array(5)].map((_, index) => {
                        const starValue = index + 1;
                        return (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setRating(starValue)}
                            onMouseEnter={() => setHover(starValue)}
                            onMouseLeave={() => setHover(0)}
                            className="text-3xl focus:outline-none"
                            style={{
                              fontSize: "40px",
                              color: starValue <= (hover || rating) ? "#FFD700" : "#ddd",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            ★
                          </button>
                        );
                      })}
                    </div>

                    {/* Textarea */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your feedback..."
                        rows="4"
                        style={{
                          width: "80%",
                          borderRadius: "10px",
                          padding: "15px",
                          border: "1px solid #ccc",
                          outline: "none",
                        }}
                      ></textarea>
                    </div>

                    {/* Submit */}
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                      <button
                        onClick={handleSubmit}
                        style={{
                          padding: "10px 30px",
                          background: "#007bff",
                          color: "#fff",
                          borderRadius: "8px",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                  {/* End body */}
                </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </section>
  );
}

export default Feedback;
