//bai 1


//bai 2
// function printNumberDecrease() {
//     for (let i = 100; i >= 1; i--) {
//         console.log(i);
//     }
// }
// printNumberDecrease();
//bai 3
// function divide5 () {
//     for (let i = 5; i <= 70; i++) {
//         if (i % 5 === 0) {
//             console.log(i);
//         }
//     }
// }
// divide5();
//bai 4
// function countDivisor(n){
// 	//Your code here
// 	if(n< 0){
// 		console.log("n phai >= 0")
//         return;
// 	}
//     if(n >= 0){
//         let count = 0;
//         for(let i = 1; i <= n; i++){
//             if(n % i === 0){
//             count++;
//         }
//     }
//     return count;
//     }
	
// }

// console.log(countDivisor(10))  
// console.log(countDivisor(128)) 
// console.log(countDivisor(2000)) 
// console.log(countDivisor(63)) 
// bai55
// function isPerfectNumber(n){
//     //Your code here
//     if(n < 0){
//         console.log("n phai >= 0")
//         return;
//     }
//     if(n === 1){
//         return false;
//     }
//     let sum = 0;
//     for(let i = 1; i < n; i++){
//         if(n % i === 0){
//             sum += i;
//         }
//     }
//     return sum === n;
	
// }

// console.log(isPerfectNumber(6)) 
// console.log(isPerfectNumber(28)) 
// console.log(isPerfectNumber(496)) 
// bai6
function rightAngledTriangle(n) {
    if (n < 0){
        console.log("n phai >= 0")
        return;
    }
    for (let i = 1; i <= n; i++) {
        let row = '';
        for (let j = 1; j <= i; j++) {
            row += '* ';
        }
        console.log(row);
    }
}

rightAngledTriangle(5)