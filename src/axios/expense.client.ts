import axios from 'axios';
import { environment } from '../environment';

export const expenseClient = axios.create({
  baseURL: environment.expenseContext,
  withCredentials: true
});
