import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { SigninValidation } from "@/lib/validation";
import Loader from "../../components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SigninForm = () => {
	const { toast } = useToast();
	const { checkAuthUser } = useUserContext();

	const navigate = useNavigate();

	// mutateAsync calls the mutationFn defined in the react-query
	//  : <- here is renaming the function

	const { mutateAsync: signInAccount, isPending: isUserLoading } =
		useSignInAccount();

	const form = useForm<z.infer<typeof SigninValidation>>({
		resolver: zodResolver(SigninValidation),
		defaultValues: {
			password: "",
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof SigninValidation>) {
		console.log("onSubmit");
		const session = await signInAccount({
			email: values.email,
			password: values.password,
		});

		if (!session) {
			return toast({
				title: "Sign in failed. Please try again.",
			});
		}

		const isLoggedIn = await checkAuthUser();

		console.log(`isLoggedin = ${isLoggedIn}`);

		if (isLoggedIn) {
			form.reset();
			navigate("/");
		} else {
			console.log("Error siging in ");
			toast({ title: "Sign up failed. Please try again." });
			return;
		}
	}

	return (
		<Form {...form}>
			<div className="sm:w-420 flex-center flex-col">
				<img
					className="max-w-60 max-h-52 p-0 m-0 mb-5"
					src="/public/assets/images/logo-no-background.png"
					// src="/public/assets/images/logo.svg"
					alt="logo"
				/>

				<h2 className="h3-bold md:h2-bold">Log in to your account</h2>
				<p className="text-light-3 small-medium md:base-regular mt-2">
					Welcome Back!
				</p>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="	flex flex-col gap-5 w-full mt-4"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" className="shad-input " {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input type="password" className="shad-input " {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="shad-button_primary">
						{isUserLoading ? (
							<div className="flex-center gap-2 p-10">
								<Loader />
							</div>
						) : (
							"Sign In"
						)}
					</Button>

					<p className="text-small-regular text-light-2 text-center mt-2">
						Don't have an acccount?
						<Link
							to="/sign-up"
							className="text-primary-500 text-bold-semibold ml-1"
						>
							Sign Up
						</Link>
					</p>
				</form>
			</div>
		</Form>
	);
};

export default SigninForm;