'use strict';

let accounts = JSON.parse(window.localStorage.getItem('accounts'));

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const movementsDate = document.querySelector('.movements__date');

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
const clock = document.querySelector('.clock');

const addDate = function (date, acc) {
  const calcDaysPassed = function (day2, day1) {
    return Math.round(Math.abs(day2 - day1) / (1000 * 60 * 60 * 24));
  };

  const passedDays = calcDaysPassed(new Date(), date);

  if (passedDays === 0) return 'Today';
  if (passedDays === 1) return 'yesterday';
  if (passedDays <= 7) return `${passedDays} days ago`;

  return new Intl.DateTimeFormat(acc.locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    if (!account.movementsDates[i]) return;
    const date = new Date(account.movementsDates[i]);
    const displayDate = addDate(date, account);

    // Internationalize the transaction numbers
    const formattedMov = formatCur(mov, account.locale, account.currency);
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
  // console.log(acc.movements);
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  const formattedBalance = formatCur(acc.balance, acc.locale, acc.currency);

  labelBalance.textContent = `${formattedBalance}`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {
  const tick = function () {
    const min = `${Math.floor(time / 60)}`.padStart(2, 0);
    const sec = `${time % 60}`.padStart(2, 0);

    // In each call, print te remaining timer
    labelTimer.textContent = `${min}:${sec}`;

    // when second = 0, stop timer and logout user
    if (time === 0) {
      clearInterval(timerInt);
      // Hide UI
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Login to get started';
    }

    time--;
  };
  // set time to 5 min
  let time = 5 * 60;

  tick();
  // Call the timer every second
  const timerInt = setInterval(tick, 1000);
  return timerInt;
};

///////////////////////////////////////
// Event handlers
let currentAccount, timer;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  // console.log(accounts);
  currentAccount = accounts.find(acc => {
    return acc.email === inputLoginUsername.value;
  });
  // console.log(currentAccount);

  if (currentAccount?.password === inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    // const locale = navigator.language;
    const options = {
      minute: 'numeric',
      hour: 'numeric',
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // clear the existing timer and Start timer
    if (timer) clearInterval(timer);
    timer = startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  console.log(accounts);
  const receiverAcc = accounts.find(acc => acc.email === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  console.log(currentAccount.balance);
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.email !== currentAccount.email
  ) {
    console.log('True');
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Create transfer date and time
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateLocalStorage(currentAccount);
    updateLocalStorage(receiverAcc);

    // Update UI
    updateUI(currentAccount);

    // Reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Wait for 2.5 minutes for approval
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Create date and time for the loan request
      currentAccount.movementsDates.push(new Date().toISOString());

      updateLocalStorage(currentAccount);

      // Update UI
      updateUI(currentAccount);
    }, 2500);

    // Reset the timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.email &&
    inputClosePin.value === currentAccount.password
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    updateLocalStorageForDelete(currentAccount);
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Login to get started';
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

const updateLocalStorage = function (user) {
  console.log(accounts);
  console.log(user);

  accounts = accounts.map(acc => {
    if (acc.email === user.email) {
      return {
        ...user,
        movements: user.movements,
        movementsDates: user.movementsDates,
      };
    } else {
      return acc;
    }
  });
  localStorage.setItem('accounts', JSON.stringify(accounts));
};

const updateLocalStorageForDelete = function (user) {
  // let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  accounts = accounts.filter(acc => acc.email !== user.email);
  localStorage.setItem('accounts', JSON.stringify(accounts));
};
