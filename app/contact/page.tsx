"use client";
import React, { useState } from "react";
import styles from "./contactPage.module.scss";
import Input from "@/lib/components/input/input";
import { useForm } from "react-hook-form";
import {
	emailValidationRegexp,
	HEAR_ABOUT,
	INTERESTED_IN,
	//WORK_TYPES,
} from "@/lib/constant/constants";
import FormSelect from "@/lib/components/select/select";
import Button from "@/lib/components/button/button";
import toast from "react-hot-toast";

interface Inputs {
	firstName: string;
	lastName: string;
	companyName: string;
	email: string;
	interest: string;
	hearAbout: string;
	message: string;
}

const ContactPage = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm<Inputs>();

	const onSubmit = async (values: Inputs) => {
		setIsSubmitting(true);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			});

			if (response.ok) {
				console.log('Message sent successfully');
				toast.success('Message sent successfully. We will contact you soon.');
				reset(); // Limpiar el formulario
			} else {
				throw new Error('Error sending message');
			}
		} catch (error) {
			console.error('Error:', error);
			toast.error('There was an error sending the message. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};
	return (
		<section className={styles["contact-page"]}>
			<div className={styles["contact-page__context"]}>
				<h1>How can we help you?</h1>
				<p>
					Thank you for your interest in Joobly. Please use this form to contact us. We will
					get back to you as soon as we can.
				</p>
			</div>
			<div className={styles["contact-page__form"]}>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Input
						control={control}
						errors={errors}
						name={"firstName"}
						label='First Name'
						isRequired
						placeholder='John'
					/>
					<Input
						control={control}
						errors={errors}
						name={"lastName"}
						label='Last Name'
						isRequired
						placeholder='Doe'
					/>
					<Input
						control={control}
						errors={errors}
						name={"companyName"}
						label='Company Name'
						isRequired
						placeholder='Joobly'
					/>
					<Input
						control={control}
						pattern={{
							value: emailValidationRegexp,
							message: "Invalid email address",
						}}
						errors={errors}
						name={"email"}
						label='Email address'
						isRequired
						placeholder='john.doe@gmail.com'
					/>
					<FormSelect
						isRequired
						control={control}
						name={"interest"}
						label={"I'm interested in"}
						defaultValue={"Other"}
						options={INTERESTED_IN}
					/>
					<FormSelect
						isRequired
						control={control}
						name={"hearAbout"}
						label={"Where did you hear about us?"}
						defaultValue={"Other"}
						options={HEAR_ABOUT}
					/>
					<Input
						control={control}
						errors={errors}
						name={"message"}
						label={"Message"}
						className='textArea'
						placeholder='Hi, i just wanted to let you know...'
					/>
					<Button
						type='submit'
						style={{ width: "100%" }}
						className={"btn-primary"}
						disabled={isSubmitting}
					>
						{isSubmitting ? 'Sending...' : 'Submit'}
					</Button>
				</form>
			</div>
		</section>
	);
};

export default ContactPage;
