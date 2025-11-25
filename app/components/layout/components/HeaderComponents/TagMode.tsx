import { FC, useState, useRef } from "react";
import { ExportOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { useAppMode } from "~/context/AppModeContext";
import { useNavigate } from "@remix-run/react";
import { UserRole } from "~/interfaces/users.interface";
import { AppMode } from "~/interfaces/app.interface";

const ANIM_MS = 400;

const TagMode: FC<{ role: UserRole, fullWidth?: boolean }> = ({ role, fullWidth }) => {
  const { mode, setMode } = useAppMode();
  const navigate = useNavigate();
  const [pulse, setPulse] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const changeMode = () => {
    const currentMode = mode;
    setMode(currentMode === AppMode.User ? AppMode.Admin : AppMode.User);

    setTimeout(() => {
      navigate(currentMode === AppMode.User ? "/admin/home" : "/");
    }, 1);
  };

  const handleClick = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    setPulse(false);
    rafRef.current = requestAnimationFrame(() => {
      setPulse(true);
      timeoutRef.current = window.setTimeout(() => setPulse(false), ANIM_MS);
    });

    changeMode();
  };

  if (role !== UserRole.ADMIN) return null;

  return (
    <div className="flex">
      <Tag
        color={mode === AppMode.User ? "blue" : "purple"}
        className={`mt-1 cursor-pointer tag-mode ${pulse ? "pulse" : ""} ${fullWidth ? "flex-grow mx-2" : ""
          }`}
        style={{ padding: "3px 8px" }}
        onClick={handleClick}
      >
        <ExportOutlined /> {mode === AppMode.User ? "Admin" : "User"} Mode
      </Tag>
    </div>
  )
};

export default TagMode;