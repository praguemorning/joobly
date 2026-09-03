import React from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import styles from "./input.module.scss";
import { TextField } from "@mui/material";
import { Controller } from "react-hook-form";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	name: string;
	label: string;
	isRequired?: boolean;
	helpIcon?: boolean;
	placeholder?: string | undefined;
	endIcon?: React.JSX.Element;
	type?: string;
	startIcon?: React.JSX.Element;
	authInput?: boolean;
	pattern?: any;
	minLength?: any;
	inputProps?: any;
	rules?: any;
	control?: any;
	errors?: any;
	className?: string | undefined;
	onChangeHandler?: any;
}

const Input: React.FC<InputProps> = ({
	name,
	isRequired,
	label,
	helpIcon,
	placeholder,
	endIcon,
	type,
	startIcon,
	authInput = false,
	rules,
	inputProps = {},
	control,
	errors,
	className,
	onChangeHandler,
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
				rules={{ required: isRequired, ...rules }}
				render={({ field: { onChange, onBlur, value, name, ref } }) => (
					<TextField
						inputProps={inputProps}
						InputProps={{
							endAdornment: endIcon ? endIcon : <></>,
							startAdornment: startIcon ? startIcon : <></>,
						}}
						className={
							authInput
								? styles["custom-input-auth"]
								: `${styles["custom-input"]} ${className ? styles[className] : ""}`
						}
						placeholder={placeholder}
						{...{ onBlur, value, name, ref }}
						type={type || "text"}
						onChange={(e) => {
							let newValue = e.target.value;
							if (onChangeHandler) {
								newValue = onChangeHandler(newValue);
							}
							onChange(newValue);
						}}
					/>
				)}
			/>

			{errors[name] && (
				<p className={"error-message"}>
					{errors[name].message ? errors[name].message : "This field is required"}
				</p>
			)}
		</section>
	);
};

export default Input;
