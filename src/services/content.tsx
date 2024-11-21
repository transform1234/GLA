import API from "../utils/api";
const baseUrl: string = `${import.meta.env.VITE_API_AUTH_URL}/api/v1`;

interface IGetOneParams {
  id: string;
  adapter: string;
  type: string;
  header?: Record<string, string>;
}


export const getOne = async ({ id, adapter, type, header }: IGetOneParams) => {
  try {
    const response = await API.get(
      `${baseUrl}/course/${adapter}/hierarchy/contentid`, 
      {
        headers: {
          ...header,
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          courseId: id,
          type: type,
        },
      }
    );

    return response.data?.data || {}; // Extract data field.
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("course/hierarchy/contentid", e.message);
    } else {
      console.error("course/hierarchy/contentid", String(e));
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
    const response = await API.post(
      `${baseUrl}/altprogramassociation/glaUserContent`,
      {
        programId,
        subject,
        page,
        limit,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    return response.data; // Axios parses the JSON response automatically.
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("altprogramassociation/glaUserContent", e.message);
    } else {
      console.error("altprogramassociation/glaUserContent", String(e));
    }
    return { data: [] }; // Fallback empty data.
  }
};

