import axios from "axios";

const API_URL = "http://localhost:8080/exam-service/";

const createExam = async (examData, accessToken) => {
  try {
    const response = await axios.post(`${API_URL}create`, examData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error creating exam:", error);
    throw error;
  }
};

const getExamByTitle = async (title, accessToken) => {
  try {
    const response = await axios.get(`${API_URL}get-exam-by-title/${title}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error(`Error fetching exam with title "${title}":`, error);
    throw error;
  }
};

const getExamById = async (examId, accessToken) => {
  try {
    const response = await axios.get(`${API_URL}get-exam-by-id/${examId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error(`Error fetching exam with ID "${examId}":`, error);
    throw error;
  }
};

const submitAnswer = async (examId, examSubmitRequestDTO, accessToken) => {
  try {
    const response = await axios.post(
      `${API_URL}submit-answer/${examId}`,
      examSubmitRequestDTO,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(`Error submitting answer for exam "${examId}":`, error);
    throw error;
  }
};

const getSubmittedAnswer = async (examId, emailId, accessToken) => {
  try {
    const response = await axios.get(
      `${API_URL}get-submitted-answer/${examId}/${emailId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(
      `Error fetching submitted answer for exam "${examId}" and email "${emailId}":`,
      error
    );
    throw error;
  }
};

const getSubmittedAnswerByEmailId = async (emailId, accessToken) => {
  try {
    const response = await axios.get(
      `${API_URL}get-submitted-answer-by-emailId/${emailId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error(
      `Error fetching submitted answers for email "${emailId}":`,
      error
    );
    throw error;
  }
};

const getAllExams = async (accessToken) => {
  try {
    const response = await axios.get(`${API_URL}get-all-exams`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching all exams:", error);
    throw error;
  }
};

const examService = {
  createExam,
  getExamByTitle,
  getExamById,
  submitAnswer,
  getSubmittedAnswer,
  getSubmittedAnswerByEmailId,
  getAllExams,
};

export default examService;
