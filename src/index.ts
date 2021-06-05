import yaml from "js-yaml";
import fs from "fs-extra";
import es from "event-stream";

interface Doc {
  schematic: {
    prisma: {
      input: string;
    };
    graphql: {
      output: string;
    };
  };
}
const { schematic }: Doc = yaml.load(fs.readFileSync("schematic.yml", "utf8"));

async function haha(lines: string[]) {
  let i = 0;
  let modelIdx: number;

  let modelRanges = {};

  // create ranges at the start of the model idx
  // and end range where it closes
  lines.map((x, idx) => {
    if (x.includes("model") || x.includes("enum")) {
      modelIdx = i++;
      modelRanges[modelIdx] = { ...modelRanges[modelIdx], start: idx };
    }

    if (x.includes("}") && modelIdx < idx) {
      modelRanges[modelIdx] = { ...modelRanges[modelIdx], end: idx };
    }

    if (idx === lines.length) i = 0;
  });

  const joke = [];
  let composed = {};
  let rangeIdx: number = 0;

  // put everthing into objects and jam it into an array
  lines.map((line, lineIdx) => {
    Object.values(modelRanges).map((obj: any) => {
      if (lineIdx >= obj.start && lineIdx <= obj.end) {
        rangeIdx = lineIdx !== obj.start ? rangeIdx + 1 : 0;
        composed[rangeIdx] = line;
      }

      if (lineIdx === obj.end + 1) {
        composed[rangeIdx + 1] = " ";
        joke.push(composed);
        rangeIdx = 0;
        composed = {};
      }
    });
  });

  let final = [];
  let blast = {};

  for (let model of joke) {
    blast = model;
    Object.values(model).map((x: string, idx) => {
      let line = x.trim();

      // first key is always where the model starts, can safely replace that word ez
      if (idx === 0) {
        if (line.includes("model")) {
          blast[0] = `${line.replace("model", "type")} \n`;
        }
        if (line.includes("enum")) {
          blast[0] = `${line} \n`;
        }
      } else if (x.trim() === "}") {
        blast[idx] = "}";
      } else {
        const breaker = x
          .trim()
          .split(" ")
          .filter((x) => x !== "");

        const gqlFieldName = breaker[0];
        const gqlFieldType = breaker[1];

        let composeField = `${gqlFieldName}: ${gqlFieldType}`;
        let recomposeField = "";

        // enum vals
        if (
          typeof gqlFieldName === "string" &&
          gqlFieldName === gqlFieldName.toUpperCase()
        ) {
          recomposeField = gqlFieldName;
        }

        if (composeField.includes("?")) {
          recomposeField = composeField.replace("?", "");
        }

        if (composeField.includes("[]")) {
          const breakArrTypes = composeField.split(" ");
          const closeIt = breakArrTypes[1].replace("[]", "");
          recomposeField = `${breakArrTypes[0]} [${closeIt}]`;
        }

        if (composeField.includes("undefined: undefined")) {
          recomposeField = " ";
        }

        blast[idx] = !recomposeField
          ? `  ${composeField} \n`
          : `  ${recomposeField} \n`;
      }
    });
    final.push(blast);
  }

  let almostThere = "";

  for (const item of final) {
    Object.values(item).map((x) => {
      almostThere = almostThere + x;
    });
  }

  fs.outputFile(schematic.graphql.output, almostThere, (err) => {
    if (err) {
      console.log(err);
    }

    fs.readFile(schematic.graphql.output, "utf8", (err, data) => {
      console.log("Tight, GP Schematic success"); // => hello!
    });
  });
}

let lines = [];
const s = fs
  .createReadStream(schematic.prisma.input)
  .pipe(es.split())
  .pipe(
    es
      .mapSync((line) => {
        //pause the readstream
        s.pause();
        lines.push(line);
        s.resume();
      })
      .on("error", (err) => {
        console.log("Error:", err);
      })
      .on("end", () => {
        console.log("Reader reads the reading");
        haha(lines);
      })
  );
