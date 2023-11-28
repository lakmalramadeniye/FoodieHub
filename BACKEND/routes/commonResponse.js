module.exports.commonResponse = (statusCode, message, data) =>{
    return {
        statusCode: statusCode ? statusCode : "",
        message: message ? message : "",
        data: data ? data : []
      }

}
