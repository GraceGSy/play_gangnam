import React from "react";
import { useEffect, useState } from "react";
import * as ReactDOMClient from 'react-dom/client';

import './App.css';

import * as d3 from "d3";

import dialogues from "./dialogue.json";

const App = () => {

	const [backgroundUrl, setBackgroundUrl] = React.useState("url(./home.jpeg)");
	const [events, setEvents] = React.useState();
	const [name, setName] = React.useState("Your Name");

	function playAudio() {
		var audio = document.querySelector("audio")
		audio.volume = 0;
		audio.play();
	}

	function start() {

		playAudio();

		d3.selectAll("#playButton").style("display", "none");

		let start_events = dialogues["instructions"];
		setEvents({"allEvents":start_events, "eventCount":0});

	}

	function begin() {

		let start_events = dialogues["start"];

		d3.select("#fullscreen").style("display", "none");
		setEvents({"allEvents":start_events, "eventCount":0});

	}

	useEffect(() => {

		d3.select("#options")
		  .selectAll(".button")
		  .style("visibility", "hidden")

		if (events) {
			
			let e = events.allEvents[events.eventCount];

			if (e.Image) {
				d3.select("#background").style("background-image", `url(${e.Image})`);
			}

			if (e.Show) {
				d3.select("#yourDate")
					.attr("src", `${e.Show}.png`)
					.style("visibility", `visible`);
			} else {
				d3.select("#yourDate").style("visibility", `hidden`);
			}

			if (e.Speaker && e.Speaker === "date") {
				d3.select("#textbox")
					.style("color", `pink`)
					.style("text-align", "right")
					.style("font-style", "italic");
			} else {
				d3.select("#textbox")
					.style("color", `white`)
					.style("text-align", "left")
					.style("font-style", "normal");
			}

			if (e.Audio) {
				document.querySelector("audio").volume += parseFloat(e.Audio);
			}

			if (e.Event === "Dialogue") {
				d3.select("#textContainer")
					.style("visibility", "visible")
					.style("width", "100%")
					.style("line-height", "2")
				.on("click", () => {
					let newEvents = {...events, "eventCount":events.eventCount+1};
					setEvents(newEvents);
				})

				d3.select("#textbox").html(e.Text.replace('[Your Name]', name))
			} else if ((e.Event === "Option")) {
				d3.select("#options")
					.selectAll(".button")
					.data(e.Text)
					.join("input")
					.attr("class", "button")
					.attr("type", "button")
					.attr("value", d => d[0])
					.style("visibility", "visible")
					.style("display", "block")
					.style("margin-top", "20px")
					.style("margin-bottom", "20px")
					.style("padding", "10px")
					.style("border-radius", "10px")
					.style("cursor", "pointer")
					.style("border", "solid 1px black")
					.on("click", function (e, d) {
						let newEvents = {"allEvents":[...dialogues[d[1]]], "eventCount":0};
						setEvents(newEvents);
					})
			} else if ((e.Event === "Goto")) {
				let newEvents = {"allEvents":[...dialogues[e.Text]], "eventCount":0};
				setEvents(newEvents);
			} else if ((e.Event === "Fullscreen")) {
				let fdiv = d3.select("#fullscreen")
					.style("visibility", "visible")
					.style("width", "80%")
					.style("height", "80%")
					.style("line-height", "2");
				
				fdiv.select("#fullscreen_text")
					.selectAll(".fparagraph")
					.data(e.Text)
					.join("div")
					.attr("class", "fparagraph")
					.style("margin-top", "20px")
					.style("margin-bottom", "20px")
					.html(d => d);
			} else if (e.Event === "Video") {
				d3.select("button").style("display", "none");
				d3.select("#yourDate").style("display", "none");
				d3.select("#textContainer").style("display", "none");
				d3.select("#options").style("display", "none");

				let fdiv = d3.select("#fullscreen")
					.style("visibility", "visible")
					.style("width", "80%")
					.style("height", "80%")
					.style("line-height", "2")
					.style("display", "flex")
					.style("z-index", "2");
				
				fdiv.selectAll(".fparagraph")
					.data([e.Text])
					.join("div")
					.attr("class", "fparagraph")
					.style("margin-top", "20px")
					.style("margin-bottom", "20px")
					.html(d => d);

				fdiv.selectAll("input").style("display", "none");

				d3.select(`#${e.Video}`).style("display", "block");

				document.querySelector("audio").volume = 0;

				var video = document.querySelector(`#${e.Video}`)
				video.play();
			} else if (e.Event === "End") {
				d3.select("button").style("display", "none");
				d3.select("#yourDate").style("display", "none");
				d3.select("#textContainer").style("display", "none");
				d3.select("#options").style("display", "none");
				d3.select("#background").style("backgroundImage", "none").style("background", "rgba(0, 0, 0, 1)");


				d3.select("#ending")
					.style("display", "flex")				
			}

			
		}

	}, [events])

	let button_style = {
		"width":"30%",
		"padding:":"25px",
		"display":"flex",
		"justifyContent":"center",
		"flexDirection":"column",
		"position": "fixed",
		"top": "25%"
	}

	let play_button_style = {
		"border": "solid 2px black",
		"borderRadius": "10px",
		"padding": "10px",
		"letterSpacing": "2px",
		"fontWeight": 600,
		"cursor": "pointer"
	}

	let text_container = {
		"visibility":"hidden",
		"width": "0%",
		"height": "30%",
	    "background": "rgba(35, 46, 42, 0.93)",
	    "color": "white",
	    "fontFamily": "sans-serif",
	    "paddingTop": "20px",
	    "paddingLeft": "450px",
	    "position": "fixed",
	    "bottom":0,
	    "overflow":"hidden"
	}

	let text_style = {
		"width": "60%"
	}

	let fullscreen = {
		"visibility":"hidden",
		"width": "0%",
		"height": "0%",
	    "background": "rgba(35, 46, 42, 0.93)",
	    "color": "white",
	    "fontFamily": "sans-serif",
	    "overflow":"hidden",
	    "display":"flex",
	    "flexDirection":"column",
	    "justifyContent":"center",
	    "alignItems":"center",
	}

	let fullscreen_style = {
		"width": "80%",
		"marginBottom":"20px"
	}

	let fullscreen_button = {
		"marginLeft":"10px",
		"border": "solid 1px black",
		"borderRadius": "10px",
		"padding": "10px 50px",
		"letterSpacing": "2px",
		"fontWeight": 600,
		"cursor": "pointer"
	}

	let fullscreen_input = {
		"padding": "8px",
	}

	let date_style = {
		"height":"80%",
		"backgroundSize":"cover",
		"position":"fixed",
		"right": 25,
		"bottom": 0,
		"visibility": "hidden"
	}

	let video_style = {
		"position": "fixed",
		"right": 0,
		"bottom": 0,
		"minWidth": "100%",
		"minHeight": "100%",
		"display":"none",
	}

	let end_scene = {
		"display": "none",
		"width": "100%",
		"height": "100%",
		"background": "rgba(0, 0, 0, 1)",
		"color": "white",
		"justifyContent": "center",
		"alignItems": "center",
		"fontFamily":"sans-serif"
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
			<div id="fullscreen" style={fullscreen}>
				<div style={fullscreen_style} id="fullscreen_text"></div>
				<div>
					<input style={fullscreen_input} type="text" id="lname" name="lname" value={name} onChange={(event) => setName(event.target.value)}/>
					<input style={fullscreen_button} className="button" type="button" value="I'M READY" onClick={begin} />
				</div>
			</div>
			<img id="yourDate" style={date_style} />
			<div id="textContainer" style={text_container}>
				<p style={text_style} id="textbox"></p>
			</div>
			<div id="buttons" style={button_style}>
				<input id="playButton" className="button" type="button" value="PLAY GAME" onClick={start} style={ play_button_style } />
			</div>
			<div id="options" style={button_style}>
			</div>
			<audio loop>
				<source src="./gangnam_audio.m4a" type="audio/mpeg" />
			</audio>
			<video id="ending1" style={video_style}>
				<source src="./ending1.mp4" type="video/mp4" />
			</video>
			<video id="ending2" style={video_style}>
				<source src="./ending2.mp4" type="video/mp4" />
			</video>
			<div id="ending" style={end_scene}>
				<h1>THE END</h1>
			</div>
		</div>

	)

}

const container = document.getElementById('root');

const root = ReactDOMClient.createRoot(container);

root.render(<App />);