"use strict";

import { app, protocol, BrowserWindow } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);
let win;
async function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
    },
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

//
// // // // // // // // // // // // // // // // // //
//
// Bcrypt.
//
// // // // // // // // // // // // // // // // // //
//

const bcrypt = require("bcrypt");
const adminInformations = {
  name: "IBOUDGHACENE",
  lastname: "Salah",
  email: "salah.iboudghacene@gmail.com",
  token: "TOKEN",
  login: "root",
  passwordHash: "$2b$10$84NUlvhbzZ3PNU.M9DCVlOyF6DCQ9PPiNmP4SPlwiP4idBizcEgsu",
};

//
// // // // // // // // // // // // // // // // // //
//
// ipcMain.
//
// // // // // // // // // // // // // // // // // //
//

import { ipcMain } from "electron";
app.allowRendererProcessReuse = false;

ipcMain.on("form-login-submission-event", (event, args) => {
  if (args.login == adminInformations.login) {
    bcrypt
      .compare(args.password, adminInformations.passwordHash)
      .then((validationLogin) => {
        if (validationLogin) {
          event.sender.send("form-login-response", {
            name: adminInformations.name,
            lastname: adminInformations.lastname,
            email: adminInformations.email,
            token: adminInformations.token,
            status: validationLogin,
          });
        } else
          event.sender.send("form-login-response", {
            errorMessage: "mot de passe incorrect.",
            status: validationLogin,
          });
      });
  } else
    event.sender.send("form-login-response", {
      errorMessage: "Utilisateur introuvable.",
      status: false,
    });
});

//
// // // // // // // // // // // // // // // // // //
//
// SerialPort .
//
// // // // // // // // // // // // // // // // // //
//

let SerialPort = require("serialport"); // include the serialport library

// try to make it automaticaly
let portName = "/dev/tty.usbserial-1420"; // get the port name from the command line

// list of ports
SerialPort.list().then(
  (ports) => ports.forEach((port) => console.log(port.path)),
  (err) => console.error(err)
);

var myPort = new SerialPort(portName, 9600); // open the port
var Readline = SerialPort.parsers.Readline; // make instance of Readline parser
var parser = new Readline(); // make a new parser to read ASCII lines
myPort.pipe(parser); // pipe the serial stream to the parser

// these are the definitions for the serial events:
myPort.on("open", showPortOpen); // called when the serial port opens
myPort.on("close", showPortClose); // called when the serial port closes
myPort.on("error", showError); // called when there's an error with the serial port
myPort.on("data", readSerialData); // called when there's new data incoming

// these are the functions called when the serial events occur:
function showPortOpen() {
  console.log("port open. Data rate: " + myPort.baudRate);
}

function readSerialData(idCard) {
  bipSystem();
  let nom = "Un NOM";
  let prenom = "et un Prénom";
  let jour = getFormattedDate();
  let statu = true;
  getRandomAvatar()
    .then((link) => {
      win.webContents.send("send-card-data", {
        name: nom,
        lastname: prenom,
        date: jour,
        image: link,
        status: statu,
      });
    })
    .catch((err) => console.error(err));
}

function showPortClose() {
  console.log("port closed.");
}

function showError(error) {
  console.error("Serial port error: " + error);
}

function giveInstructions() {
  console.log("you did not give a port name");
  console.log("To run this properly, type \n");
  console.log("node serial-in.js portname\n");
  console.log("run the listPorts script to get a list of ports.\n");
  process.exit(0);
}

function getFormattedDate() {
  var date = new Date();
  var str =
    addZero(date.getDate()) +
    "/" +
    addZero(date.getMonth() + 1) +
    "/" +
    date.getFullYear() +
    " " +
    addZero(date.getHours()) +
    ":" +
    addZero(date.getMinutes()) +
    ":" +
    addZero(date.getSeconds());
  return str;
}

const addZero = (e) => {
  if (e < 10) e = "0" + e;
  return e;
};

// Function

const axios = require("axios");

const getRandomAvatar = () => {
  return new Promise((resolve, reject) => {
    let apiLink = "https://api.unsplash.com/photos/random";
    axios
      .get(apiLink, {
        params: {
          client_id: "A_r_gQcTWkExaO1uXo2t5R-ou2ySnqwY8S6ioXOfMyo",
          query: "face",
        },
      })
      .then(function(response) {
        let link = response.data.urls.thumb;
        resolve(link);
      })
      .catch(function(error) {
        console.error(error);
      });
  });
};

const bipSystem = () => console.log("\u0007");
