**File Storage & Management API**

Demo link:
https://youtu.be/FqPSMGYCSgc

A lightweight File Storage and Management system built with Node.js, Express, and Multer. It handles multi-file uploads, file validation, dynamic directory routing, and file metadata indexing with a simple Vanilla JavaScript frontend.

**Features**
Multi-File Uploads: Upload multiple files simultaneously using multipart/form-data.

Dynamic Directory Routing: Automatically creates and routes files to user-defined target folders.

File Validation: Restricts uploads to a maximum of 10MB per file and explicitly rejects executable files (e.g., .exe, .sh, .bat).

Collision Prevention: Prepends unique timestamps to uploaded filenames.

Metadata Indexing: Recursively indexes the upload directory to retrieve file metadata (size, upload date, path).

Local File System Access: Frontend utilizes the File System Access API to read local directories and text files directly in the browser.

**Prerequisites**

Node.js (v18 or higher recommended)

A Chromium-based web browser (Chrome, Edge, Brave) to support the File System Access API features.

**Installation & Setup**
Install dependencies: Navigate to the project directory in your terminal and run:
the only required files are server.js, index.html and package.json

npm install

To Start the server:

node server.js

Access the application: Open your web browser and navigate to:
http://localhost:5000

**Tech Stack**
Backend: Node.js, Express.js

Middleware: Multer (for handling multipart/form-data)

Frontend: Vanilla HTML, CSS, JavaScript (Fetch API, File System Access API)
