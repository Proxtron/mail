document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);
  

  load_mailbox('inbox');
});

function load_email(id_number) {
  //Show email view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';
  
  //Gets email from database by id number and displays it
  fetch(`/emails/${id_number}`)
  .then(response => response.json())
  .then(email => {
    document.querySelector('#email-view').innerHTML = `${email.body}`
  });
}
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  const email_view_element = document.querySelector('#emails-view');
  email_view_element.innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //Access the Database for the emails in the mailbox and display them
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
    
    //Creates elements to display each email
    email_view_element.innerHTML += `<div id='emails-list' class='container-fluid'>`;
    emails.forEach(email => {
      document.querySelector('#emails-list').innerHTML += `
        <div class='row border border-secondary email' data-idnum=${email.id}>
          <div class='col-auto'>
            <p class='font-weight-bold my-2 text-nowrap overflow-auto'>${email.sender}</p>  
          </div>
          <div class='col'>
            <p class='my-2'>${email.subject}</p>  
          </div>
          <div class='col-auto'>
            <p class='my-2'>${email.timestamp}</p>
          </div>
        </div>
      `;
    });
    email_view_element.innerHTML += `</div>`;

    //Iterates over all email divs and adds a click listener to them
    const email_element_list = document.querySelectorAll('.email');
    email_element_list.forEach(email_element => {
      email_element.addEventListener('click', () => {

        //Retrieves the email id when the email div box is clicked on and displays in load_email
        let id_number = email_element.dataset.idnum;
        load_email(id_number);
      })
    })
  });

  
}

function send_email(event) {
  //Stops default behavior (redirecting to url '/?')
  event.preventDefault();

  //Storing data in input fields
  const recipients = document.querySelector('#compose-recipients').value
  const subject = document.querySelector('#compose-subject').value
  const body = document.querySelector('#compose-body').value

  //Sending email data to server and redirecting to sent mailbox
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject, 
      body: body
    })
  })
  .then(response => response.json())
  .then(result => {
    load_mailbox('sent');
  });

}