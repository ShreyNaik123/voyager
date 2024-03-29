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
import { SignupValidation } from "@/lib/validation";
import Loader from "../../components/shared/Loader";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
	useCreateUserAccount,
	useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SignupForm = () => {
	const { toast } = useToast();
	const { checkAuthUser } = useUserContext();

	const navigate = useNavigate();

	// mutateAsync calls the mutationFn defined in the react-query
	//  : <- here is renaming the function
	const { mutateAsync: createUserAccount, isPending: isCreatingUser } =
		useCreateUserAccount();

	const { mutateAsync: signInAccount, isPending: isSigningIn } =
		useSignInAccount();

	const form = useForm<z.infer<typeof SignupValidation>>({
		resolver: zodResolver(SignupValidation),
		defaultValues: {
			username: "",
			name: "",
			password: "",
			email: "",
		},
	});

	async function onSubmit(values: z.infer<typeof SignupValidation>) {
		const newUser = await createUserAccount(values);
		// the above function is a mutated function from react-query
		// which calls the actual createUserAccount function from
		// appwrite/api.ts
		// actual mutated function name is mutateAsync, but renamed it to
		// the original function.

		if (!newUser) {
			return toast({
				title: "Sign up failed. Please try again.",
			});
		}

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

		if (isLoggedIn) {
			form.reset();
			navigate("/");
		} else {
			return toast({ title: "Sign up failed. Please try again." });
		}
	}

	return (
		<Form {...form}>
			<div className="sm:w-420 flex-center flex-col">
				<img
					className="max-w-60 max-h-52 p-0 m-0 mb-5"
					src="/assets/images/logo-no-background.png"
					alt="logo"
				/>

				<h2 className="h3-bold md:h2-bold">Create a new account</h2>
				<p className="text-light-3 small-medium md:base-regular mt-2">
					To use Voyager enter your account details
				</p>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="	flex flex-col gap-5 w-full mt-4"
				>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input type="text" className="shad-input " {...field} />
								</FormControl>
								{/* <FormDescription>
									This is your public display name.
								</FormDescription> */}
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>UserName</FormLabel>
								<FormControl>
									<Input type="text" className="shad-input " {...field} />
								</FormControl>
								{/* <FormDescription>This is your username.</FormDescription> */}
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" className="shad-input " {...field} />
								</FormControl>
								{/* <FormDescription>This is your email</FormDescription> */}
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
								{/* <FormDescription>Password</FormDescription> */}
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="shad-button_primary">
						{isSigningIn || isCreatingUser ? (
							<div className="flex-center gap-2 p-10">
								<Loader />
							</div>
						) : (
							"Sign Up"
						)}
					</Button>

					<p className="text-small-regular text-light-2 text-center mt-2">
						Already have an acccount?
						<Link
							to="/sign-in"
							className="text-primary-500 text-bold-semibold ml-1"
						>
							Log in
						</Link>
					</p>
				</form>
			</div>
		</Form>
	);
};

export default SignupForm;
