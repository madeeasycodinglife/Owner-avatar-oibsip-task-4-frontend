import React, { useContext, useState } from "react";
import examService from "../../apis/ExamService";
import { AuthContext } from "../../context/AuthContext";

const CreateExamComponent = () => {
  const [examData, setExamData] = useState({
    title: "",
    duration: 0,
    questions: [
      {
        text: "",
        answers: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ],
  });
  const [error, setError] = useState(null); // State for handling errors
  const { user } = useContext(AuthContext);
  const initialQuestion = {
    text: "",
    answers: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  };

  const [questionIndex, setQuestionIndex] = useState(1);

  const handleQuestionChange = (qIndex, value) => {
    const newExamData = { ...examData };
    newExamData.questions[qIndex].text = value;
    setExamData(newExamData);
  };

  const handleAnswerChange = (qIndex, aIndex, value) => {
    const newExamData = { ...examData };
    newExamData.questions[qIndex].answers[aIndex].text = value;
    setExamData(newExamData);
  };

  const handleRadioChange = (qIndex, aIndex) => {
    const newExamData = { ...examData };
    newExamData.questions[qIndex].answers.forEach((answer) => {
      answer.isCorrect = false;
    });
    newExamData.questions[qIndex].answers[aIndex].isCorrect = true;
    setExamData(newExamData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredQuestions = examData.questions.filter((question) => {
      if (!question.text.trim()) return false;
      return question.answers.every((answer) => answer.text.trim());
    });

    if (filteredQuestions.length === 0) {
      alert("Please add at least one complete question with answers.");
      return;
    }

    const newExamData = { ...examData, questions: filteredQuestions };
    console.log("Exam submitted:", newExamData);

    try {
      await examService.createExam(newExamData, user.accessToken);
      // Resetting the form
      setExamData({
        title: "",
        duration: 0,
        questions: [{ ...initialQuestion }],
      });
      setQuestionIndex(1);
      setError(null); // Clear any previous errors upon successful submission
      alert("Exam created successfully!");
    } catch (error) {
      console.error("Error creating exam:", error);
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          setError("Bad request. Please check your inputs.");
        } else if (status === 401) {
          setError("Unauthorized. Please log in again.");
        } else if (status === 403) {
          setError("Forbidden. Access denied.");
        } else if (status === 404) {
          setError("Resource not found.");
        } else if (status === 405) {
          setError("Method not allowed. Please try again later.");
        } else if (status === 409) {
          setError("Conflict. The exam already exists.");
        } else if (status >= 500) {
          setError("Server error. Please try again later.");
        } else {
          setError("An error occurred. Please try again later.");
        }
      } else if (error.request) {
        setError("No response received. Please try again later.");
      } else {
        setError("An error occurred. Please try again later.");
      }
    }
  };

  const handleAddQuestion = () => {
    const currentQuestion = examData.questions[examData.questions.length - 1];
    if (
      !currentQuestion.text.trim() ||
      currentQuestion.answers.some((answer) => !answer.text.trim())
    ) {
      alert("Please complete the current question before adding a new one.");
      return;
    }

    const newExamData = { ...examData };
    newExamData.questions.push({ ...initialQuestion });
    setExamData(newExamData);
    setQuestionIndex(questionIndex + 1);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="bg-gray-200 text-gray-800 text-xl text-center font-bold p-2">
        Create Exam
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        {/* Exam details section */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg text-gray-700">Title</label>
              <input
                type="text"
                value={examData.title}
                required
                onChange={(e) =>
                  setExamData({ ...examData, title: e.target.value })
                }
                className="mt-1 block text-black text-sm w-full text-2xl h-10 border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div>
              <label className="block text-lg text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={examData.duration}
                required
                onChange={(e) =>
                  setExamData({ ...examData, duration: e.target.value })
                }
                className="mt-1 text-black text-sm block w-full text-2xl h-10 border border-gray-300 rounded-md shadow-sm p-2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-2 px-4 rounded-md"
              >
                Add Question
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white py-2 px-4 rounded-md"
              >
                Create Exam
              </button>
            </div>
            {error && (
              <p className="text-center error-text font-bold text-2xl mt-10">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Answers section */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {examData.questions.slice(-1).map((question, qIndex) => (
              <div key={qIndex} className="border p-4 rounded-md space-y-3">
                <div>
                  <label className="block text-lg font-bold text-gray-700">
                    Question {questionIndex}
                  </label>
                  <input
                    type="text"
                    value={question.text}
                    required
                    onChange={(e) => {
                      handleQuestionChange(
                        examData.questions.length - 1,
                        e.target.value
                      );
                    }}
                    className="mt-1 text-black text-sm block w-full text-2xl h-10 border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <h2 className="text-xl font-bold mb-4">Answers</h2>
                {question.answers.map((answer, aIndex) => (
                  <div
                    key={aIndex}
                    className="ml-4 flex items-center space-x-2"
                  >
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      checked={answer.isCorrect}
                      onChange={() =>
                        handleRadioChange(examData.questions.length - 1, aIndex)
                      }
                      className="mr-2 text-black text-sm"
                    />
                    <input
                      type="text"
                      value={answer.text}
                      required
                      onChange={(e) =>
                        handleAnswerChange(
                          examData.questions.length - 1,
                          aIndex,
                          e.target.value
                        )
                      }
                      className="text-black text-sm w-full h-10 border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
                ))}
              </div>
            ))}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateExamComponent;
