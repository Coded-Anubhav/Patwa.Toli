// Sample client-side authentication for demonstration
document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();
  
  // Retrieve user inputs
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  
  /*
    For this demo, we're hardcoding valid credentials.
    In a production app, you would implement proper server-side authentication.
    Valid credentials for demonstration:
      Community ID: "PatwaToliMember"
      Membership Code: "premium2025"
  */
  if (username === "PatwaToliMember" && password === "premium2025") {
    // Store user session and show the main Social Media interface
    localStorage.setItem('loggedIn', 'true');
    showApp();
  } else {
    alert("Access Denied. Incorrect membership credentials.");
  }
});

// Show the app if the user is logged in
if (localStorage.getItem('loggedIn') === 'true') {
  showApp();
}

function showApp() {
  document.getElementById('login').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  loadPosts();
}

// Logout functionality
document.getElementById('logout').addEventListener('click', function() {
  localStorage.removeItem('loggedIn');
  location.reload();
});

// Post functionality
document.getElementById('post-button').addEventListener('click', function() {
  const postContent = document.getElementById('post-content').value.trim();
  if (postContent) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.push({ content: postContent, likes: 0, comments: [] });
    localStorage.setItem('posts', JSON.stringify(posts));
    document.getElementById('post-content').value = '';
    loadPosts();
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
      <div class="post-actions">
        <button onclick="likePost(${index})">Like (${post.likes})</button>
        <button onclick="showCommentBox(${index})">Comment</button>
      </div>
      <div class="comments" id="comments-${index}">
        ${post.comments.map(comment => `<div class="comment">${comment}</div>`).join('')}
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
  const commentContent = document.getElementById(`comment-content-${index}`).value.trim();
  if (commentContent) {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts[index].comments.push(commentContent);
    localStorage.setItem('posts', JSON.stringify(posts));
    document.getElementById(`comment-content-${index}`).value = '';
    loadPosts();
  }
}
