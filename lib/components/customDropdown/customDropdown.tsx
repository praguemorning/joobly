import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import styles from "../input/input.module.scss";
import { Box, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { Controller } from "react-hook-form";
import Image from "next/image";

interface CustomDropdownProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	control: any;
	name: string;
	label: string;
	isRequired?: boolean;
	helpIcon?: boolean;
	placeholder?: string;
	options: any;
	countrySelect?: boolean;
	defaultValue: any;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
	control,
	name,
	isRequired,
	label,
	helpIcon,
	placeholder,
	options,
	countrySelect,
	defaultValue,
}) => {
	return (
		<section className={styles["custom-input-container"]}>
			<div className={styles["custom-input-labels"]}>
				<label className={styles["custom-input-label"]}>
					{label} {isRequired && <span>*</span>}
				</label>
				<div className={styles["custom-input-right-label"]}>
					{helpIcon && <HelpOutlineIcon className={styles["custom-input-help-icon"]} />}
				</div>
			</div>

			<Controller
				control={control}
				name={name}
				defaultValue={defaultValue}
				rules={{ required: isRequired && "This field is required" }}
				render={({ field, fieldState }) => {
					return (
                    <>
						{/* If it's country select, render it differently */}
						{countrySelect ? (
							<FormControl fullWidth variant="outlined" className={styles["custom-input"]}>
								{/* <InputLabel>{label}</InputLabel> */}
								<Select
									{...field}
									value={field.value || ""}
									onChange={(e: SelectChangeEvent<any>) => field.onChange(e.target.value)}
									label={label}
									placeholder={placeholder}
								>
									{options.map((option: any) => (
										<MenuItem key={option.code} value={option.code}>
											<Box display="flex" alignItems="center">
												<Image
													loading="lazy"
													width={20}
													height={20}
													src={`https://flagcdn.com/16x12/${option.code.toLowerCase()}.png`}
													alt="country flag"
												/>
												<span style={{ marginLeft: 8 }}>
													{option.label} ({option.code}) +{option.phone}
												</span>
											</Box>
										</MenuItem>
									))}
								</Select>
							</FormControl>
						) : (
							<FormControl fullWidth variant="outlined" className={styles["custom-input"]}>
								{/* <InputLabel>{label}</InputLabel> */}
								<Select
									{...field}
									value={field.value || defaultValue || ""}
									onChange={(e: SelectChangeEvent<any>) => field.onChange(e.target.value)}
									label={label}
									placeholder={placeholder}
								>
									{options.map((option: any) => (
										<MenuItem key={option.value} value={option.value} selected={true}>
											{option.label}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						)}

						{fieldState.error && <p className="error-message">{fieldState.error.message}</p>}
					</>
                    )
                }}
			/>
			{/* MUI Select Space Fix */}
			<p style={{ color: "transparent" }}>Error</p>
		</section>
	);
};

export default CustomDropdown;
