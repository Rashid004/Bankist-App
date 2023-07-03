'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-06-01T10:17:24.185Z',
    '2023-07-08T14:11:59.604Z',
    '2023-07-27T17:01:17.194Z',
    '2023-07-11T23:36:17.929Z',
    '2023-03-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions
const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (day1, day2) =>
    Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  //  const day = `${date.getDay()}`.padStart(1, 0);
  //  const month = `${date.getMonth() + 1}`.padStart(1, 0);
  //  const year = date.getFullYear();
  //  return `${day}/${month}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
       <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(out, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;
// fake login View
//  currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    //  create current Date
    // With API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    };
    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // const day = `${now.getDay()}`.padStart(2,0);
    // const month = `${now.getMonth()}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hours = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hours}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () // Add movement
    {
      currentAccount.movements.push(amount);

      // Add loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
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
// const arr = [[1,2,3],[4,5,6],7,8];
// console.log(arr.flat());


// const overalBalance = accounts.map(acc =>
//  acc.movements)
// .flat()
// .reduce((acc,mov) => acc + mov,0);
// console.log(overalBalance);

// // flateMap 
// const overalBalance2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overalBalance);

// const sort = ['raju','hanzala','zaid','aqdas','maaz'];
// console.log(sort.sort());

// // const arrr = [1, 2, 3,4, 5, 6, 7, 8];

// console.log(new Array(1, 2, 3, 4, 5, 6, 7, 8));

// const x = new Array(7);
// x.fill(1);
// // x.fill(23, 5);

// console.log(x);

// // ARRAY From 
// // const y = Array.from({length : 7}, () => 1);
// const y = Array.from({length : 7}, (cur,i) => i + 1);
//   console.log(y);

  ///////////

  // const bankDepositSum = accounts.
  // flatMap(acc => acc.movements)
  // .filter(mov => mov > 0 )
  // .reduce((sum,cur) => sum + cur,0);
  // console.log(bankDepositSum);

  // 2
  // const numDeposit1000 = accounts.flatMap(acc => acc.movements)
  // .filter(mov => mov > 1000).length;
  // console.log(numDeposit1000);

  // const numDeposit1000 = accounts.flatMap(acc => acc.movements)
  // // .reduce((count,cur) => cur >= 1000 ? count + 1 : count ,0);  
  // .reduce((count,cur) => cur >= 1000 ? ++count  : count ,0);  
  // console.log(numDeposit1000);

  // const sums = accounts
  // .flatMap(acc => acc.accounts)
  // .reduce((sums,cur) => {
  //   // cur > 0 ? (sums.deposit += cur) : (sums.withdrawal += cur);
  //   [cur > 0 ? 'deposit' : 'withdrawal'];
  //   return sums;
  // },
  // {deposits: 0, withdrawal: 0},
  // );
  // console.log(sums);

  //  Coding Challenge #4 

//  const dogs = [
//    { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//    { weight: 8, curFood: 200, owners: ['Matilda'] },
//    { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//    { weight: 32, curFood: 340, owners: ['Michael'] },
//  ];
// // 1)
//  dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));
// //  console.log(dogs);
// // 2)
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah); 
// console.log(`Sarah's dog eat too ${dogSarah.curFood > dogSarah.recFood ? 'Much' : 'Little'} `);

// // 3)

// const ownersEatTooMuch = dogs.filter(dog => dog.curFood > dog.recFood)
// .flatMap(dog => dog.owners);
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs.filter(dog => dog.curFood < dog.recFood)
// .flatMap(dog => dog.owners);
// console.log(ownersEatTooLittle);

// // 4)

// console.log(`${ownersEatTooMuch.join(' and ')}'s dog eat to much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dog eat to little!`);
 
// // 5)
// console.log(dogs.some(dog => dog.curFood === dog.recFood));

// // 6)
// // means: current > (recommended * 0.90) && current < (recommended * 1.10).
// const checkEatingOkay = dog => dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.10;
// console.log(
//   dogs.some(checkEatingOkay)
// );

// // 7)
// console.log(dogs.filter(checkEatingOkay));

// // 8)
// const dogsSorted = dogs.slice().sort((a,b) => a.recFood - b.recFood);
// console.log(dogsSorted);
///////////////////////////////////
// Conversion
console.log(Number((23)));
console.log((+'23'));
console.log(+(23 /3));

// prsing
console.log(parseInt(23));
console.log(parseInt(+'23'));
console.log(parseInt(23 /3));
console.log(parseInt('23px'));

// float
console.log(parseFloat(23));
console.log(parseFloat('23'));
console.log(parseFloat(23 /3));
console.log(parseFloat('2.5rem'));

// Math And Rounding 
console.log(Math.max(2,4,12,66,32,20,10));
console.log(Math.min(2,4,12,66,32,20,10));

console.log(Math.trunc(Math.PI ** 23 / 0.1));

console.log(Math.trunc(23.765893));

const randomInt =  (max,min) => 
  Math.trunc(Math.random() * (max - min ) + 1) + min;


console.log(randomInt(10,20));

// Rounde 
console.log(Math.round(23.3));
console.log(Math.round(23.9));

console.log(Math.ceil(23.4));
console.log(Math.ceil(23.9));

console.log(Math.floor(23.4));
console.log(Math.floor(23.9));
// fixed rounded

console.log((2.543).toFixed(0));
console.log((2.543).toFixed(2));
console.log((2.543).toFixed(3));
console.log((2.543).toFixed(1));
