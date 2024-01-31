import BottomBar from "@/components/shared/BottomBar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Topbar from "@/components/shared/Topbar";
import { Outlet, Navigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

const RootLayout = () => {
	const { isAuthenticated } = useUserContext();

	if (isAuthenticated) {
		return (
			<div className="w-full md:flex">
				<Topbar />
				<LeftSidebar />
				<section className="flex flex-1 h-full">
					<Outlet />
				</section>
				<BottomBar />
			</div>
		);
	} else {
		return <Navigate to="/sign-in" />;
	}
};

export default RootLayout;
