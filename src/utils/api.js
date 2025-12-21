import toast from 'react-hot-toast';

const api = {
  get: async (url) => {
    return fetch(url)
      .then(handleResponse)
      .catch(handleError);
  },
  post: async (url, data) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(handleResponse)
      .catch(handleError);
  },
  put: async (url, data) => {
    return fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(handleResponse)
      .catch(handleError);
  },
  delete: async (url) => {
    return fetch(url, {
      method: 'DELETE',
    })
      .then(handleResponse)
      .catch(handleError);
  },
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (response.ok) {
    if (data.message) {
      toast.success(data.message);
    }
    return data;
  } else {
    const error = (data && data.message) || response.statusText;
    toast.error(error);
    return Promise.reject(error);
  }
};

const handleError = (error) => {
  toast.error(error.toString());
  return Promise.reject(error);
};

export default api;
