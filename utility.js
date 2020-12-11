
/**
 * Groups an array by a property values
 * @param {String} objectArray - Array to be grouped
 * @param {Number} property - Property to be grouped by
 * @return {Array} Returns an array  grouped by property value
 */

const groupBy = (objectArray, property) => {
    return objectArray.reduce((acc, obj) => {
       const key = obj[property];
       if (!acc[key]) {
          acc[key] = [];
       }
       // Add object to list for given key's value
       acc[key].push(obj);
       return acc;
    }, {});
 }

/**
 * Checks if a value exist in an array
 * @param {Array} arr - Array to search in
 * @param {String} needle - Property in object to search in
 * @param {String} key - Value to find in array
 * @return {Boolean} True if needle found or false if not found 
 */
const checkValid = (arr,needle,key) => {
    return arr.find(x => x[key] === needle);
}

module.exports = {
    checkValid,
    groupBy
}