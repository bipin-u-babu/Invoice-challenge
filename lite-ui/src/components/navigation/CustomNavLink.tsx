import { NavLink } from "@mantine/core";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ConfirmPageLeaveModal from "./ConfirmPageLeaveModal";

interface CustomLinkProps {
  to: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  shouldBlockNavigation?: () => boolean;
}

const CustomNavLink: React.FC<CustomLinkProps> = ({
  to,
  label,
  icon,
  shouldBlockNavigation,
}) => {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (shouldBlockNavigation?.()) {
      e.preventDefault();
      setPendingPath(to);
      setIsModalOpen(true);
    }
  };

  const confirmNavigation = () => {
    if (pendingPath) {
      navigate(pendingPath);
      setPendingPath(null);
    }
    setIsModalOpen(false);
  };

  const cancelNavigation = () => {
    setIsModalOpen(false);
    setPendingPath(null);
  };

  return (
    <>
      <Link to={to} onClick={handleClick} style={{ textDecoration: "none" }}>
        <NavLink label={label} icon={icon} />
      </Link>

      <ConfirmPageLeaveModal
        opened={isModalOpen}
        onCancel={cancelNavigation}
        onConfirm={confirmNavigation}
      />
    </>
  );
};

export default CustomNavLink;
