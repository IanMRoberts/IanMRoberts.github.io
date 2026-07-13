export interface ProjectImage {
	type?: "image";
	// Filename of an image in src/images/projects/ (e.g. "my-project.jpg")
	file: string;
	alt: string;
}

export interface ProjectVideo {
	type: "video";
	// Filename of a video in src/images/projects/ (e.g. "my-project.mp4")
	file: string;
	alt: string;
	// Optional: defaults to 16:9 if omitted.
	width?: number;
	height?: number;
}

export type ProjectMedia = ProjectImage | ProjectVideo;

export interface Project {
	year: string;
	title: string;
	description: string;
	category: string;
	// First item is used as the cover when only one is needed. Add more
	// to show a slideshow with next/prev controls. Mix images and videos
	// freely by adding `type: "video"` to an entry.
	media: ProjectMedia[];
}

// Listed in display order (top to bottom on the page) — put newest first.
// To add a project: drop image/video file(s) into src/images/projects/ and
// add an entry below referencing their filenames.
export const projects: Project[] = [
	{
		year: "2026",
		title: "Rocking Horse",
		description: "A cherry and maple rocking horse.",
		category: "Woodworking",
		media: [
			{ file: "Horse1.png", alt: "A cherry and maple rocking horse." },
			{ file: "HorseCad.png", alt: "CAD model." }
		],
	},
	{
		year: "2026",
		title: "Guitar Stands",
		description: "Maple guitar stands.",
		category: "Woodworking",
		media: [
			{ file: "GuitarStands.png", alt: "A pair of maple guitar stands." },
			{ file: "GuitarStandStiching.png", alt: "Hand stitched leather." },
			{ file: "GuitarStandFilled.png", alt: "Stand in use." },
		],
	},
];
