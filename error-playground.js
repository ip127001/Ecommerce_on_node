//Synchronous code error handling
const sum = (a, b) => {
    if (a && b) {
        return a + b;
    }
    throw new Error('invalid arguments');
}
try {
    console.log(sum(1));
} catch (err) {
    console.log('error occured')
    // console.log(err)
}

console.log('this works!');




// Asynchronous code like promises .then() .catch() => catch() catch if more than one then() block are here