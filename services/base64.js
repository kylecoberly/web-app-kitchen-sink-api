function decode(base64String){
    return (new Buffer(base64String, "base64")).toString("utf8");
}

module.exports = {
    decode
}
