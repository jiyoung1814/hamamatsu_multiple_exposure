module.exports = (ms) => {
    return new Promise((resolve, reject) => {
        try{
            setTimeout(resolve, ms);
        } catch (error) {
            reject(error);
        }
    });
}