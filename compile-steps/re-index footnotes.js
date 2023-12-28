// author: @pseudometa
//──────────────────────────────────────────────────────────────────────────────
// NOTE Re-indexing should run after all steps that remove content, e.g. tasks
// or comments, so that potential leftover footnote keys there do not influence
// the re-numbering
//──────────────────────────────────────────────────────────────────────────────

module.exports = {
	description: {
		name: "Re-Index Footnotes",
		description: "Re-Index Footnote Numbering",
		availableKinds: ["Manuscript"],
		options: []
	},

	/** @param {{ contents: string }} input */
	compile (input) {
		let text = input.contents;

		// re-index footnote-definitions
		let ft_index = 0;
		text = text.replace(/^\[\^\S+?]: /gm, function() {
			ft_index++;
			return ('[^' + String(ft_index) + ']: ');
		});

		// re-index footnote-keys
		// regex uses hack to treat lookahead as lookaround https://stackoverflow.com/a/43232659
		ft_index = 0;
		text = text.replace(/(?!^)\[\^\S+?]/gm, function() {
			ft_index++;
			return ('[^' + String(ft_index) + ']');
		});

		input.contents = text;
		return input;
	}

};
