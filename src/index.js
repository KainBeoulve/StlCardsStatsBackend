exports.handler = (event, context, callback) => {
    const response = {
        statusCode: '200',
        headers: {},
        body: "We did it!"
    };
    callback(null, response);
};