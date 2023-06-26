'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements , sort = false) {
containerMovements.innerHTML = '';

 const movs = sort ? movements.slice().sort((a,b) => a -b) : movements;

movs.forEach(function (mov,i) {
  const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
   <div class="movements__row">
   <div class="movements__type movements__type--${type}"> ${i + 1}
     ${type}</div>
     <div class="movements__value">${mov}€</div>
     </div>
  `;
  containerMovements.insertAdjacentHTML('afterbegin'
  ,html);
});
};
// displayMovements(account1.movements);

// Username create
const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUserName(accounts);
console.log(accounts);

// Display Balancee
const calcDisplayBalance = function (acc) {
 acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
labelBalance.textContent = `${acc.balance}€`
};

// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
  .filter(mov => mov < 0)
  .reduce((acc,mov) => acc + mov,0)
  labelSumOut.textContent = `${Math.abs(out)}€`

 const interest = acc.movements
 .filter(mov => mov > 0)
 .map(deposit => (deposit * acc.interestRate)/100)
 .filter((int,i,arr) => {
  // console.log(arr);
  return(int >= 1);
 })
 .reduce((acc,int) => acc + int,0)
 labelSumInterest.textContent = `${interest}€`
};
const updateUI = function (acc) {
  // display Movements
   displayMovements(acc.movements);

   // Display Balance
   calcDisplayBalance(acc);

   // Display summary
   calcDisplaySummary(acc);
}


// Event handler

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // prevent form from submiting
  e.preventDefault();

  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value
    );
  console.log(currentAccount); 
  
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    // Display UI 
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
  }`;
  containerApp.style.opacity = 100; 

  // input field
inputLoginUsername.value = inputLoginPin.value = '';
inputLoginPin.blur();


  //  Update UI
  updateUI(currentAccount);

   
  }
});

// Transfer 
btnTransfer.addEventListener('click',function(e) {
  e.preventDefault();

 const amount = Number(inputTransferAmount.value);
 const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

 inputTransferAmount.value = inputTransferTo.value = '';

 if (
  amount > 0 && 
  recieverAcc &&
  currentAccount.balance >= amount &&
  recieverAcc?.username !== currentAccount.username
 ) {
  // doing Transfer
  currentAccount.movements.push(-amount);
  recieverAcc.movements.push(amount);

  // updateUI
  updateUI(currentAccount);
 }
});

// // Event Loan 
// btnLoan.addEventListener('click',function (e) {
//   e.preventDefault();

//   const amount = Number(inputLoanAmount.value);
//   if (amount > 0 && 
//   currentAccount.movements.some(mov => 
//   mov >= 
//   amount * 0.1)) {
// //  Add Movements 
//   currentAccount.movements.push(amount);
//   // updateUI 
//   updateUI(currentAccount);
//     }
//     inputLoanAmount.value = '';
// });

// Event Delte 
// btnClose.addEventListener('click',function (e) {
//   e.preventDefault();

//   if (inputCloseUsername.value === currentAccount.username &&
//   Number(inputClosePin.value === currentAccount.pin));   {   
//    const index = accounts.findIndex(acc=> acc.username === currentAccount.username);
//     // console.log(index);

//     // Delete account 
//      accounts.splice(index,1);

//     //  hide UI 
//   containerApp.style.opacity = 0;

//   }
//   inputCloseUsername.value = inputClosePin.value = '';
// });

// // Sortbtn 
// let sorted = false;
// btnSort.addEventListener('click',function (e) {
//   e.preventDefault();
//   displayMovements(currentAccount.movements , !sorted);
//   sorted = !sorted;
// })
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Array method 

// // Slice Method 
// let arr = ['a','b','c','d','e'];

// console.log(arr.slice(2));
// console.log(arr.slice(0,2));
// console.log(arr.slice(1,-2));
// console.log(arr.slice(-2));

// // Splice Method 
// console.log(arr.splice(1));
// console.log(arr.splice(-2));
// console.log(arr);

// // Reverce Method 
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j','i','h','g','f'];
// console.log(arr2.reverse());
// console.log(arr2);

// Concat Method

// const letters = arr.concat(arr2);
// console.log(letters);

// // Join method 
// console.log(letters.join(' - '));

// //////////////
// // At Method 
// const Arr = [23,46,64];
// console.log(Arr[0]);
// console.log(Arr.at(0));
// console.log(Arr.at(-1));
// console.log(Arr.slice(-1)[0]);
// console.log(Arr[Arr.length -1]);

// console.log('Rashid',[0]);
// console.log('Rashid'.at(1));

// arrays forEach 
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   for (const [i,movement] of movements.entries()) {
//   if ( movement < 0) {
//     console.log(`Movement ${i + 1} You deposited ${movement}`);
//   } else {
//    console.log(`Movement ${i + 1} You widthrew ${Math.abs(movement)}`);
//   }
// };

// For Each method
// console.log(`-----ForEachMethod----`);

// movements.forEach(function(mov,i,arr){
//    if (mov < 0) {
//      console.log(`Movement ${i + 1} You deposited ${mov}`);
//    } else {
//      console.log(`Movement ${i + 1} You widthrew ${Math.abs(mov)}`);
//    }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (key,value,map){
//  console.log(`${value}:${key}`);
// });

// const currenciesUnique = new Set(['USD','GBP','USD','EUR','EUR']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function (key,value,map){
//  console.log(`${key} : ${value}`);
// })

// coding challenge #1

// const checkDogs = function (dogJulia,dogsKate) {
// const dogsJuliaCorrected = dogJulia.slice();
// dogsJuliaCorrected.splice(0,2);
// dogsJuliaCorrected.splice(-2);

// const dogs = dogsJuliaCorrected.concat(dogsKate);
// console.log(dogs);
// dogs.forEach(function (dogs,i){
//   const dogAge =
//     dogs >= 3
//       ? `Dog Number ${i + 1} is an adult, and is ${dogs} years old`
//       : `Dog Number ${i + 1} is still  a ${dogs} puppy🐶`;
//  if(dogs >= 3) {
//   console.log(`Dog Number ${i + 1} is an adult, and is ${dogs} years old`);
//  }else {
//   console.log(`Dog Number ${i + 1} is still  a ${dogs} puppy🐶`);
//  }
// console.log(dogAge);
// });

// };

// // checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3]);
// checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3]);


// //////////////////////////////////
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // const euroToUSD = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * euroToUSD;
// });

// const movementsUSDArrow = movements.map(mov => 
//    mov * euroToUSD);

// console.log(movements);
// console.log(movementsUSD);
// console.log(movementsUSDArrow);

// const movementsUSDfor = [];

// for ( const mov of movements) movementsUSDfor.push(mov * euroToUSD);
// console.log(movementsUSDfor);


// const movementsDescription = movements.map((mov,i) =>
//  `Movements ${i +1} : You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}
//  `);
// console.log(movementsDescription);
// // Filter Method

// const deposits = movements.filter(function (mov){
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements)
// if(mov > 0)
// depositsFor.push(mov);
// console.log(depositsFor);

// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });
// console.log(movements);
// console.log(withdrawals);

// Reduce Method 

// const balance = movements.reduce(function(acc,cur){
//   return acc + cur;
// },0);
// const balance = movements.reduce((acc,cur) => acc + cur
// ,0);
// console.log(balance);

// let balance2 = 0;

// for (const mov of movements) {
//   balance2 += mov;
// }
// console.log(balance2);

// Maximum 

// const max = movements.reduce((acc, mov) =>{
//  if(acc > mov)
//   return acc;
// else 
// return mov;

// },movements[0]);

// console.log(max);

// coding challenge #2

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age=> (age <= 2 ? 2 * age : 16 + age * 4));
  
//   const adults = humanAges.filter(age => age >= 18);
//   console.log(humanAges);
//   console.log(adults);
  
//   // const average = adults.reduce((acc,age)=> acc + age, 0) / adults.length;
//   const average = adults.reduce(
//   (acc, age,i,arr) => acc + age / arr.length,0
//   );
  
//   return average;
// };

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 =  calcAverageHumanAge([16, 6, 10, 5, 6, 1, 3, 4]);
// console.log(avg1, avg2);
////////////////////////////
// Chained Method

// const euroToUSD = 1.1;
// // console.log(movements);

// // Pipline
// const totalDepositsUSD = movements
// .filter(mov => mov > 0)
// .map((mov,i,arr) => {
//   // console.log(arr);
//   return mov * euroToUSD;
//   // .map(mov => mov*euroToUSD)
// })
// .reduce((acc,mov) => acc + mov, 0);

// console.log(totalDepositsUSD);

// coding challenge #3

//  const calcAverageHumanAge =  (ages) => {
//   const humanAges = ages
//   .map(age=> (age <= 2 ? 2 * age : 16 + age * 4))
//   .filter(age => age >= 18)
//   .reduce(
//   (acc, age,i,arr) => acc + age / arr.length,0 
//   );
  
//   console.log(humanAges);
//   // console.log(adults);
  
//   // const average = adults.reduce((acc,age)=> acc + age, 0) / adults.length;
//   // return average;
// };

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 =  calcAverageHumanAge([16, 6, 10, 5, 6, 1, 3, 4]);
// console.log(avg1, avg2);

// Find method

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// for(const acc of accounts) {
//   if(acc.owner === "Jessica Davis");
// console.log(acc);
// } 

// Flat Method
const arr = [[1,2,3],[4,5,6],7,8];
console.log(arr.flat());


const overalBalance = accounts.map(acc =>
 acc.movements)
.flat()
.reduce((acc,mov) => acc + mov,0);
console.log(overalBalance);

// flateMap 
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overalBalance);

const sort = ['raju','hanzala','zaid','aqdas','maaz'];
console.log(sort.sort());