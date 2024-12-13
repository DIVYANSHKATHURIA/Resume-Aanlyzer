document.getElementById('signin-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get form values
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Simple validation (for demonstration purposes)
    if (email === "" || password === "") {
        document.getElementById('error-message').textContent = "Please fill out all fields.";
        return;
    }

    // For demonstration, just log the values (in a real application, you would send these to a server)
    console.log('Email:', email);
    console.log('Password:', password);

    // Clear error message
    document.getElementById('error-message').textContent = "";

    // Simulate successful submission
    alert('Sign In successful!');
});
