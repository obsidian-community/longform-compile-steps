module.exports = {
	description: {
		name: "Reveal in Finder",
		description: "Show the Manuscript in the Windows Explorer / Finder.app",
		availableKinds: ["Manuscript"],
		options: [],
	},

	compile(_, context) {
		const app = context.app;
		const projectFolder = app.vault.getFolderByPath(context.projectPath);
		const projectFiles = projectFolder.children.filter((file) => file.extension === "md");

		// HACK longform does not expose the path of the manuscript in its API, so
		// we look for the most recently modified file instead
		// https://github.com/kevboh/longform/blob/main/docs/COMPILE.md#user-script-steps
		const lastModifiedFile = projectFiles.sort((a, b) => b.stat.mtime - a.stat.mtime)[0];
		app.showInFolder(lastModifiedFile.path);
	},
};
