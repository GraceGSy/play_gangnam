import React from "react";
import { useEffect, useState } from "react";
import * as ReactDOMClient from 'react-dom/client';

import './App.css';

import * as d3 from "d3";

import dialogues from "./dialogue.json";

const App = () => {

	const [backgroundUrl, setBackgroundUrl] = React.useState("url(home.jpeg)");
	const [events, setEvents] = React.useState();
	// const [eventCount, setEventCount] = React.useState();

	function playAudio() {
		var audio = document.querySelector("audio")
		audio.volume = 0;
		audio.play();
        // var audio = media.volume(0).play();

		// if (audio !== undefined) {
		//     audio.then(_ => {
		//     	console.log("playing...")
		//         // Autoplay started!
		//     }).catch(error => {
		//     	console.error("error...");
		//         // Autoplay was prevented.
		//         // Show a "Play" button so that user can start playback.
		//     });
		// }
	}

	function start() {

		playAudio();

		// setBackgroundUrl("url(neighborhood.jpg)");

		d3.selectAll(".button").style("display", "none");

		let start_events = dialogues["start"];

		setEvents({"allEvents":start_events, "eventCount":0});
		// play({"allEvents":start_events, "eventCount":0});

	}

	useEffect(() => {

		d3.select("#options")
		  .selectAll(".button")
		  .style("visibility", "hidden")

		if (events) {
			
			let e = events.allEvents[events.eventCount];

			if (e.image) {
				d3.select("#background").style("background-image", `url(${e.image})`);
			}

			if (e.show) {
				d3.select("#yourDate")
					.attr("src", `${e.show}.png`)
					.style("visibility", `visible`);
			} else {
				d3.select("#yourDate").style("visibility", `hidden`);
			}

			if (e.speaker && e.speaker === "date") {
				d3.select("#textContainer").style("color", `pink`);
			} else {
				d3.select("#textContainer").style("color", `white`);
			}

			if (e.audio) {
				document.querySelector("audio").volume = 0.1;
			}

			if (e.event === "dialogue") {
				d3.select("#textContainer")
					.style("visibility", "visible")
					.style("width", "100%")
					.style("line-height", "2")
				.on("click", () => {
					let newEvents = {...events, "eventCount":events.eventCount+1};
					setEvents(newEvents);
				})

				d3.select("#textbox").text(e.text)
			} else if ((e.event === "option")) {
				d3.select("#options")
					.selectAll(".button")
					.data(e.text)
					.join("input")
					.attr("class", "button")
					.attr("type", "button")
					.attr("value", d => d[0])
					.style("visibility", "visible")
					.style("display", "block")
					.style("margin-top", "20px")
					.style("margin-bottom", "20px")
					.on("click", function (e, d) {
						let newEvents = {"allEvents":[...dialogues[d[1]]], "eventCount":0};
						setEvents(newEvents);
					})
			}

			
		}

	}, [events])

	let button_style = {
		"width":"30%",
		"padding:":"25px",
		"display":"flex",
		"justifyContent":"center",
		"flexDirection":"column"
	}

	let text_container = {
		"visibility":"hidden",
		"width": "0%",
		"height": "30%",
	    "background": "rgba(63, 79, 73, 0.80)",
	    "color": "white",
	    "fontFamily": "sans-serif",
	    "paddingTop": "20px",
	    "paddingLeft": "100px",
	    "position": "fixed",
	    "bottom":0,
	    "overflow":"hidden"
	}

	let text_style = {
		"width": "80%"
	}

	let date_style = {
		"height":"80%",
		"backgroundSize":"cover",
		"position":"fixed",
		"right": 25,
		"bottom": 0,
		"visibility": "hidden"
	}

	return (

		<div id="background" style={{"height":"100%",
							"width":"100%",
							"backgroundImage":backgroundUrl,
							"backgroundSize":"cover",
							"display":"flex",
							"flexDirection":"column",
							"alignItems":"center",
							"justifyContent":"center"}}>
			<img id="yourDate" style={date_style} />
			<div id="textContainer" style={text_container}>
				<p style={text_style} id="textbox"></p>
			</div>
			<div id="buttons" style={button_style}>
				<input className="button" type="button" value="START GAME" onClick={start} />
			</div>
			<div id="options" style={button_style}>
			</div>
			<audio loop>
				<source src="/gangnam_audio.m4a" type="audio/mpeg" />
			</audio>
		</div>

	)

}

const container = document.getElementById('root');

const root = ReactDOMClient.createRoot(container);

root.render(<App />);