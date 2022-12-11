import React from "react";

export default function Avatar({ user, size = 30 }) {
  if (!user) {
    return null;
  }

  return (
    <img
      src={user.picture}
      width={size}
      height={size}
      style={{ borderRadius: "50%" }}
      alt={user.username}
    />
  );
}
