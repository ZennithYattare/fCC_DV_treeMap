/** @format */

import * as d3 from "d3";

// TODO - Visualize Data with a Treemap Diagram
export async function treeMap() {
	// the urlArray is an array of two fetch requests
	const urlArray = [
		fetch(
			"https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
		),
	];

	// the function getData() is an async function that returns an array of two elements
	// the first element is the data from the first fetch request, for_user_education.json for the data
	// the second element is the data from the second fetch request, counties.json for the topography
	async function getData() {
		let data;
		try {
			const response = await Promise.allSettled(urlArray);

			const successArray = [];
			response.map((obj) => {
				if (obj.status === "fulfilled") {
					successArray.push(obj.value);
				}
			});

			if (successArray.length !== urlArray.length) {
				throw new Error("Some promises were rejected");
			}

			data = await Promise.allSettled(
				successArray.map((response) => response.json())
			);
		} catch (e) {
			console.log(e);
		}
		return [data[0].value];
	}

	const [dataArray] = await getData();

	console.log(dataArray.children);

	const width = 950;
	const height = 600;

	const svg = d3
		.select("#tree-map")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("class", "svg");

	const tooltip = d3
		.select("#tree-map")
		.append("div")
		.attr("id", "tooltip")
		.style("opacity", 0)
		.style("background-color", "white")
		.style("border", "solid")
		.style("border-width", "2px")
		.style("border-radius", "3px")
		.style("padding", "3px")
		.style("position", "absolute")
		.style("text-align", "center");

	const legend = d3
		.select("#legend")
		.append("svg")
		.attr("id", "legend-svg")
		// set margin left and right to be auto
		.style("margin-left", "auto")
		.style("margin-right", "auto")
		// add a 10 px margin top
		.style("margin-top", "10px")
		.attr("width", 360)
		.attr("height", 150);

	const colorScheme = d3.scaleOrdinal().range(
		// create an array of twenty different colors
		d3
			.quantize((t) => d3.interpolateCubehelixDefault(t * 0.5 + 0.1), 18)
			.reverse()
		// explain the line of code above
		// d3.quantize((t) => d3.interpolateSpectral(t * 0.5 + 0.1), 20)
		// t is a number between 0 and 1
		// d3.interpolateSpectral(t * 0.5 + 0.1) is a function that takes a number between 0 and 1 and returns a color
		// d3.quantize((t) => d3.interpolateSpectral(t * 0.5 + 0.1), 20) is a function that takes a function and a number and returns an array of the function applied to the number of elements specified
		// .reverse() is a function that reverses the order of the elements in an array
	);

	// Three functions that change the tooltip when user hover / move / leave a cell
	const mouseover = function (d) {
		tooltip.style("opacity", 0.7);
		d3.select(this).style("stroke", "black").style("opacity", 1);
	};

	const mousemove = function (event, d) {
		tooltip
			.html(
				"Name: " +
					d.data.name +
					"<br>" +
					"Category: " +
					d.data.category +
					"<br>" +
					"Value: " +
					d.data.value
			)
			.style("left", event.pageX + 30 + "px")
			.style("top", event.pageY + "px");
		tooltip.attr("data-value", d.data.value);
	};

	const mouseleave = function (d) {
		tooltip.style("opacity", 0);
		d3.select(this).style("stroke", "none").style("opacity", 0.8);
	};

	const root = d3
		.hierarchy(dataArray, (d) => d.children)
		.sum((d) => d.value)
		.sort((a, b) => b.value - a.value);

	const treemap = d3.treemap().size([width, height]).padding(1);

	treemap(root);

	const gameTiles = root.leaves();

	const cell = svg
		.selectAll("g")
		.data(gameTiles)
		.enter()
		.append("g")
		.attr("transform", (d) => `translate(${d.x0}, ${d.y0})`);

	const tile = cell.append("rect").attr("class", "tile");

	tile.attr("data-name", (d) => d.data.name)
		.attr("data-category", (d) => d.data.category)
		.attr("data-value", (d) => d.data.value)
		.attr("width", (d) => d.x1 - d.x0)
		.attr("height", (d) => d.y1 - d.y0)
		.attr("fill", (d, i) => colorScheme(d.data.category))
		.on("mouseover", mouseover)
		.on("mousemove", mousemove)
		.on("mouseleave", mouseleave);

	cell.append("text")
		.attr("class", "tile-text")
		.selectAll("tspan")
		.data((d) =>
			// use regex to split the name of the game into an array of words
			d.data.name.split(/(?=[A-Z][^A-Z])/g)
		)
		.enter()
		.append("tspan")
		// change the font size to 10
		.attr("font-size", 10)
		.attr("x", 4)
		.attr("y", (d, i) => 15 + i * 10)
		.text((d) => d);

	const categories = dataArray.children.map((d) => d.name);

	const legendMain = legend
		.append("g")
		.selectAll("g")
		.data(categories)
		.enter()
		.append("g")
		.attr("class", "legend")
		.attr("transform", (d, i) => {
			// xOffset changes the spacing between the columns of the legend
			const xOffset = (i % 3) * 150;
			// yOffset changes the spacing between the rows of the legend
			const yOffset = Math.floor(i / 3) * 25;
			return `translate(${xOffset}, ${yOffset})`;
		});

	legendMain
		.append("rect")
		.attr("class", "legend-item")
		.attr("width", 15)
		.attr("height", 15)
		.attr("fill", (d) => colorScheme(d));

	legendMain
		.append("text")
		.attr("x", 20)
		.attr("y", 13)
		.text((d) => d);
}
