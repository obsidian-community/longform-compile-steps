// author: @pseudometa
//──────────────────────────────────────────────────────────────────────────────
// DOCS https://github.com/kevboh/longform/blob/main/docs/COMPILE.md#user-script-steps
//──────────────────────────────────────────────────────────────────────────────

module.exports = {
	description: {
		name: "Sample Script",
		description: "Replaces every 'a' with an explosion emoji.",
		availableKinds: ["Manuscript"],
		options: [],
	},

	/** @param {{ contents: string }} input */
	compile(input) {
		if (!input.contents) return input;
		input.contents = input.contents.replaceAll("a", "💥");

		return input;
	},
};
