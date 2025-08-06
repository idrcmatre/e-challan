const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'http://16.176.131.224/api'
  : 'http://localhost:5001/api';

export default API_BASE_URL;
