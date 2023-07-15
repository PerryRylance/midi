const fs = require("fs");
const { globSync } = require("glob");
const froms = [];

for(let file of globSync("./src/**/*.ts"))
{
	if(/\.d\.ts$/.test(file))
		continue;
	
	file = "./" + file.replace(/\\/g, '/');
	file = file.replace(/\.ts$/, "");

	froms.push(file);
}

const lines = froms.map(from => `export * from "${from}";`);

fs.writeFileSync("./index.ts", lines.join("\r\n"));