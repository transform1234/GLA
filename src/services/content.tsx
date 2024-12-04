import URL from "../utils/constants/url-constants.json";
const baseUrl: string = `${import.meta.env.VITE_API_AUTH_URL}/api/v1`;

interface IGetOneParams {
  id: string;
  adapter: string;
  type: string;
  header?: Record<string, string>;
}

export const getOne = async ({ id, adapter, type, header }: IGetOneParams) => {
  const headers = new Headers({
    ...header,
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  try {
    const response = await fetch(
      `${baseUrl}/course/${adapter}${URL.CONTENT_ID}?courseId=${id}&type=${type}`,
      {
        method: "GET",
        headers,
      }
    );

    if (response.ok) {
      const result = await response.json();
      return result?.data || {};
    } else {
      console.log("Failed to fetch data");
      return {};
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("course/hierarchy/contentid", e.message);
    } else {
      console.log("course/hierarchy/contentid", String(e));
    }
    return {};
  }
};

// interface IGetAllParams {
//   page?: number;
//   limit?: number;
//   programId?: string;
//   subject?: string;
//   header?: Record<string, string>;
// }

// export const getAll = async ({
//   page = 1,
//   limit = 6,
//   programId = "e5fe89b2-cbc6-473a-99ba-83313d2e4072",
//   subject = "Science",
//   header,
// }: IGetAllParams) => {
//   try {
//     const response = await fetch(`${baseUrl}/course/progress/contentid`, {
//       method: "GET",
//       headers: {
//         ...header,
//         Authorization: `Bearer ${localStorage.getItem("token")}`,
//       },
//     });

//     const result = await response.json();
//     if (true) {
//       // Simulating the response structure based on the provided data
//       const result = {
//         data: [
//           {
//             courseId: "do_11368734744569330713",
//             contentId: "do_114180173374537728144",
//             contentType: "lesson",
//             order: "1",
//             allowedAttempts: "0",
//             criteria: {},
//             lesson_questionset: "do_11418009890504704015",
//           },
//           {
//             courseId: "do_11368734744569330713",
//             contentId: "do_114180174687789056146",
//             contentType: "lesson",
//             order: "2",
//             allowedAttempts: "0",
//             criteria: {},
//             lesson_questionset: "do_114180110019608576116",
//           },
//           {
//             courseId: "do_11368734744569330713",
//             contentId: "do_113748995608870912150",
//             contentType: "lesson",
//             order: "2",
//             allowedAttempts: "0",
//             criteria: {},
//             lesson_questionset: "do_114180203897585664193",
//           },
//           {
//             courseId: "do_11368734744569330713",
//             contentId: "do_1138907470163394561521",
//             contentType: "lesson",
//             order: "1",
//             allowedAttempts: "0",
//             criteria: {},
//             lesson_questionset: "do_11389370198275686412930",
//           },
//           {
//             courseId: "do_11368734744569330713",
//             contentId: "do_11389554198553395211183",
//             contentType: "lesson",
//             order: "2",
//             allowedAttempts: "0",
//             criteria: {},
//             lesson_questionset: "do_114180110019608576116",
//           },
//           {
//             courseId: "do_11368734744569330713",
//             contentId: "do_11389370079255756811114",
//             contentType: "lesson",
//             order: "3",
//             allowedAttempts: "0",
//             criteria: {},
//             lesson_questionset: "do_11389370198275686412930",
//           },
//         ],
//       };

//       return result;
//     } else {
//       console.log("Failed to fetch course progress");
//       return {};
//     }
//   } catch (e) {
//     console.log("course/progress/contentid", e.message);
//     return {};
//   }
// };

export const getAltUserContent = async ({
  page = 1,
  limit = 6,
  programId = "e5fe89b2-cbc6-473a-99ba-83313d2e4072",
  subject = "Science",
}: {
  page?: number;
  limit?: number;
  programId?: string;
  subject?: string;
}): Promise<any> => {
  try {
    const response = await fetch(
      `${baseUrl}${URL.GLA_USER_CONTENT}?page=${page}&limit=${limit}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ programId, subject, page, limit }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      console.log("Failed to fetch alt user content");
      return { data: [] };
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("course/progress/contentid", e.message);
    } else {
      console.log("course/progress/contentid", String(e));
    }
    return { data: [] };
  }
};

export const addLessonTracking = async ({
  courseId,
  moduleId,
  lessonId,
  status,
  contentType,
  timeSpent,
  score,
  scoreDetails,
  programId,
  subject,
  contentSource,
}: {
  courseId: string;
  moduleId: string;
  lessonId: string;
  status: string;
  contentType: string;
  timeSpent: number;
  score: number;
  scoreDetails: string;
  programId: string;
  subject: string;
  contentSource: string;
}): Promise<any> => {
  try {
    const response = await fetch(
      `${baseUrl}${URL.ALT_LESSON_TRACKING}?program=${
        programId || "e5fe89b2-cbc6-473a-99ba-83313d2e4072"
      }&subject=${subject}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          moduleId,
          lessonId,
          status,
          contentType,
          timeSpent,
          score,
          scoreDetails,
          contentSource,
        }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      return result;
    } else {
      console.log("Failed to add lesson tracking");
      return {};
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.log("course/progress/contentid", e.message);
    } else {
      console.log("course/progress/contentid", String(e));
    }
    return {};
  }
};
export const fetchSearchResults = async (payload : any): Promise<any> => {
  try {
    const response = await fetch(`${baseUrl}${URL.SEARCH}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
};
