#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import * as child_process from "child_process";
import { type GatesObject, type ConfigObject } from "./types";
import { Commands } from "./enums";
import { manualContent } from "./constants";

const fileDir = path.join(os.homedir(), ".local", "share", "warp");

const gatesFilePath = path.join(fileDir, "gates.json");
const configFilePath = path.join(fileDir, "config.json");
const usageFilePath = path.join(fileDir, "usage.txt");

//TODO: create a generic function for these objects retrieval
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

function getConfigObject(): ConfigObject {
  if (fs.existsSync(configFilePath)) {
    const configContent = fs.readFileSync(configFilePath, "utf-8");
    return JSON.parse(configContent);
  } else {
    fs.writeFileSync(configFilePath, '{"CLIEditorLauncher": "code"}', "utf-8");

    const configContent = fs.readFileSync(configFilePath, "utf-8");
    return JSON.parse(configContent);
  }
}

function addGate(gatename: string) {
  if (fs.existsSync(gatesFilePath)) {
    const gatesObject = getGatesObject();

    gatesObject[`${gatename}`] = process.cwd();

    fs.writeFileSync(gatesFilePath, JSON.stringify(gatesObject), "utf-8");
  } else {
    fs.writeFileSync(
      gatesFilePath,
      `{"${gatename}": ${process.cwd()}}`,
      "utf-8"
    );
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
  const { CLIEditorLauncher } = getConfigObject();

  const GatePath = gatesObject[`${gatename}`];

  if (!GatePath) {
    console.error("Path for this gate was not found");
  }

  const command = `${CLIEditorLauncher} ${GatePath} -r`;

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
  try {
    const manualContent = fs.readFileSync(usageFilePath, {
      encoding: "utf-8",
    });

    console.log(manualContent);
  } catch {
    fs.writeFileSync(usageFilePath, manualContent, { encoding: "utf-8" });

    console.log(manualContent);
  }
}

function blinkTerminal(gatename: string) {
  const gatesObject = getGatesObject();

  console.log(gatesObject);
  const GatePath = gatesObject[`${gatename}`];

  if (!GatePath) {
    console.error("Path for this gate was not found");
  }

  child_process.exec(
    `bash ${process.cwd()}/blink-terminal.sh ${GatePath}`,
    (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
    }
  );
}

function updatePreferredEditor(editorName: string) {
  try {
    const configObject = getConfigObject();

    configObject.CLIEditorLauncher = editorName;
    fs.writeFileSync(configFilePath, JSON.stringify(configObject), "utf-8");
  } catch (error) {
    console.error("failed to change target editor");
    console.log(error);
  }
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
    case "use": {
      updatePreferredEditor(process.argv[3]);
      break;
    }
    case "list": {
      listGates();
      break;
    }
    default: {
      //TODO: might not need the Commands check here at all
      if (!Commands[process.argv[2]]) {
        blinkTerminal(process.argv[2]);
        break;
      }
      showHelp();
      break;
    }
  }
}

execute();
