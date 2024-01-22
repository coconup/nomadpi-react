const getApisState = (apis) => {
  const isLoading = !!apis.find(api => api.isLoading);
  const isFetching = !!apis.find(api => api.isFetching);
  const isSuccess = apis.every(api => api.isSuccess);
  const isError = !!apis.find(api => api.isError);
  const errors = apis.filter(api => api.isError).map(api => api.error);

  return {
    isLoading,
    isFetching,
    isSuccess,
    isError,
    errors
  }
};

module.exports = {
  getApisState
};