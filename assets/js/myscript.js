document.addEventListener("DOMContentLoaded", function () {
    // Select all images in the gallery
    const images = document.querySelectorAll(".gallery-item img");

    images.forEach(image => {
        image.addEventListener("click", function () {
            // Create overlay
            const overlay = document.createElement("div");
            overlay.classList.add("image-overlay");

            // Create enlarged image
            const enlargedImg = document.createElement("img");
            enlargedImg.src = this.src;
            enlargedImg.classList.add("enlarged-img");

            // Append image to overlay
            overlay.appendChild(enlargedImg);
            document.body.appendChild(overlay);

            // Remove overlay when clicked
            overlay.addEventListener("click", function () {
                overlay.remove();
            });

            // Close when Escape key is pressed
            document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                    overlay.remove();
                }
            });
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const targetID = this.getAttribute("href");
            if (targetID && targetID !== "#" && targetID.length > 1) {
                const targetElement = document.querySelector(targetID);
                if (targetElement) {
                    e.preventDefault();

                    // Get the current scroll position
                    const startPosition = window.pageYOffset;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 800; 
                    let startTime = null;

                    function animationScroll(currentTime) {
                        if (!startTime) startTime = currentTime;
                        const timeElapsed = currentTime - startTime;
                        const progress = Math.min(timeElapsed / duration, 1);

                        // Ease-in-out function
                        const ease = progress < 0.5 
                            ? 2 * progress * progress 
                            : -1 + (4 - 2 * progress) * progress;

                        window.scrollTo(0, startPosition + (distance * ease));

                        if (timeElapsed < duration) {
                            requestAnimationFrame(animationScroll);
                        }
                    }

                    requestAnimationFrame(animationScroll);
                }
            }
        });
    });
});

// Function to render a single comment on the page
function renderComment(comment) {
const commentSection = document.getElementById('commentSection');
const commentDiv = document.createElement('div');
commentDiv.className = 'comment';
commentDiv.setAttribute('data-id', comment.id);

// Create header with username and timestamp
const commentHeader = document.createElement('div');
commentHeader.className = 'comment-header';

const usernamePara = document.createElement('span');
usernamePara.className = 'commenter-username';
usernamePara.textContent = comment.username;

const timestamp = document.createElement('span');
timestamp.className = 'comment-timestamp';
timestamp.textContent = new Date(comment.timestamp).toLocaleString();

commentHeader.appendChild(usernamePara);
commentHeader.appendChild(timestamp);
commentDiv.appendChild(commentHeader);

// Create comment text
const commentSpan = document.createElement('span');
commentSpan.className = 'comment-text';
commentSpan.textContent = comment.text;
commentDiv.appendChild(commentSpan);

// Create delete button (only show for the comment author)
if (localStorage.getItem('currentUser') === comment.username) {
const deleteButton = document.createElement('button');
deleteButton.className = 'delete-btn';
deleteButton.textContent = 'Delete';
deleteButton.addEventListener('click', function() {
  commentDiv.remove();
  deleteComment(comment.id);
});
commentDiv.appendChild(deleteButton);
}

commentSection.appendChild(commentDiv);
}

// Function to load comments from localStorage and render them
function loadComments() {
const storedComments = JSON.parse(localStorage.getItem('comments')) || [];
commentSection.innerHTML = ''; // Clear existing comments

// Sort comments by timestamp in descending order (newest first)
storedComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

storedComments.forEach(function(comment) {
renderComment(comment);
});
}

// Function to delete a comment from localStorage by its ID
function deleteComment(id) {
let comments = JSON.parse(localStorage.getItem('comments')) || [];
comments = comments.filter(function(comment) {
return comment.id !== id;
});
localStorage.setItem('comments', JSON.stringify(comments));
}

// Listen for form submission to add a new comment
document.getElementById('commentForm').addEventListener('submit', function(e) {
e.preventDefault();

const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
alert('Please log in to leave a comment');
return;
}

const commentInput = document.getElementById('commentInput');
const commentText = commentInput.value.trim();

if(commentText) {
const commentObj = {
  id: Date.now(),
  username: currentUser,
  text: commentText,
  timestamp: new Date().toISOString()
};

let comments = JSON.parse(localStorage.getItem('comments')) || [];
comments.push(commentObj);
localStorage.setItem('comments', JSON.stringify(comments));

// Clear the input field
commentInput.value = '';

// Reload all comments to maintain sort order
loadComments();
}
});

// Load comments from localStorage when the page loads
loadComments();

document.addEventListener('DOMContentLoaded', function() {
const modal = document.getElementById('loginModal');
const btn = document.getElementById('loginBtn');
const span = document.getElementsByClassName('close')[0];
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginMessage = document.getElementById('loginMessage');
const signupMessage = document.getElementById('signupMessage');
const tabBtns = document.querySelectorAll('.tab-btn');
const authForms = document.querySelectorAll('.auth-form');

// Tab switching functionality
tabBtns.forEach(button => {
    button.addEventListener('click', () => {
        tabBtns.forEach(btn => btn.classList.remove('active'));
        authForms.forEach(form => form.classList.remove('active'));
        button.classList.add('active');
        const formToShow = button.getAttribute('data-tab') === 'login' ? loginForm : signupForm;
        formToShow.classList.add('active');
    });
});

// Open modal
btn.onclick = function() {
    modal.style.display = 'block';
}

// Close modal
span.onclick = function() {
    modal.style.display = 'none';
}

// Close when clicking outside
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Handle signup
signupForm.onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('newUsername').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        signupMessage.style.color = 'red';
        signupMessage.textContent = 'Passwords do not match';
        return;
    }

    // Get existing users or initialize empty array
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if username already exists
    if (users.some(user => user.username === username)) {
        signupMessage.style.color = 'red';
        signupMessage.textContent = 'Username already exists';
        return;
    }

    // Add new user
    users.push({
        username: username,
        email: email,
        password: password // In a real app, this should be hashed
    });

    localStorage.setItem('users', JSON.stringify(users));
    signupMessage.style.color = 'green';
    signupMessage.textContent = 'Sign up successful! Please login.';

    // Clear form
    signupForm.reset();

    // Switch to login tab after successful signup
    setTimeout(() => {
        tabBtns[0].click();
        signupMessage.textContent = '';
    }, 2000);
};

// Update login handler
loginForm.onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user || (username === 'admin' && password === 'password')) {
        loginMessage.style.color = 'green';
        loginMessage.textContent = 'Login successful!';
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);

        // Load user data including profile picture
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData[username] && userData[username].profileImage) {
            // Update header profile picture with saved image
            const headerProfilePic = document.getElementById('headerProfilePic');
            headerProfilePic.src = userData[username].profileImage;
        }

        setTimeout(() => {
            modal.style.display = 'none';
            loginForm.reset();
            loginMessage.textContent = '';
            updateLoginButton();
        }, 1500);
    } else {
        loginMessage.style.color = 'red';
        loginMessage.textContent = 'Invalid username or password';
    }
};

function updateLoginButton() {
    const profileContainer = document.querySelector('.profile-container');
    const headerProfilePic = document.getElementById('headerProfilePic');
    const welcomeHeader = document.getElementById('welcomeHeader');
    
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const currentUser = localStorage.getItem('currentUser');
        btn.style.display = 'none';
        profileContainer.style.display = 'flex';
        welcomeHeader.textContent = `Hello ${currentUser}`;
        
        // Load user's profile picture if exists
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData[currentUser] && userData[currentUser].profileImage) {
            headerProfilePic.src = userData[currentUser].profileImage;
        }
    } else {
        btn.style.display = 'inline-block';
        btn.textContent = 'Login';
        profileContainer.style.display = 'none';
        welcomeHeader.textContent = 'Welcome to my Portfolio';
    }
}

// Check login status on page load
updateLoginButton();
});

document.addEventListener('DOMContentLoaded', function() {
const profileBtn = document.getElementById('profileBtn');
const profileModal = document.getElementById('profileModal');
const profileCloseBtn = profileModal.querySelector('.close');
const changeImageBtn = document.getElementById('changeImageBtn');
const imageUpload = document.getElementById('imageUpload');
const profileImage = document.getElementById('profileImage');
const profileUsername = document.getElementById('profileUsername');
const saveProfileBtn = document.getElementById('saveProfileBtn');
const profileMessage = document.getElementById('profileMessage');
const headerProfilePic = document.getElementById('headerProfilePic');

// Load profile data when opening modal
profileBtn.onclick = function() {
    const currentUser = localStorage.getItem('currentUser');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    profileUsername.value = currentUser || '';
    if (userData.profileImage) {
        profileImage.src = userData.profileImage;
    }
    profileModal.style.display = 'block';
}

// Close modal
profileCloseBtn.onclick = function() {
    profileModal.style.display = 'none';
}

// Close when clicking outside
window.onclick = function(event) {
    if (event.target == profileModal) {
        profileModal.style.display = 'none';
    }
}

// Handle image upload
changeImageBtn.onclick = function() {
    imageUpload.click();
}

imageUpload.onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.size > 5000000) { // 5MB limit
            profileMessage.style.color = 'red';
            profileMessage.textContent = 'Image size must be less than 5MB';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            profileImage.src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

// Update save profile changes
saveProfileBtn.onclick = function() {
    const newUsername = profileUsername.value.trim();
    const currentUser = localStorage.getItem('currentUser');
    
    if (!newUsername) {
        profileMessage.style.color = 'red';
        profileMessage.textContent = 'Username cannot be empty';
        return;
    }

    // Get existing userData or initialize new object
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Store profile data under username key
    userData[currentUser] = {
        username: newUsername,
        profileImage: profileImage.src
    };

    // Update localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('currentUser', newUsername);
    
    // Update header profile picture
    headerProfilePic.src = profileImage.src;
    
    // Show success message
    profileMessage.style.color = 'green';
    profileMessage.textContent = 'Profile updated successfully!';
    
    setTimeout(() => {
        profileMessage.textContent = '';
        profileModal.style.display = 'none';
    }, 2000);
}
});

document.addEventListener('DOMContentLoaded', function() {
const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.onclick = function() {
    // Clear all authentication-related data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userData');
    
    // Update UI elements
    const loginBtn = document.getElementById('loginBtn');
    const profileContainer = document.querySelector('.profile-container');
    
    loginBtn.style.display = 'inline-block';
    profileContainer.style.display = 'none';
    
    // Redirect to home page
    window.location.href = '#';
    window.location.reload();
}
});