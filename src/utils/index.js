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

const uppercaseFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const lowercaseFirstLetter = (string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

const toSnakeCase = (string) => {
  return lowercaseFirstLetter(string).replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

module.exports = {
  getApisState,
  uppercaseFirstLetter,
  lowercaseFirstLetter,
  toSnakeCase
};