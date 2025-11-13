"use client";

import { getMenus, getOrdersToServe, Menu, Order } from "@/data";
import { delay } from "@/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import backgroundImage from "@public/background.webp";

export default function Public() {
  const params = useParams();
  const register = params["register"] as string;
  const [ordersToServe, setOrdersToServe] = useState([] as Order[]);
  const [menus, setMenus] = useState([] as Menu[]);

  useEffect(() => {
    let fetch = true;
    let fn = async () => {
      while (fetch) {
        setOrdersToServe(await getOrdersToServe(register));
        setMenus(await getMenus());
        await delay(1000);
      }
    };

    fn();

    return () => {
      fetch = false;
    };
  }, []);

  return (
    <div
      className="public"
      style={{
        backgroundImage: `url(${backgroundImage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="menu-section">
        <h1>Croques</h1>
        <div className="menu">
          {menus.map((m, i) => {
            const menuItem = (
              <div key={i} className="menu-item">
                <h2>{m.name}</h2>
                <p>{m.description}</p>
              </div>
            );
            if (m.stocks < 5) {
              return <s key={i}>{menuItem}</s>;
            } else {
              return menuItem;
            }
          })}
        </div>
      </div>

      <div className="ready-section">
        <h1>Ready</h1>
        <div className="ready-orders">
          {ordersToServe.length > 0 ? (
            ordersToServe.slice(0, 4).map((o) => (
              <div key={o.id} className="order">
                <h2>Order {o.id}</h2>
              </div>
            ))
          ) : (
            <p>No orders ready : please wait !</p>
          )}
        </div>
      </div>
    </div>
  );
}
