import { Navbar, NavLink } from "@mantine/core";
import { IconBook2, IconBrandAmongus, IconHome2 } from "@tabler/icons";
import { Link, RouteObject } from "react-router-dom";
import { useAuth } from "../../auth/AuthProvider";

interface NavigationProps {
  opened: boolean;
}

type LinkDisplayOptions = {
  label: string;
  icon: JSX.Element;
};

type NavigationLink = RouteObject & LinkDisplayOptions;

const Navigation = ({ opened }: NavigationProps): JSX.Element => {
  const { userId, isAdmin } = useAuth();
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <Link to={`/?userId=${userId}`}>
        <NavLink label="Home" icon={<IconHome2 size={16} stroke={1.5} />} />
      </Link>
      <Link to={`/invoices?userId=${userId}`}>
        <NavLink
          label={"Invoices"}
          icon={<IconBook2 size={16} stroke={1.5} />}
        />
      </Link>
      {isAdmin && (
        <Link to={`/top-secret?userId=${userId}`}>
          <NavLink
            label={"Top Secret"}
            icon={<IconBrandAmongus size={16} stroke={1.5} />}
          />
        </Link>
      )}
    </Navbar>
  );
};

export { Navigation };
