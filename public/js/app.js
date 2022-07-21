let userName;
let socket = io();

do {
  userName = prompt("Enter Your Name");
} while (!userName);

const textarea = document.querySelector("#textarea");
const submintBtn = document.querySelector("#submitBtn");
const commentBox = document.querySelector(".comment_box");

submintBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let comment = textarea.value;
  if (!comment) {
    return;
  }
  postComment(comment);
});

function postComment(comment) {
  // Append comment to the DOM
  let data = {
    username: userName,
    comment: comment,
  };
  appdendToDom(data);
  textarea.value = "";

  // BroadCast the comment
  broadcastComment(data);

  // Sync with MongoDB
  syncWithDb(data);
}

function appdendToDom(data) {
  let lTag = document.createElement("li");
  lTag.classList.add("comment", "mb-3");

  let markUp = `
  
  <div class="card border-light mb-3">
         <div class="card-body">
           <h6>${data.username}</h6>
           <p>
             ${data.comment}
           </p>
           <div>
             <img src="img/clock.png" alt="clock" />
             <small>${moment(data.time).format("LT")}</small>
           </div>
         </div>
       </div>
  `;

  lTag.innerHTML = markUp;
  commentBox.prepend(lTag);
}

function broadcastComment(data) {
  // socket
  socket.emit("comment", data);
}

socket.on("comments", (data) => {
  appdendToDom(data);
});

let timerId = null;

// Debounce method for check user typing or not
function debounce(func, timer) {
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(() => {
    func();
  }, timer);
}

let typingDiv = document.querySelector(".typing");

socket.on("typing", (data) => {
  typingDiv.innerText = `${data.username} is typing....`;
  debounce(function () {
    typingDiv.innerText = "";
  }, 1000);
});

// Event Listner on textarea
textarea.addEventListener("keyup", () => {
  socket.emit("typing", { username: userName });
});

// Add comment to the database
function syncWithDb(data) {
  const headers = {
    "Content-Type": "application/json",
  };
  fetch("/api/comments", {
    method: "Post",
    body: JSON.stringify(data),
    headers,
  })
    .then((res) => res.json())
    .then((result) => {});
}

// get Comments from the database

function fatchComment() {
  fetch("/api/comments")
    .then((res) => res.json())
    .then((result) => {
      result.forEach((comment) => {
        comment.time = comment.createdAt;
        appdendToDom(comment);
      });
    });
}
window.onload = fatchComment();
