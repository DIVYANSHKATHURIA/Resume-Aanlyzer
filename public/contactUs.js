document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get form values
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var message = document.getElementById('message').value;

    // Simple validation
    if (name === "" || email === "" || message === "") {
        document.getElementById('form-message').textContent = "Please fill out all fields.";
        return;
    }

    // For demonstration, just log the values (in a real application, you would send these to a server)
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);

    // Clear form message
    document.getElementById('form-message').textContent = "";

    // Simulate successful submission
    alert('Your message has been sent successfully!');
});
