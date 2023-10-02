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
  
  
  
  const movements =  [200, 455, -306, 25000, -642, -133, 79, 1300];
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


  movements.forEach((mov,i) => {
   if(mov > 0) {
    console.log(`Movements${i + 1}:You Deposited ${mov}`)
   } else {
    console.log(`Movements${i + 1}:You Withdraw ${Math.abs(mov)}`);
   }
  });

  const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

console.log(currencies);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

const checkDogs = function(dogsJulias,dogsKate) {
  const dogsJuliaCorrected  = dogsJulias.slice();
  dogsJuliaCorrected.splice(0,2);
  dogsJuliaCorrected.splice(-2);

  const dogs = dogsJuliaCorrected.concat(dogsKate);
  console.log(dogs);

  dogs.forEach((dogs,i) => {
    const dogAge =
      dogs > 3
        ? `Dog Number ${i + 1}: is an adult, and is ${dogs} years old`
        : `Dog Number ${i + 1}: is an still, a ${dogs} puppy🐶`;
        
        console.log(dogAge);
      })
    };

checkDogs([3, 5, 2, 12, 7],[4, 1, 15, 8, 3]);
checkDogs([4, 6, 8, 13, 7],[3, 4, 17, 5, 10]);

const createUsername = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner
   .toLowerCase()
   .split(' ')
   .map(name => name[0])
   .join('');
  });  
};
createUsername(accounts);
console.log(accounts);

const withdrawal = movements.filter(function(mov) {
  return mov < 0;
});

console.log(withdrawal);

const humanAgeCalculate = function(ages) {
  const humanAge = ages.map(age => (age <=2 ? 2 * age : 16 + age * 4));
  const adults = humanAge.filter( age => age >= 18);

  console.log(humanAge);
  console.log(adults);
  const average = adults.reduce((acc,age) => acc + age / adults.length,0);
  return average;
}

const avg2 = humanAgeCalculate([5, 2, 4, 1, 15, 8, 3]);
const avg1 = humanAgeCalculate([16, 6, 10, 5, 6, 1, 3, 4]);

console.log(avg1,avg2);

let curentAccount;

btnLogin.addEventListener('click',function(e) {
  e.preventDefault();

  curentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(curentAccount);

  if(curentAccount.pin === Number(inputLoginPin.value)){
    labelWelcome.textContent = `Welcome back, ${curentAccount.owner.split(' ')[0]} `

    containerApp.style.opacity = 100;

  }; 

})

const anyDeposite = movements.some(mov => mov > 0);
console.log(anyDeposite);

console.log(movements.some(mov=> mov === -133));

console.log(movements.every(mov => mov > 0));


const deposite = accounts.flatMap(acc => acc.movements)
.filter(mov => mov > 0)
.reduce((sum,cur) => sum + cur, 0);

console.log(deposite);

const fltaDeposite = accounts.flatMap(acc => acc.movements)
.reduce((count,cur) =>(cur >= 1000? ++count : count),0);

console.log(fltaDeposite);

const  {deposits, withdrawals} = accounts.flatMap(acc => acc.movements)
.reduce((sums,cur) => {
  sums[cur > 0 ? 'deposits': 'withdrawals'] += cur;
  return sums;
},

  {deposits:0 , withdrawals: 0},
)
console.log(deposits,withdrawals);

console.log('------round------');

console.log(Math.round(20.3));
console.log(Math.round(20.6));
console.log('------ceil------');
console.log(Math.ceil(10.3));
console.log(Math.ceil(10.9));

console.log('------floor------');

console.log(Math.floor(30.3));
console.log(Math.floor(-30.6));


const isEvenOdd = n => n % 2 ? 'Even' : 'Odd';

console.log(isEvenOdd(2));
console.log(isEvenOdd(8));
console.log(isEvenOdd(7));
console.log(isEvenOdd(2));
console.log(isEvenOdd(9));
console.log(isEvenOdd(10));
console.log(isEvenOdd(11));
console.log(isEvenOdd(13));

const now = new Date();

// console.log(now.getDate());
// console.log(now.getFullYear());
// console.log(now.getHours());
// console.log(now.getMinutes());
const option = {
  hours: 'numeric',
  minutes: 'numeric',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};

const intDate = Intl.DateTimeFormat('hi-IN', option).format(now);
console.log(intDate)



// console.log(now);
