const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? 'http://3.106.138.97/api' 
    : 'http://localhost:5001/api';

export default API_BASE_URL;
