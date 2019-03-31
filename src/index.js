exports.handler = (event, context, callback) => {
    let response = {
        statusCode: 200,
        headers: {},
        body: "success"
    };
    callback(null, response);
};