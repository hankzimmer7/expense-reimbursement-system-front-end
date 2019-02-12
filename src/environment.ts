const dev = {
    expenseContext: 'http://localhost:2000'
}

const prod = {
    expenseContext: 'http://ec2-13-59-149-57.us-east-2.compute.amazonaws.com:2000/'
}

let environment = dev;

if (process.env.NODE_ENV === 'production') {
    environment = prod;
}

export default environment;