// author: @pseudometa
//──────────────────────────────────────────────────────────────────────────────

module.exports = {
	description: {
		name: "Insert Filename as Heading",
		description:
			"For unindented scenes, the inserted headings are h2. For indented scenes, the inserted heading level is increased by the indentation level.",
		availableKinds: ["Scene"],
		options: [
			{
				id: "ignore-first-file",
				name: "Ignore First File",
				description: "Useful for example to ignore a metadata file",
				type: "Boolean",
				default: true,
			},
		],
	},

	/** @typedef {Object} sceneObj defined at https://github.com/kevboh/longform/blob/main/docs/COMPILE.md#user-script-steps
	 * @property {number=} indentationLevel - The indent level (starting at zero) of the scene
	 * @property {object} metadata - Obsidian metadata of scene
	 * @property {string} contents - text contents of scene
	 * @property {string} path - path to scene
	 * @property {string} name - file name of scene
	 * @param {sceneObj[]} scenes
	 * @param {{ optionValues: { [option: string]: any; }; }} context
	 */
	compile(scenes, context) {
		const ignoreFirstFile = context.optionValues["ignore-first-file"];

		let isFirstFile = true;
		const frontmatterRegex = /^\n*---\n.*?\n---\n/s;

		return scenes.map((scene) => {
			if (isFirstFile && ignoreFirstFile) {
				isFirstFile = false;
				return scene;
			}
			// determine heading
			if (!scene.indentationLevel) scene.indentationLevel = 0;
			const headingLevel = scene.indentationLevel + 2;
			const headingLine = `${"#".repeat(headingLevel)} ${scene.name}\n`;

			// insert heading
			const frontMatterArr = scene.contents.match(frontmatterRegex);
			const yamlFrontMatter = frontMatterArr ? frontMatterArr[0] : "";
			const contentWithoutYaml = scene.contents.replace(frontmatterRegex, "");
			scene.contents = yamlFrontMatter + "\n" + headingLine + "\n" + contentWithoutYaml;

			return scene;
		});
	},
};
