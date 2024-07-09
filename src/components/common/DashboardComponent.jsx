import React, { useContext, useEffect, useState } from "react";
import examService from "../../apis/ExamService";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DashboardComponent = () => {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await examService.getAllExams(user.accessToken);
        console.log("Exam response: ", response);
        setExams(response.data); // Make sure to access the data properly
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          if (error.response.status === 503) {
            setError(
              "Service is currently unavailable. Please try again later."
            );
          } else if (error.response.status === 404) {
            setError(
              "Sorry, we couldn't find the exam you were looking for. Please contact support for assistance."
            );
          } else {
            setError(
              "An error occurred while fetching exams. Please try again."
            );
          }
        } else if (error.request) {
          // The request was made but no response was received
          setError(
            "No response from the server. Please check your network connection."
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          setError("An unexpected error occurred. Please try again.");
        }
        console.error("Error fetching exams:", error);
      }
    };

    fetchExams();
  }, [user.accessToken]);

  const headers = [
    "Exam Name",
    "No. of Questions",
    "Duration (minutes)",
    "Action",
  ];

  const handleTakeExam = (examId) => {
    navigate(`/take-exam/${examId}`);
  };

  return (
    <>
      <div className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Dashboard
      </div>
      <div className="grid grid-cols-4 gap-0 p-4">
        {headers.map((header, index) => (
          <div
            key={index}
            className="border border-gray-300 p-2 text-center bg-gray-200 text-gray-800 font-bold"
          >
            {header}
          </div>
        ))}
        {error ? (
          <div className="col-span-4 text-center error-text font-bold text-2xl mt-10">
            {error}
          </div>
        ) : exams.length > 0 ? (
          exams.map((exam, rowIndex) => (
            <React.Fragment key={exam.id}>
              <div className="border border-gray-300 p-2 flex items-center justify-center">
                {exam.title}
              </div>
              <div className="border border-gray-300 p-2 flex items-center justify-center">
                {exam.questions.length}
              </div>
              <div className="border border-gray-300 p-2 flex items-center justify-center">
                {exam.duration}
              </div>
              <div className="border border-gray-300 p-2 flex items-center justify-center">
                <button
                  className="bg-blue-500 text-white py-1 px-2 rounded-md"
                  onClick={() => handleTakeExam(exam.id)}
                >
                  Take Exam
                </button>
              </div>
            </React.Fragment>
          ))
        ) : (
          <div className="col-span-4 border border-gray-300 p-2 text-center text-gradient-red font-bold text-2xl mt-10">
            No exams available
          </div>
        )}
      </div>
    </>
  );
};

export default DashboardComponent;
