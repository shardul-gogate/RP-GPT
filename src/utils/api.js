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
  postStream: async (url, data, onChunk, signal) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal,
      });

      if (!response.ok) {
        handleResponse(response);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while(true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        onChunk(chunk);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        return;
      }
      handleError(error);
    }
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
    return data.data;
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
