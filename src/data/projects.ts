export interface ProjectImage {
	// Filename of an image in src/images/projects/ (e.g. "my-project.jpg")
	file: string;
	alt: string;
}

export interface Project {
	year: string;
	title: string;
	description: string;
	category: string;
	// First image is used as the cover when only one is needed. Add more
	// to show a slideshow with next/prev controls.
	images: ProjectImage[];
}

// Listed in display order (top to bottom on the page) — put newest first.
// To add a project: drop image(s) into src/images/projects/ and add an
// entry below referencing their filenames.
export const projects: Project[] = [
	{
		year: "2026",
		title: "Rocking Horse",
		description: "A cherry and maple rocking horse.",
		category: "Woodworking",
		images: [{ file: "Horse1.png", alt: "A cherry and maple rocking horse." }],
	},
];
