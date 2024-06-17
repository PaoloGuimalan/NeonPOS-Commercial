const getToken = (key: string) => {
  const data = typeof window !== 'undefined' ? localStorage.getItem(key) : '';

  try {
    return JSON.parse(data || '');
  } catch (err) {
    return data;
  }
};

export default getToken;
