document.getElementById('post-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way

    var postContent = document.getElementById('post-content').value;

    if (postContent === "") {
        document.getElementById('post-message').textContent = "Please enter a question or discussion.";
        return;
    }

    // For demonstration purposes, add a new post (in a real application, this would involve a backend call)
    var postsContainer = document.querySelector('.posts');
    var newPost = document.createElement('div');
    newPost.classList.add('post');
    newPost.innerHTML = `
        <div class="post-header">
            <strong>New User</strong> <span class="post-date">Just now</span>
        </div>
        <div class="post-body">
            <p>${postContent}</p>
        </div>
        <div class="post-actions">
            <button class="like-button">Like</button>
            <button class="comment-button">Comment</button>
            <div class="comments">
                <form class="comment-form">
                    <input type="text" class="comment-input" placeholder="Add a comment...">
                    <button type="submit" class="comment-submit">Submit</button>
                </form>
                <div class="comment-list"></div>
            </div>
        </div>
    `;
    postsContainer.appendChild(newPost);

    // Clear form message
    document.getElementById('post-message').textContent = "";
    document.getElementById('post-content').value = ""; // Clear the textarea
});
