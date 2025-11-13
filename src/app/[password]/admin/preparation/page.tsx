"use client";

import OrderStatus from "@/components/OrderStatus";
import {
  Menu,
  Order,
  addMenuStocks,
  getMenus,
  getOrders,
  getOrdersToPrepare,
  markAsPrepared,
} from "@/data";
import { delay } from "@/utils";
import { useEffect, useState } from "react";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function Page() {
  const [orders, setOrders] = useState([] as Order[]);
  const [ordersToPrepare, setOrdersToPrepare] = useState([] as Order[]);
  const [menus, setMenus] = useState([] as Menu[]);

  useEffect(() => {
    let fetch = true;
    let fn = async () => {
      while (fetch) {
        setOrdersToPrepare(await getOrdersToPrepare());
        setOrders(await getOrders());
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
    <div className="preparation">
      <div className="stats">
        {menus.map((m, i) => (
          <div key={i} className={`stat ${m.stocks <= 20 ? "danger" : ""}`}>
            <div className="stat-chunk">
              <h2>{m.name}</h2>
              <p>{m.description}</p>
            </div>
            <div className="stat-chunk">
              <p>
                <b className="big-num">
                  {ordersToPrepare.reduce((acc, o) => acc + o.amounts[i], 0)}{" "}
                </b>
                to prepare
              </p>
              <p>
                <b>{m.stocks} </b>
                remaining
              </p>
              <button
                onClick={() => {
                  toast.success(`Added 5 to ${m.name} stocks!`, {
                    autoClose: 1500,
                    closeButton: false,
                  });
                  addMenuStocks(i, 5);
                }}
              >
                Add 5 to stock
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="orders">
        {menus.length == 0 ? (
          <></>
        ) : (
          ordersToPrepare.map((o) => (
            <OrderStatus
              key={o.id}
              menuItems={menus}
              order={o}
              buttonText="Prepared"
              buttonAction={(id) => {
                toast.success(`Order ${id} marked as prepared!`, {
                  autoClose: 1500,
                  closeButton: false,
                });
                markAsPrepared(id);
              }}
              showDetails={false}
            />
          ))
        )}
      </div>
      <ToastContainer transition={Slide} position="top-center" />
    </div>
  );
}
