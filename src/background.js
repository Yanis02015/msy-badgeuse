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
// jsonwebtoken. for Token
//
// // // // // // // // // // // // // // // // // //
//

const jwt = require("jsonwebtoken");

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
  randomTokenSecret:
    "8sjqWFnOU841kRCeO0pG06Xw5JYz015o6RoeIU1ns44oq4D2KlRMovu7kZ1lp9cR04SYb1pZ4V9q5DBzXN463j0UH5l7jWhPw2B267mT0i3FV2Mg6rKmPFdQ5s6sO17tv7GxvUUROC2PUsw02F2hrQZgrdS6OtgIu7yPRiHt8o2273eK1h2mZ51UFgd9AHsy7Tg47048",
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
            token: jwt.sign(
              { admin_login: adminInformations.login },
              adminInformations.randomTokenSecret,
              {
                expiresIn: "24h",
              }
            ),
            login: adminInformations.login,
            status: validationLogin,
          });
          event.sender.send("alert-event", {
            model: true,
            text: "Connecté avec sucéée",
            type: "success",
          });
        } else {
          event.sender.send("form-login-response", {
            errorMessage: "mot de passe incorrect.",
            status: validationLogin,
          });
          event.sender.send("alert-event", {
            model: true,
            text: "Connexion échoué, mot de passe incorrect!",
            type: "error",
          });
        }
      });
  } else {
    event.sender.send("form-login-response", {
      errorMessage: "Utilisateur introuvable.",
      status: false,
    });
    event.sender.send("alert-event", {
      model: true,
      text: "Connexion échoué, nom d'utilisateur incorrect",
      type: "error",
    });
  }
});

ipcMain.on("add-new-card-event", (event, args) => {
  console.log(args);
  try {
    let token = args.token.split(" ")[1];
    const decodedToken = jwt.verify(token, adminInformations.randomTokenSecret);
    let admin_login = decodedToken.admin_login;
    if (admin_login !== adminInformations.login) {
      responseToTheRenderer(event, "alert-event", {
        model: true,
        text: "Erreur d'authentification",
        type: "error",
      });
      responseToTheRenderer(event, "add-new-card-response", {
        status: false,
        message: "",
      });
    }

    insertIntoEmploye(args.employe, args.vehicle)
      .then((res) => {
        if (res) {
          responseToTheRenderer(event, "alert-event", {
            model: true,
            text: "Carte ajouté avec succées",
            type: "success",
          });
          responseToTheRenderer(event, "add-new-card-response", {
            status: true,
          });
        } else {
          responseToTheRenderer(event, "alert-event", {
            model: true,
            text: "Carte non ajouté",
            type: "error",
          });
          responseToTheRenderer(event, "add-new-card-response", {
            status: false,
          });
        }
      })
      .then(() => {
        getAllEmploye().then((data) => {
          responseToTheRenderer(event, "show-all-card-replay", {
            status: true,
            message: "Employés récupéré avec succée",
            employees: data,
          });
        });
      })
      .catch((err) => {
        console.warn("error ------");
        responseToTheRenderer(event, "alert-event", {
          model: true,
          text: "Requête invalide",
          type: "error",
        });
        responseToTheRenderer(event, "add-new-card-response", {
          status: false,
        });
      });
  } catch (error) {
    responseToTheRenderer(event, "alert-event", {
      model: true,
      text: "Requête invalide",
      type: "error",
    });
    responseToTheRenderer(event, "add-new-card-response", {
      status: false,
    });
  }
});

ipcMain.on("show-all-user-event", (event, args) => {
  try {
    let token = args.token.split(" ")[1];
    const decodedToken = jwt.verify(token, adminInformations.randomTokenSecret);
    let admin_login = decodedToken.admin_login;
    if (admin_login !== adminInformations.login)
      event.sender.send("show-all-user-replay", {
        status: false,
        message: "Token invalide",
      });
    else {
      getAllEmploye().then((data) => {
        event.sender.send("show-all-user-replay", {
          status: true,
          message: "Employés récupéré avec succée",
          employees: data,
        });
      });
    }
  } catch (error) {
    responseToTheRenderer(event, "alert-event", {
      model: true,
      text: "Erreur d'authentification",
      type: "error",
    });
  }
});

ipcMain.on("show-all-timer", (event, args) => {
  try {
    let token = args.token.split(" ")[1];
    const decodedToken = jwt.verify(token, adminInformations.randomTokenSecret);
    let admin_login = decodedToken.admin_login;
    if (admin_login !== adminInformations.login)
      responseToTheRenderer(event, "show-all-user-replay", {
        status: false,
        message: "Token invalide",
      });
    else {
      getAllTimer()
        .then((res) => {
          responseToTheRenderer(event, "show-all-timer-replay", res);
        })
        .catch((err) => {
          throw err;
        });
    }
  } catch (error) {}
});

ipcMain.on("dismiss-employe-event", (event, args) => {
  try {
    let token = args.token.split(" ")[1];
    const decodedToken = jwt.verify(token, adminInformations.randomTokenSecret);
    let admin_login = decodedToken.admin_login;
    if (admin_login !== adminInformations.login)
      event.sender.send("show-all-user-replay", {
        status: false,
        message: "Token invalide",
      });
    else {
    }
  } catch (error) {
    event.sender.send("show-all-user-replay", {
      status: false,
      message: "Requête invalide",
    });
  }
});

ipcMain.on("edit-employe-event", (event, args) => {
  try {
    let token = args.token.split(" ")[1];
    const decodedToken = jwt.verify(token, adminInformations.randomTokenSecret);
    let admin_login = decodedToken.admin_login;
    if (admin_login !== adminInformations.login) {
      responseToTheRenderer(event, "edit-employe-replay", {
        status: false,
        message: "Token invalide",
      });
      responseToTheRenderer(event, "alert-event", {
        model: true,
        text: "Erreur d'authentification",
        type: "error",
      });
    } else {
      updateEmploye(args.employe)
        .then((response) => {
          if (response) {
            responseToTheRenderer(event, "edit-employe-replay", {
              status: true,
              message: "Employé modifier avec succée",
            });
            responseToTheRenderer(event, "alert-event", {
              model: true,
              text: "Les informations de l'employé modifier avec succée",
              type: "success",
            });
          } else {
            responseToTheRenderer(event, "edit-employe-replay", {
              status: false,
              message: "Erreur de connexion",
            });
            responseToTheRenderer(event, "alert-event", {
              model: true,
              text: "Erreur de connexion",
              type: "error",
            });
          }
        })
        .catch((err) => {
          responseToTheRenderer(event, "edit-employe-replay", {
            status: false,
            message: "Promise invalide",
          });
          responseToTheRenderer(event, "alert-event", {
            model: true,
            text: "Erreur inattendu",
            type: "error",
          });
          throw err;
        });
    }
  } catch (error) {
    responseToTheRenderer(event, "edit-employe-replay", {
      status: false,
      message: "Token invalide catch",
    });
    responseToTheRenderer(event, "alert-event", {
      model: true,
      text: "Erreur d'authentification",
      type: "error",
    });
  }
});

ipcMain.on("set-employe-inactive-event", (event, args) => {
  try {
    let token = args.token.split(" ")[1];
    const decodedToken = jwt.verify(token, adminInformations.randomTokenSecret);
    let admin_login = decodedToken.admin_login;
    if (admin_login !== adminInformations.login) {
      responseToTheRenderer(event, "employe-inactive-replay", {
        status: false,
        message: "Token invalide",
      });
      responseToTheRenderer(event, "alert-event", {
        model: true,
        text: "Erreur d'authentification",
        type: "error",
      });
    } else {
      updateEmployeStatus(args.employe)
        .then((response) => {
          if (response) {
            responseToTheRenderer(event, "employe-inactive-replay", {
              status: true,
              message: "Employé supprimé avec succée",
            });
            responseToTheRenderer(event, "alert-event", {
              model: true,
              text: "Employé supprimé avec succée",
              type: "success",
            });
          } else {
            responseToTheRenderer(event, "employe-inactive-replay", {
              status: false,
              message: "Erreur de connexion",
            });
            responseToTheRenderer(event, "alert-event", {
              model: true,
              text: "Erreur de connexion",
              type: "error",
            });
          }
        })
        .catch((err) => {
          responseToTheRenderer(event, "employe-inactive-replay", {
            status: false,
            message: "Promise invalide",
          });
          responseToTheRenderer(event, "alert-event", {
            model: true,
            text: "Erreur inattendu",
            type: "error",
          });
          throw err;
        });
    }
  } catch (error) {
    responseToTheRenderer(event, "employe-inactive-replay", {
      status: false,
      message: "Token invalide catch",
    });
    responseToTheRenderer(event, "alert-event", {
      model: true,
      text: "Erreur d'authentification",
      type: "error",
    });
  }
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
let portName = "/dev/tty.usbserial-1410"; // get the port name from the command line

// list of ports
SerialPort.list().then(
  (ports) => ports.forEach((port) => console.log(port.path)),
  (err) => console.error(err)
);

var myPort = new SerialPort(portName, 9600); // open the port
var Readline = SerialPort.parsers.Readline; // make instance of Readline parser
var parser = new Readline(); // make a new parser to read ASCII lines
myPort.pipe(parser); // pipe the serial stream to the parser

// these are the functions called when the serial events occur:
function showPortOpen() {
  console.log("port open. Data rate: " + myPort.baudRate);
}

let newIdCard = "";
const readSerialData = (data) => {
  bipSystem();
  let date = getFormattedDate();

  let idCard = data.toString();
  idCard = idCard.substring(11);
  console.log("ID CARTE = " + idCard);

  employeIfExists(idCard)
    .then((response) => {
      if (response) {
        timerIsEnded(idCard)
          .then((response) => {
            if (response.status) {
              getEmployeById(idCard)
                .then((data) => {
                  data.date = date.time;
                  data.starting = true;
                  win.webContents.send("send-card-data", data);
                })
                .catch((err) => {
                  throw err;
                });
              insertIntoTimer(
                {
                  day: date.day,
                  startAt: date.time,
                  endAt: "NULL",
                },
                idCard
              ).catch((err) => console.log(err));
            } else {
              let lastRowId = response.lastRowId;
              getEmployeById(idCard)
                .then((data) => {
                  data.date = date.time;
                  data.starting = false;
                  win.webContents.send("send-card-data", data);
                })
                .catch((err) => {
                  throw err;
                });
              updateTimerEndAt({
                endAt: date.time,
                lastId: lastRowId,
              }).catch((err) => console.log(err));
            }
          })
          .catch((err) => console.error(err));
      } else {
        newIdCard = idCard;
        win.webContents.send("new-card", idCard);
      }
    })
    .catch((err) => console.error(err));
};

// these are the definitions for the serial events:
myPort.on("open", showPortOpen); // called when the serial port opens
myPort.on("close", showPortClose); // called when the serial port closes
myPort.on("error", showError); // called when there's an error with the serial port
myPort.on("data", readSerialData); // called when there's new data incoming

function showPortClose() {
  console.log("port closed.");
}

function showError(error) {
  console.error("Serial port error: " + error);
}

//
// // // // // // // // // // // // // // // // // //
//
// Sqlite3 for Database
//
// // // // // // // // // // // // // // // // // //
//

const sqlite3 = require("sqlite3");
const dbName = "main.db";

let db = new sqlite3.Database(dbName, (err) => {
  if (err) throw err;
  console.log("Database stated on " + dbName);
  createTable();
});

const createTable = () => {
  // table of EMPLOYE
  db.run(
    "CREATE TABLE IF NOT EXISTS employe(idEmploye VARCHAR(50) PRIMARY KEY, name VARCHAR(50) NOT NULL, lastname VARCHAR(50) NOT NULL, phoneNumber text, address text DEFAULT 'Béjaïa', yearBirth INT CHECK(yearBirth > 1950), email text, role VARCHAR(50) DEFAULT 'Chauffeur', avatar text, status INTEGER NOT NULL DEFAULT 1 CHECK(status IN (0,1)));",
    (err) => {
      if (err) {
        throw err;
      }

      // table of TIMER
      db.run(
        "CREATE TABLE IF NOT EXISTS timer(day text NOT NULL, startAt text NOT NULL, endAt text NOT NULL default 'NULL', idEmploye VARCHAR(50) REFERENCES employe(idEmploye) ON UPDATE CASCADE ON DELETE CASCADE);",
        (err) => {
          if (err) {
            throw err;
          }
        }
      );

      // table of VEHICLE
      db.run(
        "CREATE TABLE IF NOT EXISTS vehicle(matricule VARCHAR(50), date VARCHAR(50), description text, idEmploye VARCHAR(50) REFERENCES employe(idEmploye) ON UPDATE CASCADE ON DELETE CASCADE);",
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
    }
  );
};

const getAllEmploye = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT rowid, * FROM employe", (err, data) => {
      if (err) throw err;
      resolve(data);
    });
  });
};

const getAllTimer = () => {
  ipcMain.on("print-to-pdf", (event) => {
    const pdfPath = path.join(os.tmpdir(), "some-ducking-pdf.pdf");
    const win1 = BrowserWindow.fromWebContents(event.sender);

    win1.webContents.printToPDF({}, (error, data) => {
      if (error) return console.log(error.message);

      fs.writeFile(pdfPath, data, (err) => {
        if (err) return console.log(err.message);
        shell.openExternal("file://" + pdfPath);
        event.sender.send("wrote-pdf", pdfPath);
      });
    });
  });
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT day, startAt, endAt, name, lastname, avatar FROM employe, timer WHERE employe.idEmploye = timer.idEmploye",
      (err, data) => {
        if (err) {
          resolve(false);
          throw err;
        }
        resolve(data);
      }
    );
  });
};

const getEmployeById = (idEmploye) => {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT rowid, * FROM employe WHERE idEmploye = '" + idEmploye + "';",
      (err, data) => {
        if (err) throw err;
        console.warn(data);
        resolve(data);
      }
    );
  });
};

const employeIfExists = (id) => {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT EXISTS(SELECT 1 FROM employe WHERE idEmploye="' +
        id +
        '") as exist;',
      (err, data) => {
        if (err) throw err;
        resolve(Boolean(data.exist));
      }
    );
  });
};

const timerIsEnded = (id) => {
  return new Promise((resolve, reject) => {
    let toResolve;
    db.get(
      "SELECT rowid, endAt FROM timer WHERE idEmploye='" +
        id +
        "' ORDER BY rowid DESC",
      (err, data) => {
        if (err) throw err;
        if (!data) toResolve = { status: true };
        else if (data.endAt === "NULL")
          toResolve = { status: false, lastRowId: data.rowid };
        else toResolve = { status: true };
        resolve(toResolve);
      }
    );
  });
};

const insertIntoEmploye = (employe, vehicle) => {
  return new Promise((resolve, reject) => {
    employe.idCard = newIdCard;
    let toResolve = true;
    db.run(
      "INSERT INTO employe(idEmploye, name, lastname, phoneNumber, address, yearBirth, email, role, avatar) VALUES(?,?,?,?,?,?,?,?,?);",
      [
        employe.idCard,
        employe.name.toUpperCase(),
        capitalizeFirstLetter(employe.lastname),
        employe.phoneNumber,
        capitalizeFirstLetter(employe.address),
        employe.yearBirth,
        employe.email,
        employe.role,
        employe.avatar,
      ],
      (err) => {
        if (err) {
          console.error(err);
          toResolve = false;
        } else if (employe.role === "Chauffeur")
          db.run(
            "INSERT INTO vehicle(matricule, date, description, idEmploye) VALUES(?,?,?,?);",
            [
              vehicle.matricule,
              vehicle.date,
              vehicle.description,
              employe.idCard,
            ],
            (err) => {
              if (err) toResolve = false;
            }
          );
        resolve(toResolve);
      }
    );
  });
};

const updateEmploye = (employe) => {
  return new Promise((resolve, reject) => {
    let toResolve = true;
    db.run(
      "UPDATE employe set name = ?, lastname = ?, phoneNumber = ?, address = ?, yearBirth = ?, email = ?, role = ?, avatar = ? WHERE idEmploye = ?",
      [
        employe.name,
        employe.lastname,
        employe.phoneNumber,
        employe.address,
        employe.yearBirth,
        employe.email,
        employe.role,
        employe.avatar,
        employe.idCard,
      ],
      (err) => {
        if (err) toResolve = false;
        resolve(toResolve);
      }
    );
  });
};

const updateEmployeStatus = (employe) => {
  return new Promise((resolve, reject) => {
    let toResolve = true;
    db.run(
      "UPDATE employe set status = ? WHERE idEmploye = ?",
      [employe.status, employe.idCard],
      (err) => {
        if (err) toResolve = false;
        resolve(toResolve);
      }
    );
  });
};

const insertIntoTimer = (timer, idEmploye) => {
  return new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO timer(day, startAt, endAt, idEmploye) VALUES(?,?,?,?);",
      [timer.day, timer.startAt, timer.endAt, idEmploye],
      (err) => resolve(!err)
    );
  });
};

const updateTimer = (timer, idEmploye) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE timer set day = ?, startAt = ?, endAt = ? WHERE idEmploye = ?",
      [timer.day, timer.startAt, timer.endAt, idEmploye],
      (err) => resolve(!err)
    );
  });
};

const updateTimerEndAt = (timer) => {
  return new Promise((resolve, reject) => {
    db.run(
      "UPDATE timer set endAt = ? WHERE rowid = ?",
      [timer.endAt, timer.lastId],
      (err) => resolve(!err)
    );
  });
};

//
// // // // // // // // // // // // // // // // // //
//
// Functions
//
// // // // // // // // // // // // // // // // // //
//

// const axios = require("axios");

const bipSystem = () => console.log("\u0007");

function getFormattedDate() {
  let date = new Date();
  let day =
    date.getFullYear() +
    "-" +
    addZero(date.getMonth() + 1) +
    "-" +
    addZero(date.getDate());
  let time = addZero(date.getHours()) + ":" + addZero(date.getMinutes());
  return { day: day, time: time };
}

const addZero = (e) => {
  if (e < 10) e = "0" + e;
  return e;
};

function giveInstructions() {
  console.log("you did not give a port name");
  console.log("To run this properly, type \n");
  console.log("node serial-in.js portname\n");
  console.log("run the listPorts script to get a list of ports.\n");
  process.exit(0);
}

function capitalizeFirstLetter(string) {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : string;
}

function responseToTheRenderer(event, to, playload) {
  event.sender.send(to, playload);
}
