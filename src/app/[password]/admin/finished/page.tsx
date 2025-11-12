"use client";

import { getMenus, getOrdersToServe, Menu, Order } from "@/data";
import { delay } from "@/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import menuCroques from "@public/menu-croques.svg";

export default function Finished() {
  return (
    <div className="finished">
      <h1>We&apos;re all out ! Sorry :{")"}</h1>
    </div>
  );
}
