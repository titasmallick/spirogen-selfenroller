import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import readline from "readline";
import admin from "firebase-admin";
import fetch from "node-fetch";
import fs from "fs";

dotenv.config();

// Firebase Admin SDK initialization
// import serviceAccount from "./admin-cred.json" assert { type: "json" };
const serviceAccount = JSON.parse(fs.readFileSync("./admin-cred.json", "utf8"));
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ANSI escape codes for styling
const styles = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  underline: "\x1b[4m",
  fg: {
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    magenta: "\x1b[35m",
    blue: "\x1b[34m",
    white: "\x1b[37m",
  },
  bg: {
    black: "\x1b[40m",
    cyan: "\x1b[46m",
  },
};

// Display the title
console.log(
  `\n${styles.bold}${styles.fg.cyan}==== Spirogen Public Enrollment Link Generator ====${styles.reset}\n`
);

// Function to fetch all Firebase Auth users
const fetchUsers = async () => {
  try {
    const users = [];
    let nextPageToken;

    do {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      result.users.forEach((userRecord) => {
        users.push({
          uid: userRecord.uid,
          name: userRecord.displayName || "No Name",
        });
      });
      nextPageToken = result.pageToken;
    } while (nextPageToken);

    return users;
  } catch (error) {
    console.error(
      `${styles.fg.red}Error fetching users: ${error.message}${styles.reset}`
    );
    return [];
  }
};

// Function to prompt user to select a UID
const promptUserSelection = (users) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log(
      `${styles.underline}${styles.fg.green}Select a user by typing their number:${styles.reset}`
    );
    users.forEach((user, index) => {
      console.log(
        `${styles.fg.yellow}${index + 1}. ${user.name} (${user.uid})${
          styles.reset
        }`
      );
    });

    rl.question(
      `\n${styles.bold}Enter the number:${styles.reset} `,
      (answer) => {
        const selectedIndex = parseInt(answer) - 1;
        if (
          isNaN(selectedIndex) ||
          selectedIndex < 0 ||
          selectedIndex >= users.length
        ) {
          console.error(
            `${styles.fg.red}Invalid selection. Exiting.${styles.reset}`
          );
          rl.close();
          process.exit(1);
        }
        rl.close();
        resolve(users[selectedIndex].uid);
      }
    );
  });
};

// JWT Secret Key
const secretKey = process.env.JWT_SECRET;

// Function to generate a JWT token
const generateToken = () => {
  const payload = {
    uid: "titasmallick",
    role: "admin",
  };

  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

// Function to make the POST request
const makeRequest = async (uid) => {
  try {
    const token = generateToken();

    const response = await fetch("https://spirogen.eugenicserudite.xyz/api/selfenroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ uid }),
    });

    const data = await response.json();
    console.log("\nPublic Link Generated:", data);
  } catch (error) {
    console.error(
      `${styles.fg.red}Error making request: ${error.message}${styles.reset}`
    );
  }
};

// Main function
const main = async () => {
  const users = await fetchUsers();
  if (users.length === 0) {
    console.error(
      `${styles.fg.red}No users found in Firebase Auth.${styles.reset}`
    );
    return;
  }

  const selectedUid = await promptUserSelection(users);
  console.log(
    `\n${styles.fg.green}Selected UID:${styles.reset} ${styles.fg.cyan}${selectedUid}${styles.reset}`
  );
  await makeRequest(selectedUid);

  // Footer
  console.log(
    `\n${styles.bold}${styles.fg.magenta}==== Made and Maintained by Titas Sir, Eugenics Erudite ====${styles.reset}\n`
  );
};

// Run the script
main().catch((error) =>
  console.error(
    `${styles.fg.red}Unexpected error: ${error.message}${styles.reset}`
  )
);

//

// CODE WORKS PKG NOT USE VERCEL/PKG 