import moment from "moment";
import _ from "lodash";
import URL from "../utils/constants/url-constants.json";
const dateFor = moment().format("YYYY-MM-DD");

export const getProgramId = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token not available in localStorage");
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const requestBody = {
    board: localStorage.getItem("board"),
    medium: localStorage.getItem("medium"),
    grade: localStorage.getItem("grade"),
    currentDate: dateFor,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_AUTH_URL}${URL.ALT_PROGRAM_BMGS}`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

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
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_AUTH_URL}${URL.SUBJECT_LIST}`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            board: localStorage.getItem("board"),
            medium: localStorage.getItem("medium"),
            grade: localStorage.getItem("grade"),
            programId: programData.programId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch subject list");
      }

      const leaderboardList = await response.json();

      if (leaderboardList?.data) {
        return _.sortBy(leaderboardList.data, "rules");
      }
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error in getting subject list:", error);
    throw error;
  }
};

export const getLeaderboardFilter = async (payload: any) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_AUTH_URL}${URL.LEADERBOARD_FILTER_LIST}`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch subject list");
    }

    const subjectList = await response.json();

    if (subjectList?.data) {
      return _.sortBy(subjectList.data, "rules");
    }
  } catch (error) {
    console.error("Error in getting subject list:", error);
    throw error;
  }
};

export const getCurrentUserdetail = async (
  page: number = 1,
  limit: number = 20
) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_AUTH_URL}${
        URL.LEADERBOARD_USER_DATA
      }?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: headers,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const userData = await response.json();

    if (userData?.data) {
      return userData?.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error in getting user data:", error);
    throw error;
  }
};
export const getTeacherData = async (payload: any) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(
      `${import.meta.env.VITE_API_AUTH_URL}${URL.PROGRESS}`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const userData = await response.json();

    if (userData?.data) {
      return userData?.data;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error in getting user data:", error);
    throw error;
  }
};
