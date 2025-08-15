const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'http://54.206.95.234/api' 
    : 'http://localhost:5001/api';

export default API_BASE_URL;
