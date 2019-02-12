import axios from 'axios';
import environment from '../environment';

const expenseClient = axios.create({
  baseURL: environment.expenseContext,
  withCredentials: true
});

export default expenseClient;
