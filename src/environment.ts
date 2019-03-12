const dev = {
    expenseContext: 'http://localhost:2000'
}

const prod = {
    expenseContext: 'https://expense-reimbursement.herokuapp.com/'
}

let environment = dev;

if (process.env.NODE_ENV === 'production') {
    environment = prod;
}

export default environment;