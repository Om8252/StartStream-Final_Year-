import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import crypto from 'crypto';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { Server } from 'socket.io';
import http from 'http';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [`http://localhost:3000`, `http://localhost:3001`],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

app.use(cors({
  origin: [`http://localhost:3000`, `http://localhost:3001`],// Replace with your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folderPath;

    // Dynamically set destination based on the route
    if (req.originalUrl.includes('/pitch')) {
      folderPath = './uploads/pitch'; // Store in the 'pitch' folder for pitch uploads
    } else if (req.originalUrl.includes('/signup')) {
      folderPath = './uploads/Profile'; // Store in the 'Profile' folder for user profile images
    }else if (req.originalUrl.includes('/payment')) {
      folderPath = './uploads/qrcode'; // Store in the 'Profile' folder for user profile images
    } else {
      return cb(new Error('Invalid route for file upload'), false); // Handle invalid routes
    }

    // Check if the directory exists, and create it if it does not
    fs.exists(folderPath, (exists) => {
      if (!exists) {
        fs.mkdirSync(folderPath, { recursive: true }); // Create the folder if it doesn't exist
      }
      cb(null, folderPath); // Proceed with the upload
    });
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname); // Get the file extension
    cb(null, `${timestamp}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'video/mp4', 'video/webm'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, PDF, or MP4 files are allowed'));
    }
  },
});






const sessionSecret = crypto.randomBytes(64).toString('hex');
const jwtkey = crypto.randomBytes(32).toString('hex');



app.use(session({
  secret: sessionSecret,  // Auto-generated secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, httpOnly: true, }  // Set to true if using HTTPS ,httpOnly use pervent to cookies
}));


const JWT_SECRET = jwtkey; // Replace with your own secret key



// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost', // Change to your MySQL host
  user: 'root', // Your MySQL username
  password: '', // Your MySQL password
  database: 'sharktankinvestor' // Your MySQL database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});


app.get('/', (req, res) => {
  res.send('I am connected fokes ');
});

app.post('/signup', upload.single('profilePhoto'), (req, res) => {
  const { Username, fname, mname, lname, email, Phone, password, role } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'Profile image is required', success: false });
  }

  // Construct the file path to store in the database
  const ProfilePhoto = `/uploads/Profile/${req.file.filename}`;

  const checkQuery = "SELECT COUNT(*) AS count FROM users WHERE Username = ? OR email = ?";
  db.query(checkQuery, [Username, email], (err, results) => {
    if (err) {
      console.error('Error checking username or email:', err);
      return res.status(500).json({ message: 'Server error, please try again later.', success: false });
    }

    if (results[0].count > 0) {
      return res.status(400).json({ message: 'Username or email already exists.', success: false });
    }

    const insertQuery = "INSERT INTO users (ProfileImg, Username, fname, mname, lname, email,Phone, password, role) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(insertQuery, [ProfilePhoto, Username, fname, mname, lname, email, Phone, password, role], (err) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ message: 'Error signing up, please try again.', success: false });
      }

      res.status(201).json({ message: 'User signed up successfully', success: true });
    });
  });
});





app.post('/Login', (req, res) => {
  const { identifier, password } = req.body; // 'identifier' can be email or username.

  // Query to find user by email or username along with password
  const sql = 'SELECT * FROM users WHERE (email = ? OR Username = ?) AND password = ?';

  db.query(sql, [identifier, identifier, password], (err, result) => {
    if (err) return res.status(500).json({ message: 'Server error' });

    if (result.length === 0) {
      return res.status(400).json({ message: 'Wrong email/username or password' });
    }

    const user = result[0];

    // Create JWT token
    const token = jwt.sign({
      id: user.id,
      Profile: user.ProfileImg,
      Username: user.Username,
      email: user.email,
      fname: user.fname,
      mname: user.mname,
      lname: user.lname,
      Phone: user.Phone,
      role: user.role
    }, JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });

    // Set session with token
    req.session.token = token;

    // Send success response with the token
    res.status(200).json({
      message: 'Login successful',
      token: token,
      user: {
        id: user.id,
        Profile: user.ProfileImg,
        Username: user.Username,
        fname: user.fname,
        mname: user.mname,
        lname: user.lname,
        Phone: user.Phone,
        email: user.email,
        role: user.role
      }
    });
  });
});



function verifyToken(req, res, next) {
  const token = req.session.token;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = decoded;  // Add user data to request object
    next();
  });
}


app.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed', success: false });
    }
    res.status(200).json({ message: 'Logout successful', success: true });
  });
});


app.get('/dashboard', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Welcome to the dashboard',
    user: req.user,  // Access user details from token if needed
  });
});


app.get('/userCount', (req, res) => {
  // Construct the query to count users grouped by role
  const query = 'SELECT role, COUNT(*) as count FROM users GROUP BY role';

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching user role count:', err);
      return res.status(500).json({ message: 'Error fetching user role count', success: false });
    }

    // Initialize counts for teacher and student


    let InvestorCount = 0;
    let SeakerCount = 0;


    // Loop through results to assign counts
    results.forEach(row => {
      if (row.role === 'Investor') {
        InvestorCount = row.count;
      } else if (row.role === 'InvestorSeaker') {
        SeakerCount = row.count;
      }
    });

    // Return the teacher and student counts
    res.status(200).json({
      InvestorCount: InvestorCount,
      SeakerCount: SeakerCount,
      Users: InvestorCount + SeakerCount,

      success: true
    });
  });
});

// Get all users

app.get('/users', (req, res) => {
  // Construct the query to fetch all users except the password and those with the role of 'admin'
  const query = "SELECT id ,fname, mname, lname, email, role FROM users WHERE role != 'admin'";

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ message: 'Error retrieving users', success: false });
    }

    // Return the list of users without password and excluding admin
    res.status(200).json({ users: results, success: true });
  });
});

app.put('/update-user/:id', (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL parameter
  const { fname, mname, lname, email, password, role } = req.body;

  // Check if the password field is empty (indicating no password change)
  let query = '';
  let queryParams = [fname, mname, lname, email, role, userId];

  if (password) {
    // If password is provided, include it in the query
    query = "UPDATE users SET fname = ?, mname = ?, lname = ?, email = ?, password = ?, role = ? WHERE id = ?";
    queryParams = [fname, mname, lname, email, password, role, userId];
  } else {
    // If password is not provided, don't update the password
    query = "UPDATE users SET fname = ?, mname = ?, lname = ?, email = ?, role = ? WHERE id = ?";
  }

  // Execute the query
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Error updating user', success: false });
    }

    if (results.affectedRows === 0) {
      // If no rows were affected, the user ID may not exist
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Return success message and success flag
    res.status(200).json({ message: 'User updated successfully', success: true });
  });
});

// Get user by ID
app.get('/get-user/:id', (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL parameter

  // SQL query to fetch the user by ID
  const query = "SELECT id, fname, mname, lname, email,Phone, role FROM users WHERE id = ?";

  // Execute the query
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Error fetching user', success: false });
    }

    if (results.length === 0) {
      // If no user is found with the provided ID
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Return the user data
    res.status(200).json({ data: results[0], success: true });
  });
});



// Get user by ID
app.get('/get-user/:Username', (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL parameter

  // SQL query to fetch the user by ID
  const query = "SELECT id, fname, mname, lname, email,Phone, role FROM users WHERE id = ?";

  // Execute the query
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ message: 'Error fetching user', success: false });
    }

    if (results.length === 0) {
      // If no user is found with the provided ID
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Return the user data
    res.status(200).json({ data: results[0], success: true });
  });
});


// Delete user by ID
app.delete('/delete-user/:id', (req, res) => {
  const userId = req.params.id; // Get the user ID from the URL parameter

  // SQL query to delete the user by ID
  const query = "DELETE FROM users WHERE id = ?";

  // Execute the query
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Error deleting user', success: false });
    }

    // Check if any rows were affected (meaning a user was deleted)
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found', success: false });
    }

    // Return a success message
    res.status(200).json({ message: 'User deleted successfully', success: true });
  });
});



//add pitch

app.post('/pitch', upload.single('File'), (req, res) => {
  const { title, description, category, userId } = req.body;

  let File = req.file ? req.file.path : null; // Path of the uploaded file

  if (!File) {
    return res.status(400).json({ message: 'File upload is required', success: false });
  }

  // Replace backslashes with forward slashes
  File = File.replace(/\\/g, '/');

  // Construct the query
  const query = 'INSERT INTO pitch (pitch_title, description, category, userid, File) VALUES (?, ?, ?, ?, ?)';

  // Execute the query
  db.query(query, [title, description, category, userId, File], (err, results) => {
    if (err) {
      console.error('Error inserting pitch data:', err);
      return res.status(500).json({ message: 'Failed to add pitch', success: false });
    }
    res.status(201).json({ message: 'Pitch added successfully!', pitchId: results.insertId, success: true });
  });
});






//all pitches
app.get('/pitchg', (req, res) => {
  // Construct the query to fetch pitches with the corresponding username
  const query = `
    SELECT 
      p.id, 
      p.pitch_title, 
      p.category, 
      p.description, 
      p.Accept, 
      p.Reject,
      p.File, 
      u.ProfileImg ,
      u.username,
      u.id as userid
    FROM 
      pitch p
    JOIN 
      users u
    ON 
      p.userId = u.id
  `;

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching pitches:', err);
      return res.status(500).json({ message: 'Error retrieving pitches', success: false });
    }

    // Return the list of pitches with usernames
    res.status(200).json({ pitches: results, success: true });
  });
});





app.get('/pitch/:id', (req, res) => {
  const userId = req.params.id;

  // Construct the query to fetch pitches along with user details
  const query = `
    SELECT 
      p.id, p.pitch_title, p.description, p.category, p.File,p.Accept,
      u.username, u.fname, u.lname
    FROM pitch p
    JOIN users u ON p.userid = u.id
    WHERE p.userid = ?
  `;

  // Execute the query with the userId parameter
  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching pitches:', err);
      return res.status(500).json({ message: 'Error retrieving pitches', success: false });
    }

    // Return the list of pitches along with user details
    res.status(200).json({ pitches: results, success: true });
  });
});







app.get('/pitchCount', (req, res) => {
  // Construct the query to count all pitches
  const query = 'SELECT COUNT(*) as pitchCount FROM pitch';

  // Execute the query
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching pitch count:', err);
      return res.status(500).json({ message: 'Error fetching pitch count', success: false });
    }

    // Return the pitch count
    res.status(200).json({
      pitchCount: results[0].pitchCount,
      success: true
    });
  });
});


app.put('/accept', (req, res) => {
  const { pitchId, userId } = req.body;  // Expecting pitchId and userId from the request body

  if (!pitchId || !userId) {
    return res.status(400).json({ message: 'Pitch ID and User ID are required.' });
  }

  // Start a transaction to ensure atomicity
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to begin transaction', success: false });
    }

    // First, check if the user ID exists in the Reject column
    const checkRejectQuery = `SELECT Reject FROM pitch WHERE id = ?`;

    db.query(checkRejectQuery, [pitchId], (err, results) => {
      if (err) {
        return db.rollback(() => {
          console.error('Error fetching pitch:', err);
          res.status(500).json({ message: 'Failed to fetch pitch', success: false });
        });
      }

      if (results.length > 0) {
        const rejectColumn = results[0].Reject || '';

        // Remove the userId from the Reject column if it exists
        let updatedRejectColumn = rejectColumn.split(',').filter(id => id !== userId.toString()).join(',');

        // Update the Reject column by removing the userId if it exists
        const updateRejectQuery = `UPDATE pitch SET Reject = ? WHERE id = ?`;

        db.query(updateRejectQuery, [updatedRejectColumn, pitchId], (err) => {
          if (err) {
            return db.rollback(() => {
              console.error('Error updating Reject column:', err);
              res.status(500).json({ message: 'Failed to update Reject column', success: false });
            });
          }

          // Now, append the userId to the Accept column (comma-separated)
          const updateAcceptQuery = `
            UPDATE pitch
            SET Accept = CONCAT(IFNULL(Accept, ''), IF(LENGTH(IFNULL(Accept, '')) > 0, ',', ''), ?)
            WHERE id = ?
          `;

          db.query(updateAcceptQuery, [userId, pitchId], (err, results) => {
            if (err) {
              return db.rollback(() => {
                console.error('Error updating Accept column:', err);
                res.status(500).json({ message: 'Failed to accept pitch', success: false });
              });
            }

            if (results.affectedRows > 0) {
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error('Error committing transaction:', err);
                    res.status(500).json({ message: 'Failed to commit transaction', success: false });
                  });
                }
                res.status(200).json({ message: 'Pitch accepted successfully!', success: true });
              });
            } else {
              db.rollback(() => {
                res.status(404).json({ message: 'Pitch not found', success: false });
              });
            }
          });
        });
      } else {
        db.rollback(() => {
          res.status(404).json({ message: 'Pitch not found', success: false });
        });
      }
    });
  });
});

//accepted user 

app.put('/Reject', (req, res) => {
  const { pitchId, userId } = req.body;  // Expecting pitchId and userId from the request body

  if (!pitchId || !userId) {
    return res.status(400).json({ message: 'Pitch ID and User ID are required.' });
  }

  // Query to append the userId to the Reject column (comma-separated string)
  const query = `
    UPDATE pitch
    SET Reject = CONCAT(IFNULL(Reject, ''), IF(LENGTH(IFNULL(Reject, '')) > 0, ',', ''), ?)
    WHERE id = ?
  `;

  db.query(query, [userId, pitchId], (err, results) => {
    if (err) {
      console.error('Error updating pitch rejection:', err);
      return res.status(500).json({ message: 'Failed to reject pitch', success: false });
    }

    if (results.affectedRows > 0) {
      res.status(200).json({ message: 'Pitch Rejected successfully!', success: true });
    } else {
      res.status(404).json({ message: 'Pitch not found', success: false });
    }
  });
});




//update pitch
app.put('/pitch/:pitchId', (req, res) => {
  const { pitchId } = req.params;
  const { title, description, category } = req.body;

  // Construct the query without updating the userId
  const query = "UPDATE pitch SET pitch_title = ?, description = ?, category = ? WHERE id = ?";

  // Execute the query
  db.query(query, [title, description, category, pitchId], (err, results) => {
    if (err) {
      console.error('Error updating pitch data:', err);
      return res.status(500).json({ message: 'Failed to update pitch', success: false });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Pitch not found', success: false });
    }

    res.status(200).json({ message: 'Pitch updated successfully!', success: true });
  });
});

app.get('/categories', (req, res) => {
  // Construct the query to fetch pitches for a specific user
  const query = "SELECT * FROM categories";

  // Execute the query with the userId parameter
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ message: 'Error retrieving categories', success: false });
    }

    // Return the list of pitches for the specific user
    res.status(200).json({ categories: results, success: true });
  });
});


app.post('/Add_categories', (req, res) => {
  const { category } = req.body;

  // Construct the query
  const query = "INSERT INTO categories (Categories_name) VALUES (?)";

  // Execute the query
  db.query(query, [category], (err, results) => {

    if (err) {
      console.error('Error inserting category data:', err);
      return res.status(500).json({ message: 'Failed to add category', success: false });
    }
    res.status(201).json({ message: 'category added successfully!', category: results.insertId, success: true });
  });
});


const onlineUsers = {};


io.on("connection", (socket) => {
  // console.log("A user connected",socket.id);

  // Join chat room
  socket.on("joinRoom", ({ userId1, userId2 }) => {
    const roomId = [userId1, userId2].sort().join("_"); // Unique room ID
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);

    onlineUsers[userId1] = socket.id;
    console.log(`User ${userId1} is online`);

    // Emit updated online users list
    io.emit("updateOnlineUsers", Object.keys(onlineUsers));

    console.log(`User joined room: ${roomId}`);

  });

  // Handle sending messages
  socket.on("sendMessage", ({ sender, receiver, message }) => {
    console.log(`Message from ${sender} to ${receiver}: ${message}`);

    // Store message in MySQL database
    const insertQuery =
      "INSERT INTO message (Sender_id, Reciver_id, Content, timestamp,is_read) VALUES (?, ?, ?, NOW(), 0)";

    db.query(insertQuery, [sender, receiver, message], (err) => {
      if (err) {
        console.error("Error saving message:", err);
      } else {
        console.log("Message saved successfully");

        // Emit message to the chat room
        const newMessage = { Sender_id: sender, Reciver_id: receiver, Content: message, timestamp: new Date(), is_read: false };
        const roomId = [sender, receiver].sort().join("_");
        io.to(roomId).emit("receiveMessage", newMessage);
      }
    });
  });

  // Fetch chat history
  socket.on("fetchChat", ({ userId1, userId2 }) => {
    const query = `
     SELECT 
    m.Sender_id, 
    m.Reciver_id, 
    m.Content, 
    m.timestamp,
     m.is_read,
    us.ProfileImg AS SenderProfileImg,
    us.username AS SenderUsername,
    us.fname AS SenderFname,
    us.mname AS SenderMname,
    us.lname AS SenderLname,
    ur.ProfileImg AS ReceiverProfileImg,
    ur.username AS ReceiverUsername,
    ur.fname AS ReceiverFname,
    ur.mname AS ReceiverMname,
    ur.lname AS ReceiverLname
FROM message m
JOIN users us ON m.Sender_id = us.id
JOIN users ur ON m.Reciver_id = ur.id
WHERE 
    (m.Sender_id = ? AND m.Reciver_id = ?) 
    OR 
    (m.Sender_id = ? AND m.Reciver_id = ?)
ORDER BY m.timestamp ASC;
    `;

    db.query(query, [userId1, userId2, userId2, userId1], (err, results) => {
      if (err) {
        console.error("Error fetching messages:", err);
        socket.emit("fetchChatError", { error: "Database error" });
      } else {
        socket.emit("chatHistory", results);
      }
    });
  });


  // Mark messages as read when the receiver opens the chat
  socket.on("markAsRead",  ({ sender, receiver }) => {
    const updateQuery = `
      UPDATE message 
      SET is_read = 1 
      WHERE Sender_id = ? AND Reciver_id = ? AND is_read = 0
    `;

    db.query(updateQuery, [sender, receiver], (err) => {
      if (err) {
        console.error("Error updating message status:", err);
      } else {
        console.log(`Messages from ${sender} to ${receiver} marked as read`);

        // Notify sender that messages were read
        const senderSocketId = onlineUsers[sender];
        if (senderSocketId) {
          io.to(senderSocketId).emit("messagesRead", { sender, receiver });
        }
      }
    });
  });

  
 


  socket.on("disconnect", () => {
    const userId = Object.keys(onlineUsers).find(key => onlineUsers[key] === socket.id);
    if (userId) {
      delete onlineUsers[userId];
      console.log(`User ${userId} disconnected`);

      // Emit updated online users list
      io.emit("updateOnlineUsers", Object.keys(onlineUsers));
    }
  });
});




app.get("/messages/:userId", (req, res) => {
  const { userId } = req.params;
  const query = `
    SELECT DISTINCT u.id, u.fname, u.mname, u.lname,u.ProfileImg, u.username
    FROM message m
    JOIN users u 
      ON u.id = m.Sender_id OR u.id = m.Reciver_id
    WHERE m.Sender_id = ? OR m.Reciver_id = ?
    AND u.id != ?;
  `;

  db.query(query, [userId, userId, userId], (err, results) => {
    if (err) {
      return res.json({ success: false, Content: "Database error", error: err });
    }
    res.json({ success: true, Content: results });
  });
});


app.post('/payment', upload.single('qrCodeFile'), (req, res) => {
  const { amount, senderId, receiverId } = req.body;

  if (!req.file) {
    return res.status(400).json({ message: 'QR code image is required', success: false });
  }

  // Construct the file path to store in the database
  const qrCodeUrl = `/uploads/qrcode/${req.file.filename}`;

  // Insert payment data into the database
  const insertQuery = `
    INSERT INTO payments (amount, sender_id, receiver_id, qr_code_url)
    VALUES (?, ?, ?, ?)
  `;
  const values = [amount, senderId, receiverId, qrCodeUrl];

  db.query(insertQuery, values, (err, result) => {
    if (err) {
      console.error('Error inserting payment:', err);
      return res.status(500).json({ message: 'Error processing payment, please try again.', success: false });
    }

    res.status(201).json({ 
      message: 'Payment request created successfully', 
      success: true,
      paymentId: result.insertId,
      qrCodeUrl,
    });
  });
});


const port = 8081;

server.listen(port, () => {
  console.log(`Server is running http://localhost:${port} `);
});
