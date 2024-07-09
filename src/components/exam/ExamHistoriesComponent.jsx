import React, { useContext, useEffect, useState } from "react";
import examService from "../../apis/ExamService";
import { AuthContext } from "../../context/AuthContext";

const ExamHistoriesComponent = () => {
  const [examHistories, setExamHistories] = useState([]);
  const [error, setError] = useState(null);
  const { user, userProfile } = useContext(AuthContext);

  useEffect(() => {
    const fetchExamHistories = async () => {
      try {
        const response = await examService.getSubmittedAnswerByEmailId(
          userProfile.email,
          user.accessToken
        );
        console.log(response);
        setExamHistories(response.data);
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
              "An error occurred while fetching exam histories. Please try again."
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
        console.error("Error fetching exam histories:", error);
      }
    };

    fetchExamHistories();
  }, [user.accessToken, userProfile.email]);

  const calculateAnswers = (questions) => {
    let correctAnswers = 0;
    let wrongAnswers = 0;

    questions.forEach((question) => {
      question.answers.forEach((answer) => {
        if (answer.selected && answer.correct) {
          correctAnswers += 1;
        } else if (answer.selected && !answer.correct) {
          wrongAnswers += 1;
        }
      });
    });

    return { correctAnswers, wrongAnswers };
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes > 0 ? `${minutes} min ` : ""}${remainingSeconds} sec`;
  };

  const headers = [
    "Exam Name",
    "No. of Questions",
    "Time",
    "Time Taken",
    "Correct Answers",
    "Wrong Answers",
    "Score",
  ];

  return (
    <>
      <div className="header bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Exam Histories
      </div>
      <div className="grid grid-cols-7 gap-0 p-4">
        {/* Table Headers */}
        {headers.map((header, index) => (
          <div
            key={index}
            className="border border-gray-300 p-2 text-center bg-gray-200 text-gray-800 font-bold"
          >
            {header}
          </div>
        ))}
        {/* Exam Histories Data */}
        {error ? (
          <div className="col-span-7 text-center error-text font-bold text-2xl mt-10">
            {error}
          </div>
        ) : (
          examHistories.map((history) => {
            const { correctAnswers, wrongAnswers } = calculateAnswers(
              history.questions
            );
            return (
              <React.Fragment key={history.examId}>
                <div
                  key={`exam-name-${history.examId}`}
                  className="border border-gray-300 p-2 flex items-center justify-center"
                >
                  {history.title}
                </div>
                <div
                  key={`num-questions-${history.examId}`}
                  className="border border-gray-300 p-2 flex items-center justify-center"
                >
                  {history.questions.length}
                </div>
                <div
                  key={`time-${history.examId}`}
                  className="border border-gray-300 p-2 flex items-center justify-center"
                >
                  {history.duration} min
                </div>
                <div
                  key={`time-taken-${history.examId}`}
                  className="border border-gray-300 p-2 flex items-center justify-center"
                >
                  {formatDuration(history.durationTaken)}
                </div>
                <div
                  key={`correct-answers-${history.examId}`}
                  className="border border-gray-300 p-2 flex items-center justify-center"
                >
                  {correctAnswers}
                </div>
                <div
                  key={`wrong-answers-${history.examId}`}
                  className="border border-gray-300 p-2 flex items-center justify-center"
                >
                  {wrongAnswers}
                </div>
                <div
                  key={`score-${history.examId}`}
                  className="border border-gray-300 p-2 flex items-center justify-center"
                >
                  {history.score}
                </div>
              </React.Fragment>
            );
          })
        )}
      </div>
    </>
  );
};

export default ExamHistoriesComponent;
