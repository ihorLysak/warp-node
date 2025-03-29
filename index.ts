#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as child_process from "child_process";
import { type GatesObject } from "./types";

const fileDir = path.join(os.homedir(), ".local", "share", "warp");
const gatesFilePath = path.join(fileDir, "gates.json");

function getGatesObject(): GatesObject {
  if (fs.existsSync(gatesFilePath)) {
    const gatesContent = fs.readFileSync(gatesFilePath, "utf-8");
    return JSON.parse(gatesContent);
  } else {
    fs.writeFileSync(gatesFilePath, "{}", "utf-8");

    const gatesContent = fs.readFileSync(gatesFilePath, "utf-8");
    return JSON.parse(gatesContent);
  }
}

function addGate(gatename: string) {
  if (fs.existsSync(gatesFilePath)) {
    const gatesObject = getGatesObject();

    gatesObject[`${gatename}`] = process.cwd();

    fs.writeFileSync(gatesFilePath, JSON.stringify(gatesObject), "utf-8");
  } else {
    fs.writeFileSync(gatesFilePath, "{}", "utf-8");
  }
}

function removeGate(gatename: string) {
  if (fs.existsSync(gatesFilePath)) {
    const gatesObject = getGatesObject();
    const newGatesObject: GatesObject = {};

    for (const [key, value] of Object.entries(gatesObject)) {
      if (key === gatename) {
        continue;
      }

      newGatesObject[key] = value;
    }

    fs.writeFileSync(gatesFilePath, JSON.stringify(newGatesObject), "utf-8");
  } else {
    fs.writeFileSync(gatesFilePath, "{}", "utf-8");
  }
}

function blinkToGate(gatename: string) {
  const gatesObject = getGatesObject();

  const GatePath = gatesObject[`${gatename}`];

  if (!GatePath) {
    console.error("Path for this gate was not found");
  }

  const command = `code ${GatePath} -r`;

  child_process.exec(command, (error, _, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
  });
}

function listGates() {
  const gatesObject = getGatesObject();

  console.log("listing gate names and paths");
  for (const [key, value] of Object.entries(gatesObject)) {
    console.log(`${key}: ${value}`);
  }
}

function showHelp() {
  const manualContent = fs.readFileSync(process.cwd() + "/usage.txt", {
    encoding: "utf-8",
  });

  console.log(manualContent);
}

function execute() {
  if (!fs.existsSync(fileDir)) {
    fs.mkdirSync(fileDir);
  }
  const selectedFeature = process.argv[2];

  switch (selectedFeature) {
    case "add": {
      addGate(process.argv[3]);
      break;
    }
    case "remove": {
      removeGate(process.argv[3]);
      break;
    }
    case "blink": {
      blinkToGate(process.argv[3]);
      break;
    }
    case "list": {
      listGates();
      break;
    }
    default: {
      showHelp();
      break;
    }
  }
}

execute();
