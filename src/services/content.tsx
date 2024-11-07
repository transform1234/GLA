export const REACT_APP_OAUTH_PROXY_ENABLED = false;
export const REACT_APP_API_URL = "https://alt-dev.uniteframework.io/api/v1";
export const REACT_APP_BASE_URL = "https://alt-dev.uniteframework.io";
export const REACT_APP_SECRET_KEY = "9ca6e96d-f72e-4208-91f4-a2d8e681f767";

let baseUrl = REACT_APP_API_URL;

export const getOne = async ({ id, adapter, type }, header = {}) => {
  let headers = new Headers({
    ...header,
    Authorization: "Bearer " + sessionStorage.getItem("token"),
  });

  try {
    const response = await fetch(
      `${baseUrl}/course/${adapter}/hierarchy/contentid?courseId=${id}&type=${type}`,
      {
        method: "GET",
        // credentials: "include", // This ensures that credentials (cookies, etc.) are sent with the request
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result?.data || {};
    } else {
      console.log("Failed to fetch data");
      return {};
    }
  } catch (e) {
    console.log("course/hierarchy/contentid", e.message);
    return {};
  }
};

export const getAll = async (prop = {}, header = {}) => {
  // let headers = new Headers({
  //   ...header,
  //   Authorization: "Bearer " + sessionStorage.getItem("token"),
  // });

  try {
    // const response = await fetch(
    //   `${baseUrl}/course/${adapter}/progress/contentid?courseId=${id}&type=${type}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    if (true) {
      // Simulating the response structure based on the provided data
      const result = {
        prog: [
          {
            courseId: "do_11368734744569330713",
            contentId: "do_1138907470163394561521",
            contentType: "lesson",
            order: "1",
            allowedAttempts: "0",
            criteria: {},
            lesson_questionset: "do_11389370198275686412930",
          },
          {
            courseId: "do_11368734744569330713",
            contentId: "do_11389554198553395211183",
            contentType: "lesson",
            order: "2",
            allowedAttempts: "0",
            criteria: {},
            lesson_questionset: "do_114180110019608576116",
          },
          {
            courseId: "do_11368734744569330713",
            contentId: "do_11389370079255756811114",
            contentType: "lesson",
            order: "3",
            allowedAttempts: "0",
            criteria: {},
            lesson_questionset: "do_11389370198275686412930",
          },
        ],
      };

      return result;
    } else {
      console.log("Failed to fetch course progress");
      return {};
    }
  } catch (e) {
    console.log("course/progress/contentid", e.message);
    return {};
  }
};
