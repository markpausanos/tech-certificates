import { useState } from "react";
import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableCell,
	TableBody,
	TableRow,
	Alert,
	Button,
	TextField,
} from "@mui/material";
import { TECHNICIAN_HEADERS, DUMMY_DATA } from "./utils";
import { useScrape } from "./hooks/useScrape";
import "./App.css";
import { TestService } from "./services/TestService";

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

function App() {
	const [userData, setUserData] = useState(initialData);
	const [birthDateError, setBirthDateError] = useState(false);
	const { isScraping, scrapedData, error, scrapeData } = useScrape();

	const handleChange = (e) => {
		const { name, value } = e.target;

		let tempValue = value;

		if (name == "Birthdate" && value.length > 10) {
			return;
		}

		if (name === "Phone" && value.length > 10) {
			return;
		}

		setUserData((prevData) => ({
			...prevData,
			[name]: tempValue,
		}));

		const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/; // MM/DD/YYYY format
		if (name === "Birthdate" && !dateRegex.test(value) && value.length == 10) {
			setBirthDateError(() => true);
		} else {
			setBirthDateError(() => false);
		}
	};

	const handleSubmit = async () => {
		// await scrapeData(userData);
		// setUserData(initialData);/
		const response = await TestService.retrieveVGI(
			userData.FirstName,
			userData.LastName
		);

		console.log(response);
	};

	return (
		<div className="h-screen w-screen flex flex-col items-center px-7 pt-10 gap-10">
			<div>
				<h1 className="text-3xl font-bold">Technician Data Search</h1>
			</div>
			<div className="w-full px-10 flex flex-row gap-10">
				<div className="flex flex-col  gap-5 w-1/3">
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
						error={birthDateError}
					/>
				</div>
				<div className=" bg-black w-0.5" />
				<div className="flex flex-col gap-5 w-1/3">
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
				<div className="flex flex-col gap-5 w-1/3">
					<TextField
						name="CertificateNumber"
						label="Certificate Number"
						value={userData.CertificateNumber}
						fullWidth
						style={{
							background: "#E8E8E9",
						}}
						onChange={handleChange}
					/>
					<TextField
						name="Phone"
						label="Phone"
						value={userData.Phone}
						fullWidth
						type="tel"
						style={{
							background: "#E8E8E9",
						}}
						onChange={handleChange}
					/>

					<div className="mt-auto w-full flex flex-col gap-2">
						<Alert severity="success">Results Saved to Sheets</Alert>
						<Button
							variant="contained"
							color="primary"
							style={{
								width: "100%",
							}}
							onClick={handleSubmit}
						>
							Search and Save to Sheets
						</Button>
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
