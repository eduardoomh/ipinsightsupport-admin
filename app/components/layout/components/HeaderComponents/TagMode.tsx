import { useState, useRef } from "react";
import { ExportOutlined } from "@ant-design/icons";
import { Tag } from "antd";
import { useAppMode } from "~/context/AppModeContext";
import { useNavigate } from "@remix-run/react";

const ANIM_MS = 400;

const TagMode = () => {
  const { mode, setMode } = useAppMode();
  const navigate = useNavigate();
  const [pulse, setPulse] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const changeMode = () => {
    const currentMode = mode;
    setMode(currentMode === "user" ? "admin" : "user");

    setTimeout(() => {
      navigate(currentMode === "user" ? "/admin/companies" : "/");
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

  return (
    <Tag
      color={mode === "user" ? "blue" : "purple"}
      className={`mt-1 cursor-pointer tag-mode ${pulse ? "pulse" : ""}`}
      style={{ padding: "3px 8px" }}
      onClick={handleClick}
    >
      <ExportOutlined /> {mode === "user" ? "Admin" : "User"} Mode
    </Tag>
  );
};

export default TagMode;