const execSync = require('child_process').execSync;
const spawnSync = require('child_process').spawnSync;

async function compile(input, context) {
  // This is undocumented and could break.
  let basePath = context.app.vault.adapter.basePath;
  if (!basePath.endsWith("/")) {
    basePath = basePath + "/";
  }

  const pandocPath = context.optionValues["pandoc-path"].trim();
  const pdfEnginePath = context.optionValues["pdfengine-path"].trim();

  let outputPathFolder = basePath + context.optionValues["output-path"].trim();
  if (!outputPathFolder.endsWith("/")) {
    outputPathFolder = outputPathFolder + "/";
  }
  const metadataPath = basePath + context.optionValues["metadata-path"].trim();
  const openAfter = context.optionValues["open-after"];

  return input.map((sceneInput) => {
    const title = sceneInput.metadata.frontmatter.longform.title;
    const outputFile = (() => {
      const s = sceneInput.path.split("/");
      return s[s.length - 1].split(".")[0];
    })();
    const outputPath = `${outputPathFolder}${outputFile}.pdf`;
    const newInput = `# ${title}\n\n` + sceneInput.contents.replace(/\n/g, "\n\n");
    const result = spawnSync(pandocPath, ['--from=markdown', `-o ${outputPath}`, '--pdf-engine=' + pdfEnginePath, '--metadata-file=' + metadataPath], {input: newInput, encoding: "utf-8", shell: true});
    if (result.status !== 0) {
      console.log(result.stdout);
      console.log(result.stderr);
    }

    if (openAfter) {
      execSync(`open ${outputPath}`);
    }

    return {
      ...sceneInput,
      contents: newInput,
    };
  });
}

module.exports = {
  description: {
    name: "Format Scene as PDF",
    description: "Writes out every scene as a PDF via Pandoc. Primarily for single-scene projects.",
    availableKinds: ["Scene"],
    options: [
      {
        id: "pandoc-path",
        name: "Pandoc Path",
        description: "Absolute path to your pandoc binary.",
        type: "Text",
        default: "/opt/homebrew/bin/pandoc"
      },
      {
        id: "pdfengine-path",
        name: "PDF Engine Path",
        description: "Absolute path to the PDF engine for pandoc.",
        type: "Text",
        default: "/Library/TeX/texbin/pdflatex"
      },
      {
        id: "output-path",
        name: "Folder to place PDFs in.",
        description: "Generated PDFs will be placed here. Relative to vault.",
        type: "Text",
        default: "compiled/"
      },
      {
        id: "metadata-path",
        name: "LaTeX Metadata",
        description: "Path to YAML file of LaTeX metadata. Relative to vault.",
        type: "Text",
        default: "latex-metadata.yaml"
      },
      {
        id: "open-after",
        name: "Open After?",
        description: "If true, open the PDF after creating it.",
        type: "Boolean",
        default: true
      }
    ]
  },
  compile: compile
};
