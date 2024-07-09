import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Countdown from "react-countdown";
import examService from "../../apis/ExamService";
import { AuthContext } from "../../context/AuthContext";

const QUESTIONS_PER_PAGE = 30; // Adjust the number of questions per page here
const NUM_COLUMNS = 6; // Number of columns per row

const ExamDashboard = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [exam, setExam] = useState(null);
  const [startTime, setStartTime] = useState(Date.now());
  const [submitTime, setSubmitTime] = useState(null);
  const { examId } = useParams();
  const navigate = useNavigate();
  const { user, userProfile } = useContext(AuthContext);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const examData = await examService.getExamById(
          examId,
          user.accessToken
        );
        setExam(examData.data);
        setSelectedAnswers(
          examData.data.questions.map((q) => ({
            questionId: q.id,
            questionText: q.text,
            selectedAnswer: null,
          }))
        );
        setStartTime(Date.now()); // Set start time when exam data is fetched
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    };

    fetchExam();
  }, [examId, user.accessToken]);

  const handleSelectAnswer = (questionIndex, answerIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex].selectedAnswer =
      exam.questions[questionIndex].answers[answerIndex];
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleSkipQuestion = () => {
    setCurrentQuestion(
      (prevQuestion) => (prevQuestion + 1) % exam.questions.length
    );
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestion(
      (prevQuestion) =>
        (prevQuestion - 1 + exam.questions.length) % exam.questions.length
    );
  };

  const handleFinishExam = async (isAutoSubmit = false) => {
    const now = Date.now();
    setSubmitTime(now);

    let durationTaken;
    if (isAutoSubmit) {
      durationTaken = exam.duration * 60; // convert duration to seconds
    } else {
      durationTaken = Math.round((now - startTime) / 1000);
    }

    try {
      const payload = {
        emailId: userProfile.email,
        examId: examId,
        title: exam.title,
        duration: exam.duration,
        durationTaken,
        questions: selectedAnswers.map((a) => ({
          id: a.questionId,
          text: a.questionText,
          answers: a.selectedAnswer
            ? [
                {
                  ...a.selectedAnswer,
                  isSelected: true,
                },
              ]
            : exam.questions
                .find((q) => q.id === a.questionId)
                .answers.map((ans) => ({
                  ...ans,
                  isSelected: false,
                })),
        })),
      };
      const submittedAnswerResponse = await examService.submitAnswer(
        examId,
        payload,
        user.accessToken
      );
      console.log("Submitted answer response:", submittedAnswerResponse);

      navigate("/user");
    } catch (error) {
      console.error("Error submitting exam:", error);
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswers[currentQuestion]?.selectedAnswer) {
      setCurrentQuestion(
        (prevQuestion) => (prevQuestion + 1) % exam.questions.length
      );
    } else {
      alert("Please select an answer before proceeding to the next question.");
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
    setCurrentQuestion(currentPage * QUESTIONS_PER_PAGE);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    setCurrentQuestion((currentPage - 1) * QUESTIONS_PER_PAGE);
  };

  const handleAutoSubmit = () => {
    console.warn("Time's up! Auto-submitting exam.");
    handleFinishExam(true);
  };

  if (!exam) return <div>Loading...</div>;

  const startIndex = currentPage * QUESTIONS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + QUESTIONS_PER_PAGE,
    exam.questions.length
  );
  const questionStatus = [];
  for (let i = startIndex; i < endIndex; i += NUM_COLUMNS) {
    const row = exam.questions.slice(i, i + NUM_COLUMNS);
    questionStatus.push(row);
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1bc1de] to-[#4ab2c9] flex flex-col">
      {/* Header */}
      <div className="min-h-[6.25rem] shadow-md  flex items-center justify-between mx-24 mt-3">
        <div className="text-4xl font-bold text-gradient-exam ml-3">
          {exam.title} 2024
        </div>
        <div className="text-4xl font-bold text-gradient-exam ml-24">
          Oasis Infobyte
        </div>
        <div className="text-4xl font-bold text-gradient-exam flex items-center">
          Time Left:{" "}
          <Countdown
            date={startTime + exam.duration * 60000}
            onComplete={handleAutoSubmit}
            className="ml-4 mr-3"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-7 mx-10 bg-[#31c0d0] shadow-md">
        <div className="grid grid-cols-5 gap-4  h-[25.625rem]">
          <div className="col-span-3 shadow-lg p-14 text-base">
            <p className="font-bold text-xl">
              {currentQuestion + 1}. {exam.questions[currentQuestion]?.text}
            </p>
            <ul className="ms-5 mt-5">
              {exam.questions[currentQuestion]?.answers.map((answer, index) => (
                <li key={index} className="mt-2">
                  <label className="flex items-center text-xl font-semibold">
                    <input
                      type="radio"
                      name={`answer${currentQuestion}`}
                      className="mr-2 font-serif w-6 h-4 mt-1"
                      checked={
                        selectedAnswers[currentQuestion]?.selectedAnswer?.id ===
                        answer.id
                      }
                      onChange={() =>
                        handleSelectAnswer(currentQuestion, index)
                      }
                    />
                    {answer.text}
                  </label>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 shadow-md">
            <div className="h-full flex flex-col justify-between">
              <p className="text-center font-bold text-4xl text-gradient-exam">
                Question Status
              </p>
              <div className="grid grid-cols-6 gap-1 p-3 -mt-20">
                {questionStatus.map((row, rowIndex) =>
                  row.map((question, colIndex) => {
                    const questionIndex =
                      startIndex + rowIndex * NUM_COLUMNS + colIndex;
                    const isCurrentQuestion = questionIndex === currentQuestion;
                    const isSelected =
                      selectedAnswers[questionIndex]?.selectedAnswer !== null;

                    const circleStyles = `p-1 text-white text-center rounded-full cursor-pointer h-8 ${
                      isCurrentQuestion ? "bg-blue-500" : ""
                    } ${isSelected ? "bg-green-500" : "bg-red-500"}`;

                    return (
                      <div
                        key={questionIndex}
                        className={circleStyles}
                        onClick={() => setCurrentQuestion(questionIndex)}
                        style={{
                          gridColumn: colIndex + 1,
                          gridRow: rowIndex + 1,
                        }}
                      >
                        <div className="text-base font-bold">
                          {questionIndex + 1}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex justify-between px-4 py-2">
                <button
                  type="button"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  &lt;&lt; Previous
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md"
                  onClick={handleNextPage}
                  disabled={endIndex >= exam.questions.length}
                >
                  Next &gt;&gt;
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="min-h-[6.25rem]  flex items-center justify-between mx-24 mt-5">
        <div className="text-2xl font-bold">
          <p className="text-gradient-exam">
            Answered:{" "}
            {
              selectedAnswers.filter(
                (answer) => answer && answer.selectedAnswer !== null
              ).length
            }
          </p>
        </div>
        <div className="space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-yellow-500 text-white rounded-md"
            onClick={handleSkipQuestion}
          >
            Skip
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handlePreviousQuestion}
          >
            Previous
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            onClick={handleNextQuestion}
          >
            Next
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={() => handleFinishExam()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamDashboard;
