// author: @pseudometa
//──────────────────────────────────────────────────────────────────────────────

module.exports = {
	description: {
		name: "Convert Image Wikilinks to MD Links",
		description: "For third-party applications like Pandoc. Step must come before any 'Remove Wikilinks' step.",
		availableKinds: ["Manuscript"],
		options: [],
	},

	/**
	 * @param {{ contents: string; }} input
	 * @param {{ app: { metadataCache: { getFirstLinkpathDest: (arg0: any, arg1: any) => { (): any; new (): any; path: any; }; }; }; projectPath: any; }} context
	 */
	compile(input, context) {
		const imageWikiLinkRegex = /!\[\[(.*?\.(?:png|jpe?g|tiff))(?:\|(.+))?]]/g; // https://regex101.com/r/8Qzbod/1

		input.contents = input.contents.replace(imageWikiLinkRegex, function (_fullmatch, capture1, capture2) {
			const innerWikilink = capture1 || "";
			const aliasToInsert = capture2 || "";
			const imageTFile = context.app.metadataCache.getFirstLinkpathDest(innerWikilink, context.projectPath);
			if (!imageTFile) return `__⚠️ IMAGE NOT FOUND__ ![${aliasToInsert}](${innerWikilink})`;
			return `![${aliasToInsert}](${imageTFile.path})`;
		});
		return input;
	},
};
