// author: @pseudometa
//──────────────────────────────────────────────────────────────────────────────

module.exports = {
	description: {
		name: "Remove all YAML but first",
		description: "Removes all YAML frontmatter except for the one from the first scene.",
		availableKinds: ["Scene"],
		options: [],
	},

	/** @typedef {Object} sceneObj defined at https://github.com/kevboh/longform/blob/main/docs/COMPILE.md#user-script-steps
	 * @property {string} contents - text contents of scene
	 * @param {sceneObj[]} scenes
	 */
	compile(scenes) {
		let isFirstFile = true;
		const frontmatterRegex = /^\n*---\n.*?\n---\n/s;

		return scenes.map((scene) => {
			if (isFirstFile) {
				isFirstFile = false;
				return scene;
			}
			scene.contents = scene.contents.replace(frontmatterRegex, "");
			return scene;
		});
	},
};
