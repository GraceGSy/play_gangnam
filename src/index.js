import React from "react";
import { useEffect, useState } from "react";
import * as ReactDOMClient from 'react-dom/client';
import './App.css';
import * as d3 from "d3";

const App = () => {

	const [backgroundUrl, setBackgroundUrl] = React.useState("url(/home.jpeg)");
	const [events, setEvents] = React.useState();
	// const [eventCount, setEventCount] = React.useState();

	let string = "testing";

	function playAudio() {
		var promise = document.querySelector("audio").play();
        // var promise = media.play();

		if (promise !== undefined) {
		    promise.then(_ => {
		    	console.log("playing...")
		        // Autoplay started!
		    }).catch(error => {
		    	console.error("error...");
		        // Autoplay was prevented.
		        // Show a "Play" button so that user can start playback.
		    });
		}
	}

	function start() {

		playAudio();

		setBackgroundUrl("url(/neighborhood.jpg)");

		d3.selectAll(".button").style("display", "none");

		let start_events = [{"event":"dialogue", "text":"June 12th, 20XX"},
							{"event":"dialogue", "text":"It's another warm day in Seoul."},
							{"event":"dialogue", "text":"The neighborhood ladies are making their morning jog through the park again."},
							{"event":"dialogue", "text":"And you are on your way home from the local convenience store, when you hear your phone buzzing..."},
							{"event":"option", "text":["You pick up your phone"]}];

		setEvents({"allEvents":start_events, "eventCount":0});

	}

	useEffect(() => {

		if (events) {
			let e = events.allEvents[events.eventCount];

			if (e.event === "dialogue") {
				d3.select("#textbox")
					.style("visibility", "visible")
					.style("width", "100%")
					.text(e.text)
				.on("click", () => {
					let newEvents = {...events, "eventCount":events.eventCount+1};
					setEvents(newEvents);
				})
			} else if ((e.event === "option")) {
				console.log("here");
				d3.select(".button")
					.attr("value", e.text[0])
					.style("display", "block")
			}

			
		}

		

	}, [events])

	let button_style = {
		"width":"30%",
		"padding:":"25px",
	}

	let text_style = {
		"visibility":"hidden",
		"width": "0%",
		"height": "30%",
	    "background": "rgba(63, 79, 73, 0.80)",
	    "color": "white",
	    "fontFamily": "sans-serif",
	    "paddingTop": "20px",
	    "paddingLeft": "50px",
	    "position": "fixed",
	    "bottom":0
	}

	return (

		<div id="background" style={{"height":"100%",
							"width":"100%",
							"backgroundImage":backgroundUrl,
							"backgroundSize":"cover",
							"display":"flex",
							"alignItems":"center",
							"justifyContent":"center"}}>
			<p style={text_style} id="textbox"></p>
			<input className="button" style={button_style} type="button" value="START GAME" onClick={start} />
			<audio loop>
				<source src="/gangnam_audio.mp3" type="audio/mpeg" />
			</audio>
		</div>

	)

}

const container = document.getElementById('root');

const root = ReactDOMClient.createRoot(container);

root.render(<App />);