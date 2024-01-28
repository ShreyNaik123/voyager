import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOut } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useEffect } from "react";

const Topbar = () => {
	const { mutate: signOut, isSuccess } = useSignOut();
	const navigate = useNavigate();
	const { user } = useUserContext();

	useEffect(() => {
		if (isSuccess) {
			navigate(0);
			// localStorage.clear();
		}
	}, [isSuccess]);

	return (
		<section className="topbar">
			<div className="flex-between py-4 px-5">
				<Link
					to="/"
					className="flex gap-3 items-center"
					// style={{ height: "30px", width: "30px" }}
				>
					<img
						src="/public/assets/images/logo-no-background.png"
						width={170}
						height={36}
					/>
				</Link>

				<div className="flex gap-4">
					<Button
						variant="ghost"
						className="shad-button_ghost"
						onClick={() => signOut()}
					>
						<img src="/public/assets/icons/logout.svg" />
					</Button>
					<Link to={`/profile/${user.id}`} className="flex-center gap-3">
						<img
							src={user.imageUrl || "/assets/images/profile-placeholder.svg"}
							alt="profile"
							className="h-8 w-8 rounded-full"
						/>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default Topbar;
