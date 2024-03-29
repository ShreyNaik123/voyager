import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOut } from "@/lib/react-query/queriesAndMutations";
import { useUserContext, INITIAL_USER } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";
import Loader from "./Loader";

const LeftSidebar = () => {
	const { mutate: signOut } = useSignOut();
	const { pathname } = useLocation();
	const { user, setUser, setIsAuthenticated, isLoading } = useUserContext();
	const navigate = useNavigate();

	const handleSignOut = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		signOut();
		setIsAuthenticated(false);
		setUser(INITIAL_USER);
		navigate("/sign-in");
	};

	return (
		<nav className="leftsidebar	">
			<div className="flex flex-col gap-11">
				<Link
					to="/"
					className="flex gap-3 items-center"
					// style={{ height: "30px", width: "30px" }}
				>
					<img
						src="/assets/images/logo-no-background.png"
						height={36}
						width={170}
					/>
				</Link>
				<Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
					<img
						src={
							user.imageUrl || "/public/assets/icons/profile-placeholder.svg"
						}
						alt="profile"
						className="h-14 w-14 rounded-full"
					/>
					<div className="flex flex-col">
						<p className="body-bold">{user.name}</p>
						<p className="small-regular text-light-3">{`@${user.username}`}</p>
					</div>
				</Link>
				<ul className="flex flex-col gap-6">
					{sidebarLinks.map((link: INavLink) => {
						const isActive = pathname === link.route;
						return (
							<li
								key={link.label}
								className={`leftsidebar-link 
								group
								${isActive && "bg-primary-500"}`}
							>
								<NavLink
									to={link.route}
									className="flex gap-4 items-center p-4"
								>
									<img
										src={link.imgURL}
										alt={link.label}
										className={`group-hover:invert-white ${
											isActive && "invert-white"
										}`}
									/>
									{link.label}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</div>
			<Button
				variant="ghost"
				className="shad-button_ghost"
				onClick={(e) => handleSignOut(e)}
			>
				<img src="/assets/icons/logout.svg" />
				<p className="small-medium lg:base-medium	">
					{isLoading ? <Loader /> : "Logout"}
				</p>
			</Button>
		</nav>
	);
};

export default LeftSidebar;
