import { Navbar } from "@mantine/core";
import { IconBook2, IconBrandAmongus, IconHome2 } from "@tabler/icons";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";
import CustomNavLink from "./CustomNavLink";

interface NavigationProps {
  opened: boolean;
}

const Navigation = ({ opened }: NavigationProps): JSX.Element => {
  const { userId, isAdmin } = useAuth();
  const location = useLocation();
  const shouldBlockNavigation = () => {
    return (
      localStorage.getItem("shouldWarn") === "true" &&
      location.pathname === "/edit-invoice/"
    );
  };
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <CustomNavLink
        to={`/?userId=${userId}`}
        label="Home"
        icon={<IconHome2 size={16} stroke={1.5} />}
        shouldBlockNavigation={shouldBlockNavigation}
      />
      <CustomNavLink
        to={`/invoices?userId=${userId}`}
        label={"Invoices"}
        icon={<IconBook2 size={16} stroke={1.5} />}
        shouldBlockNavigation={shouldBlockNavigation}
      />
      {isAdmin && (
        <CustomNavLink
          to={`/top-secret?userId=${userId}`}
          label={"Top Secret"}
          icon={<IconBrandAmongus size={16} stroke={1.5} />}
          shouldBlockNavigation={shouldBlockNavigation}
        />
      )}
    </Navbar>
  );
};

export { Navigation };
