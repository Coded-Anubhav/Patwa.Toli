// Utility function to sanitize user input to prevent XSS
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(input));
  return div.innerHTML;
}

// Utility function to hash passwords for basic security
function hashPassword(password) {
  return btoa(password); // Base64 encoding as a simple hash substitute (for demo purposes only)
}

// Sample client-side authentication for demonstration
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Retrieve user inputs
  const username = sanitizeInput(document.getElementById('login-username').value.trim());
  const password = hashPassword(sanitizeInput(document.getElementById('login-password').value.trim()));

  // Retrieve stored users
  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[username] && users[username].password === password) {
    // Store user session and show the main Social Media interface
    localStorage.setItem('loggedIn', username);
    showApp();
  } else {
    alert("Invalid username or password.");
  }
});

// Show the app if the user is logged in
if (localStorage.getItem('loggedIn')) {
  showApp();
}

function showApp() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('signup').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  loadPosts();
}

// Logout functionality
document.getElementById('logout').addEventListener('click', function() {
  localStorage.removeItem('loggedIn');
  location.reload();
});

// Sign-Up functionality
document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault();

  // Retrieve user inputs
  const username = sanitizeInput(document.getElementById('signup-username').value.trim());
  const password = hashPassword(sanitizeInput(document.getElementById('signup-password').value.trim()));

  // Retrieve stored users
  const users = JSON.parse(localStorage.getItem('users')) || {};

  if (users[username]) {
    alert("Username already exists. Please choose a different username.");
  } else {
    users[username] = { password: password };
    localStorage.setItem('users', JSON.stringify(users));
    alert("Sign-Up successful. Please login.");
    document.getElementById('show-login').click();
  }
});

// Toggle between login and sign-up forms
document.getElementById('show-signup').addEventListener('click', function() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('signup').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function() {
  document.getElementById('signup').style.display = 'none';
  document.getElementById('login').style.display = 'block';
});

// Post functionality
document.getElementById('post-button').addEventListener('click', function() {
  const postContent = sanitizeInput(document.getElementById('post-content').value.trim());
  const postMedia = document.getElementById('post-media').files[0];

  if (postContent || postMedia) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const reader = new FileReader();

    reader.onload = function(event) {
      posts.push({
        content: postContent,
        media: event.target.result,
        likes: 0,
        comments: []
      });
      localStorage.setItem('posts', JSON.stringify(posts));
      document.getElementById('post-content').value = '';
      document.getElementById('post-media').value = '';
      loadPosts();
    };

    if (postMedia) {
      reader.readAsDataURL(postMedia);
    } else {
      reader.onload({ target: { result: null } });
    }
  }
});

function loadPosts() {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  const postsContainer = document.getElementById('posts');
  postsContainer.innerHTML = '';
  posts.forEach((post, index) => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
      <div class="post-content">${post.content}</div>
      ${post.media ? `<img src="${post.media}" class="post-media">` : ''}
      <div class="post-actions">
        <button onclick="likePost(${index})">Like (${post.likes})</button>
        <button onclick="showCommentBox(${index})">Comment</button>
      </div>
      <div class="comments" id="comments-${index}">
        ${post.comments.map(comment => `<div class="comment">${sanitizeInput(comment)}</div>`).join('')}
      </div>
      <div class="comment-box" id="comment-box-${index}" style="display:none">
        <textarea id="comment-content-${index}" placeholder="Write a comment..."></textarea>
        <button onclick="addComment(${index})">Add Comment</button>
      </div>
    `;
    postsContainer.appendChild(postElement);
  });
}

function likePost(index) {
  const posts = JSON.parse(localStorage.getItem('posts')) || [];
  posts[index].likes += 1;
  localStorage.setItem('posts', JSON.stringify(posts));
  loadPosts();
}

function showCommentBox(index) {
  document.getElementById(`comment-box-${index}`).style.display = 'block';
}

function addComment(index) {
  const commentContent = sanitizeInput(document.getElementById(`comment-content-${index}`).value.trim());
  if (commentContent) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[index].comments.push(commentContent);
    localStorage.setItem('posts', JSON.stringify(posts));
    document.getElementById(`comment-content-${index}`).value = '';
    loadPosts();
  }
}
