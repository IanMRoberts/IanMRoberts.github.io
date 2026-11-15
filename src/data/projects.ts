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
		category: "Woodworking and CAD/CAM",
		media: [
			{ file: "Horse1.png", alt: "A cherry and maple rocking horse." },
			{ file: "HorseCad.png", alt: "CAD model." }
		],
	},
	{
		year: "2026",
		title: "Lidar Scanner",
		description: "Rotating mount for a VLP-16 lidar sensor to create highly detailed 360 degree scans.",
		category: "Hardware and software",
		media: [
			{ file: "LidarRender.jpg", alt: "Lidar point cloud rendered in Blender." },
			{ type: "video",file: "Lidar (1).mp4", alt: "Lidar Scanning.", width: 720, height: 480 },
		],
	},
	{
		year: "2026",
		title: "Guitar Stands",
		description: "Maple guitar stands.",
		category: "Woodworking and CAD/CAM",
		media: [
			{ file: "GuitarStands.png", alt: "A pair of maple guitar stands." },
			{ file: "GuitarStandStiching.png", alt: "Hand stitched leather." },
			{ file: "GuitarStandFilled.png", alt: "Stand in use." },
		],
	},
	{
		year: "2025",
		title: "Custom PCBs",
		description:
			"Custom PCB machined on my CNC router for an electronics project.",
		category: "Electronics and CAD/CAM",
		media: [
			{ file: "custom-pcb-1-milled-board-dime.jpg", alt: "A machined copper PCB next to a dime for scale." },
			{ file: "custom-pcb-2-assembled-board.jpg", alt: "The assembled board on a desk with a microcontroller, motor drivers, and jumper wires." },
			{ file: "custom-pcb-3-board-with-sensor.jpg", alt: "The wired-up board with a small sensor module held in hand." },
		],
	},
	{
		year: "2024",
		title: "Headphone Mod",
		description: "Custom fostex headphone mod with wooden cups.",
		category: " Leatherworking",
		media: [
			{ file: "Headphones1.png", alt: "" },
			{ file: "Headphones2.png", alt: "" },
			{ file: "Headphones3.png", alt: "" },
			{ file: "Headphones4.png", alt: "" },
			{ file: "Headphones5.png", alt: "" },
			{ file: "Headphones6.png", alt: "" },
		],
	},
	{
		year: "2024–2026",
		title: "CNC Upgrades (CNC V2)",
		description:
			"Aluminum plate, ball screws, linear bearings, and a 2.2 kW spindle for my CNC router, plus redesigned 240V control electronics.",
		category: "Hardware and CAD/CAM",
		media: [
			{ file: "cnc-v2-05-finished-machine.jpg", alt: "The finished CNC router with a router on the gantry, a slatted bed, a vise, and a dust hose." },
			{ file: "cnc-v2-01-bare-gantry-frame.jpg", alt: "The bare aluminum gantry frame on the wooden table base." },
			{ file: "cnc-v2-02-gantry-end-plates.jpg", alt: "The gantry with black end plates and aluminum rails." },
			{ file: "cnc-v2-03-ball-screw-linear-bearings.jpg", alt: "A ball screw and linear bearing blocks on a black plate." },
			{ file: "cnc-v2-04-z-axis-mounted.jpg", alt: "The Z-axis column mounted on the gantry." },
			{ file: "cnc-v2-06-birch-plywood-cut-parts.jpg", alt: "A birch plywood sheet with nested parts cut out on the machine bed." },
			{ file: "cnc-v2-07-old-electronics-enclosure.jpg", alt: "The original control enclosure with tangled wiring." },
			{ file: "cnc-v2-08-old-electronics-power-supply.jpg", alt: "The original enclosure showing the power supply and wiring." },
			{ file: "cnc-v2-09-air-cooled-spindle.jpg", alt: "The new 2.2 kW air-cooled spindle with its cables." },
			{ file: "cnc-v2-10-new-enclosure-empty.jpg", alt: "The new enclosure with DIN rails, terminal blocks, and a power supply, before wiring." },
			{ file: "cnc-v2-11-new-panel-wiring.jpg", alt: "The new control panel partway through wiring." },
			{ file: "cnc-v2-12-new-panel-finished.jpg", alt: "The finished control panel with color-coded wiring." },
		],
	},
	{
		year: "2024",
		title: "Custom Smart Hose Water Valve",
		description:
			"Fail-safe smart hose valve controlled by a Raspberry Pi Zero over MQTT, closing automatically if power or communication is lost.",
		category: "Electronics and software",
		media: [
			{ file: "smart-hose-valve-1-valve-and-box.jpg", alt: "A blue motorized ball valve on copper pipe between basement joists, wired to an electrical box." },
			{ file: "smart-hose-valve-2-valve-wide.jpg", alt: "A wider view of the valve installed below a manual ball valve." },
			{ file: "smart-hose-valve-3-valve-closeup.jpg", alt: "A close-up of the blue motorized valve." },
		],
	},
	{
		year: "2024",
		title: "Leather Watch Strap",
		description: "Hand-stitched leather watch strap.",
		category: " Leatherworking",
		media: [
			{ file: "WatchStrapFinal.png", alt: "A hand-stitched leather watch strap." },
			{ file: "WatchStrapWIP1.png", alt: "Test fitting the strap." },
			{ file: "WatchStrapWIP2.png", alt: "WIP" },
			{ file: "WatchStrapWIP3.png", alt: "WIP" },
		],
	},
	{
		year: "2023",
		title: "Bike Rebuild",
		description:
			"Road bike rebuilt with a new carbon fiber frame and the components from a crashed Trek Domane.",
		category: "Mechanical",
		media: [
			{ file: "bike-rebuild-3-finished-bike-on-roof-rack.jpg", alt: "The finished bike on a car roof rack." },
			{ file: "bike-rebuild-1-old-domane-destroyed-frame.jpg", alt: "The original Trek Domane before it was rebuilt, with a crash-damaged frame." },
			{ file: "bike-rebuild-2-new-carbon-frame.jpg", alt: "The new matte-black carbon fiber frame and fork with components laid out on a table." },
		],
	},
	{
		year: "2020",
		title: "Plywood CNC (CNC V1)",
		description:
			"A CNC router built from plywood and aluminum extrusion to find out whether building my own machine was worth the investment.",
		category: "Woodworking and CAD/CAM",
		media: [
			{ type: "video", file: "cnc-v1-7-video.mp4", alt: "The plywood CNC in operation.", width: 1080, height: 1920 },
			{ file: "cnc-v1-1-aluminum-extrusion.jpg", alt: "A hand holding a length of aluminum extrusion." },
			{ file: "cnc-v1-2-bearing-prototype-brackets.jpg", alt: "A plywood panel with threaded rod and 3D-printed brackets for a custom bearing prototype." },
			{ file: "cnc-v1-3-control-enclosure.jpg", alt: "An open enclosure with controller boards, a power supply, and a relay board." },
			{ file: "cnc-v1-4-linear-rails-ball-screw-plate.jpg", alt: "A plywood plate with linear rails and a ball screw." },
			{ file: "cnc-v1-5-gantry-plates-on-rails.jpg", alt: "Plywood gantry plates standing on aluminum extrusion rails." },
			{ file: "cnc-v1-6-gantry-closeup.jpg", alt: "A close-up of the plywood gantry on its rails." },
		],
	},
	{
		year: "2020",
		title: "Couch",
		description:
			"A couch frame designed and built to fit cushions left over from a reupholstered couch.",
		category: "Woodworking",
		media: [
			{ file: "couch-1-frame-bare.jpg", alt: "The bare slatted wood couch frame on a patio." },
			{ file: "couch-5-finished-with-cushions.jpg", alt: "The finished couch with coral cushions." },
			{ file: "couch-6-finished-closeup.jpg", alt: "A closer view of the finished couch." },
			{ file: "couch-7-finished-side-view.jpg", alt: "The finished couch from the side." },
		],
	},
];
