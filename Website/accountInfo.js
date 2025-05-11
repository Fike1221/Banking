const form = document.querySelector('.modal__form');

const account = {
  owner: 'Abel Adhanom',
  movements: [0],
  interestRate: 1.5,
  password: 2222,

  movementsDates: [
    '2024-11-01T13:15:33.035Z',
    '2024-11-30T09:48:16.867Z',
    '2024-12-25T06:04:23.907Z',
    '2025-01-25T14:18:46.235Z',
    '2025-04-02T16:33:06.386Z',
    '2025-04-06T14:43:26.374Z',
    '2025-04-07T18:49:59.371Z',
    '2025-04-08T12:01:20.894Z',
  ],
  currency: 'ETB',
  locale: 'en-ET',
};

const accounts = JSON.parse(window.localStorage.getItem('accounts')) ?? [];
console.log();
form.addEventListener('submit', function () {
  console.log('Hello');
  const fname = document.querySelector('.fname').value;
  const lname = document.querySelector('.lname').value;
  const email = document.querySelector('.email').value;
  const password = document.querySelector('.password').value;

  account.owner = `${fname} ${lname}`;
  account.email = email;
  account.password = password;
  account.movements = [100];
  account.interestRate = 1.5;
  account.movementsDates = [`${new Date().toISOString()}`];
  account.currency = 'ETB';
  account.locale = 'am-ET';

  accounts.push(account);

  window.localStorage.setItem('accounts', JSON.stringify(accounts));
});
