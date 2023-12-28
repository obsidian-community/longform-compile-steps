// author: @pseudometa
//──────────────────────────────────────────────────────────────────────────────

/* global module */
module.exports = {
	description: {
		name: "Remove Tasks",
		description: "open and completed tasks",
		availableKinds: ["Manuscript"],
		options: []
	},

	/** @param {{ contents: string }} input */
	compile (input) {
		input.contents = input.contents.replace (/\s*- \[[ x]] .*(\n|$)/gm, "");
		return input;
	}

};
