document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    // Get form values
    var username = document.getElementById('username').value;
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var confirmPassword = document.getElementById('confirm-password').value;

    // Simple validation
    if (username === "" || email === "" || password === "" || confirmPassword === "") {
        document.getElementById('error-message').textContent = "Please fill out all fields.";
        return;
    }

    if (password !== confirmPassword) {
        document.getElementById('error-message').textContent = "Passwords do not match.";
        return;
    }

    // For demonstration, just log the values (in a real application, you would send these to a server)
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);

    // Clear error message
    document.getElementById('error-message').textContent = "";

    // Simulate successful registration
    alert('Sign Up successful!');
});
