import moment from "moment";
import _ from "lodash";
const dateFor = moment().format("YYYY-MM-DD");
import API from "../utils/api";

export const getProgramId = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not available in localStorage");
  }

  const requestBody = {
    board: localStorage.getItem("board"),
    medium: localStorage.getItem("medium"),
    grade: localStorage.getItem("grade"),
    currentDate: dateFor,
  };

  try {
    const response = await API.post(
      `${import.meta.env.VITE_API_AUTH_URL}/api/v1/altprogram/bmgs`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (data?.data) {
      const programId = data?.data[0]?.programId;
      localStorage.setItem("programID", programId);
      return data?.data[0];
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const getSubjectList = async () => {
  try {
    const programData = await getProgramId();

    if (programData?.programId) {
      const requestBody = {
        board: localStorage.getItem("board"),
        medium: localStorage.getItem("medium"),
        grade: localStorage.getItem("grade"),
        programId: programData.programId,
      };

      const response = await API.post(
        `${
          import.meta.env.VITE_API_AUTH_URL
        }/api/v1/altprogramassociation/altsubjectlist`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const subjectList = response.data;

      if (subjectList?.data) {
        return _.sortBy(subjectList.data, "rules");
      }
    }

    return [];
  } catch (error) {
    console.error("Error in getting subject list:", error);
    throw error;
  }
};
