import axios from "axios";
import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(new Error(`Request took too long! Timeout after ${s} second`));
		}, s * 1000);
	});
};
// ------- NOT WORKING: with axios---------
// export const getJSON = async function (url) {
// 	await axios
// 		.get(url)
// 		.then((response) => {
// 			const data = response.data;
// 			console.log("TYPE: ", data);
// 			return data;
// 		})
// 		.catch((error) => {
// 			throw error;
// 		});
// };

// ------- WORKING: with axios ---------
export const getJSON = async function (url) {
	try {
		const response = await axios.get(url, { timeout: TIMEOUT_SEC * 1000 });
		return response.data;
	} catch (error) {
		throw error;
	}
};

// export const getJSON = async function (url) {
// 	try {
// 		const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
// 		const data = await res.json();

// 		if (!res.ok) throw new Error(`${data.message}`);
// 		return data;
// 	} catch (err) {
// 		throw err;
// 	}
// };

export const sendJSON = async function (url, uploadData) {
	try {
		const fetchPro = fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(uploadData),
		});

		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
		const data = await res.json();

		if (!res.ok) throw new Error(`${data.message} ${res.status}`);
		return data;
	} catch (err) {
		throw err;
	}
};

export const AJAX = async function (url, uploadData = undefined) {};
