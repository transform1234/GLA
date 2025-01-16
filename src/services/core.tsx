export const handleResponseException = (obj: any) => {
  const { response, message } = obj;
  return {
    status: response?.status ? response?.status : 404,
    error: response?.data?.message ? response?.data?.message : message,
    ...(response ? response?.data : response),
  };
};
