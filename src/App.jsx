import { useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { useScrape } from "./hooks/useScrape";
import "./App.css";
import { BarLoader } from "react-spinners";
import { states } from "./utils";

const initialData = {
	FirstName: "",
	MiddleName: "",
	LastName: "",
	City: "",
	State: "",
	ZipCode: "",
	CertificateNumber: "",
	SSN: "",
	Birthdate: "",
	Phone: "",
};

const initialFieldErrorStatus = {
	FirstName: false,
	MiddleName: false,
	LastName: false,
	City: false,
	State: false,
	ZipCode: false,
	CertificateNumber: false,
	SSN: false,
	Birthdate: false,
	Phone: false,
};

function App() {
	const [userData, setUserData] = useState(initialData);
	const [fieldErrors, setFieldErrors] = useState(initialFieldErrorStatus);
	const { isScraping, scrapedData, error, websiteDataCount, scrapeData } =
		useScrape();

	const handleChange = (e) => {
		const { name, value } = e.target;

		let tempValue = value;

		if (name == "Birthdate" && value.length > 10) {
			return;
		}

		if (name === "Phone" && value.length > 10) {
			return;
		}

		if (name === "State") {
			if (userData.State.length > 0) {
				const stateAbbreviation = states[value.toLowerCase()];
				if (stateAbbreviation) {
					tempValue = stateAbbreviation;
				}
			}
		}

		setUserData((prevData) => ({
			...prevData,
			[name]: tempValue,
		}));

		const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // MM/DD/YYYY format
		if (name === "Birthdate" && !dateRegex.test(value) && value.length == 10) {
			setFieldErrors((prevErrors) => ({
				...prevErrors,
				Birthdate: true,
			}));
		} else {
			setFieldErrors((prevErrors) => ({
				...prevErrors,
				Birthdate: false,
			}));
		}
	};

	const handleSubmit = async () => {
		// trim each userData value

		const trimObject = (obj) => {
			let trimmed = {};
			for (let key in obj) {
				trimmed[key] = obj[key].trim();
			}
			return trimmed;
		};

		setUserData(() => trimObject(userData));
		setFieldErrors(initialFieldErrorStatus);

		await scrapeData(userData);

		if (!error) {
			setUserData(initialData);
		}
	};

	return (
		<div className="h-full w-screen flex flex-col items-center px-7 pt-10 gap-3 md:gap-10 justify-center">
			<div className="h-44 md:h-[15vh] md:block w-full">
				<img
					src="/service.png"
					alt="ESCO Logo"
					className="object-contain h-full w-full"
				/>
			</div>
			<div className="flex flex-col md:flex-row justify-evenly w-full">
				<div className="invisible md:visible w-1/4 md:w-1/3">
					<div className="border-b-4 my-4 border-black"></div>
				</div>
				<div className="w-full md:w-1/2 text-center">
					<h1 className="text-lg sm:text-2xl md:text-4xl font-bold">
						Technician Data Search
					</h1>
				</div>
				<div className="invisible md:visible w-1/4 md:w-1/3">
					<div className="border-b-4 my-4 border-black"></div>
				</div>
			</div>
			<div>
				<h2 className=" text-base sm:text-lg md:text-2xl">
					Enter the technician&apos;s details below:
				</h2>
			</div>

			<div className="w-full px-10 flex flex-col md:flex-row gap-10 border-gray-300 border-2 py-5">
				<div className="flex flex-col gap-5 w-full md:w-1/3">
					<TextField
						name="FirstName"
						label="First Name"
						value={userData.FirstName}
						fullWidth
						style={{
							background: "#E8E8E9",
						}}
						onChange={handleChange}
					/>
					<TextField
						name="MiddleName"
						label="Middle Name"
						value={userData.MiddleName}
						fullWidth
						style={{
							background: "#E8E8E9",
						}}
						onChange={handleChange}
					/>
					<TextField
						name="LastName"
						label="Last Name"
						value={userData.LastName}
						fullWidth
						style={{
							background: "#E8E8E9",
						}}
						onChange={handleChange}
					/>
					<TextField
						name="Birthdate"
						label="Birth Date (MM/DD/YYYY)"
						value={userData.Birthdate}
						fullWidth
						style={{
							background: "#E8E8E9",
						}}
						onChange={handleChange}
						error={fieldErrors.Birthdate}
					/>
					<TextField
						name="SSN"
						label="SSN"
						value={userData.SSN}
						fullWidth
						type="tel"
						style={{
							background: "#E8E8E9",
						}}
						onChange={handleChange}
					/>
				</div>
				<div className=" bg-black w-0.5" />
				<div className="flex flex-col gap-5 w-full md:w-1/3">
					<TextField
						name="City"
						label="City"
						value={userData.City}
						fullWidth
						style={{
							background: "#E8E8E9",
						}}
						onChange={handleChange}
					/>
					<TextField
						name="State"
						label="State"
						value={userData.State}
						fullWidth
						style={{
							background: "#E8E8E9",
						}}
						onChange={handleChange}
					/>
					<TextField
						name="ZipCode"
						label="Zip Code"
						value={userData.ZipCode}
						fullWidth
						type="number"
						style={{
							background: "#E8E8E9",
						}}
						onChange={handleChange}
					/>
					<TextField
						name="CertificateNumber"
						label="Certificate Number or Code"
						value={userData.CertificateNumber}
						fullWidth
						style={{
							background: "#E8E8E9",
						}}
						onChange={handleChange}
					/>
					<TextField
						name="Phone"
						label="Phone (10 Numbers)"
						value={userData.Phone}
						fullWidth
						type="tel"
						style={{
							background: "#E8E8E9",
						}}
						onChange={handleChange}
					/>
				</div>
				<div className=" bg-black w-0.5" />

				<div className="w-full gap-10 md:w-1/3 md:gap-0 flex flex-col items-center justify-between">
					<div className="w-full h-1/2 flex items-start">
						<Button
							variant="contained"
							color="secondary"
							style={{
								minHeight: "5vh",
								width: "100%",
								textTransform: "none",
							}}
							onClick={() => setUserData(initialData)}
						>
							Clear Fields
						</Button>
					</div>
					<div className="w-full h-1/2 flex flex-col justify-end">
						{!isScraping && error && <Alert severity="error">{error}</Alert>}
						{!isScraping && scrapedData.length > 0 && !error && (
							<div className="w-full">
								<Alert severity="success">{`${
									scrapedData.length > 20 ? "Top 20 " : ""
								}Results Saved to Sheets`}</Alert>
							</div>
						)}
						{!isScraping && scrapedData.length > 0 && !error && (
							<div className="w-full">
								<Alert severity="info">
									{Object.keys(websiteDataCount).map((key, index) => {
										return (
											<p key={index}>
												{websiteDataCount[key] > 0
													? `${key.toUpperCase()} found ${
															websiteDataCount[key]
													} record(s) ${
															websiteDataCount[key] > 20
																? "(Too many records to save)"
																: ""
													}`
													: ""}
											</p>
										);
									})}
								</Alert>
							</div>
						)}

						{!isScraping && (
							<Button
								variant="contained"
								color="primary"
								style={{
									minHeight: "5vh",
									width: "100%",
									textTransform: "none",
								}}
								onClick={handleSubmit}
							>
								Search and Save to Sheets
							</Button>
						)}
						{isScraping && <BarLoader color="blue" width={"100%"} />}
					</div>
				</div>
			</div>
			<div className="ml-auto">
				{/* <div>
						<TableContainer component={Paper} style={{ width: "90vw" }}>
							<Table size="small" aria-label="simple table">
								<TableHead style={{ background: "green" }}>
									{TECHNICIAN_HEADERS.map((header, index) => (
										<TableCell
											key={index}
											size="5vw"
											style={{
												padding: "10px",
												textAlign: "center",
												color: "white",
												fontWeight: "bold",
												fontSize: "0.75rem",
											}}
										>
											{header}
										</TableCell>
									))}
								</TableHead>
								<TableBody>
									{DUMMY_DATA.map((data, dataIndex) => (
										<TableRow key={dataIndex}>
											{Object.values(data).map((value, valueIndex) => (
												<TableCell
													key={valueIndex}
													size="5vw"
													style={{
														padding: "10px",
														textAlign: "center",
														fontSize: "0.75rem",
													}}
												>
													{value}
												</TableCell>
											))}
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</div> */}
			</div>
		</div>
	);
}

export default App;
